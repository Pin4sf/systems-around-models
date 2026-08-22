import { execFile } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { parse as parseYaml } from "yaml";

const execFileAsync = promisify(execFile);
const privateCorpusName = ["waldo", "brain"].join("-");
const allowedEvidenceLabels = new Set([
  "observed", "author-reported", "inferred", "proposed", "unproved",
]);
const allowedArchitectureGrades = new Set(["IP", "FD"]);
const excludedDirectories = new Set([
  ".git", ".next", ".superpowers", ".worktrees", "coverage", "node_modules", "out",
  "playwright-report", "test-results",
]);
const sourceTextExtensions = new Set([
  ".cjs", ".css", ".env", ".html", ".js", ".json", ".jsx", ".md", ".mdx", ".mjs",
  ".svg", ".toml", ".ts", ".tsx", ".txt", ".xml", ".yaml", ".yml",
]);
const sourceBinaryExtensions = new Set([
  ".avif", ".br", ".eot", ".gif", ".gz", ".ico", ".jpeg", ".jpg", ".otf", ".pdf",
  ".png", ".tar", ".ttf", ".webp", ".woff", ".woff2", ".zip",
]);
const builtTextExtensions = new Set([
  ".body", ".css", ".html", ".js", ".json", ".rsc", ".svg", ".txt", ".xml",
]);

function publicName(root, filename) {
  return path.relative(root, filename).split(path.sep).join("/");
}

function isExcluded(relativeName) {
  return relativeName.split("/").some((segment) => excludedDirectories.has(segment));
}

function isReviewedSourceFile(relativeName) {
  if (isExcluded(relativeName)) return false;
  return !sourceBinaryExtensions.has(path.extname(relativeName).toLowerCase());
}

async function reviewedSourceFiles(repositoryRoot) {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["-C", repositoryRoot, "ls-files", "-z"],
      { encoding: "buffer" },
    );
    const candidates = stdout.toString("utf8").split("\0").filter(Boolean).filter(isReviewedSourceFile)
      .map((relativeName) => path.join(repositoryRoot, relativeName)).sort();
    const existing = await Promise.all(candidates.map(async (filename) => {
      try {
        await access(filename);
        return filename;
      } catch {
        return undefined;
      }
    }));
    return existing.filter(Boolean);
  } catch (error) {
    throw new Error(`Unable to derive reviewed publication files from git: ${error.message}`);
  }
}

async function filesRecursively(directory, extensions) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  const nested = await Promise.all(entries.map(async (entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesRecursively(filename, extensions);
    return entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase()) ? [filename] : [];
  }));
  return nested.flat();
}

function containsAbsoluteLocalPath(contents) {
  if (/[Ff][Ii][Ll][Ee]:\/\//.test(contents)) return true;
  if (/(?<![A-Za-z0-9+.-])[A-Za-z]:[\\/][^\s'"`]+/.test(contents)) return true;
  const backslash = String.fromCharCode(92);
  const uncPrefix = `${backslash}${backslash}`;
  if (contents.split(/\s+/).some((token) => token.startsWith(uncPrefix) && token.slice(2).includes(backslash))) {
    return true;
  }
  const withoutWebUrls = contents.replace(/\bhttps?:\/\/[^\s'"`<>{}\[\]()]+/gi, "");
  const withoutImports = withoutWebUrls
    .replace(/@\/[^\s'"`<>{}\[\]()]+/g, "")
    .replace(/(?:from\s+|import\s*)["'][^"']+["']/g, "")
    .replace(/(?:require|import)\(["'][^"']+["']\)/g, "");
  const candidates = withoutImports.match(
    /(?<![:/])\/(?!\/)(?:[A-Za-z0-9._~%-]+\/)+[A-Za-z0-9._~%+=:@,;-]+/g,
  ) ?? [];
  return candidates.some((candidate) => {
    const originalSegments = candidate.split("/").filter(Boolean);
    const segments = originalSegments.map((segment) => segment.toLowerCase());
    return originalSegments[0] === "Users" || originalSegments[0] === "Volumes" ||
      ["etc", "opt", "private", "root", "tmp", "var", "workspace"].includes(segments[0]) ||
      segments.some((segment, index) =>
        ["internal", "private"].includes(segment) ||
        (segment === "etc" && index > 0) ||
        segment === "secret" ||
        segment.startsWith("secret."),
      );
  });
}

const sensitiveChecks = [
  { label: "absolute local path", test: containsAbsoluteLocalPath },
  { label: privateCorpusName, test: (contents) => contents.toLowerCase().includes(privateCorpusName) },
  {
    label: "credential pattern",
    test: (contents) => /(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKIA[0-9A-Z]{16}\b|\bgh[pousr]_[A-Za-z0-9]{20,}\b|\bsk-[A-Za-z0-9_-]{20,}\b|\b(?:api[_-]?key|password|secret)\s*[:=]\s*["']?[^\s"']{8,})/i.test(contents),
  },
];

const highConfidenceCredential = /(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKIA[0-9A-Z]{16}\b|\bgh[pousr]_[A-Za-z0-9]{20,}\b|\bsk-[A-Za-z0-9_-]{20,}\b)/i;

async function scanSensitiveContents(root, files) {
  return (await Promise.all(files.map(async (filename) => {
    const contents = await readFile(filename, "utf8");
    return sensitiveChecks.flatMap(({ label, test }) => test(contents)
      ? [`${publicName(root, filename)}: ${label}`]
      : []);
  }))).flat();
}

async function scanBuiltContents(root, files) {
  return (await Promise.all(files.map(async (filename) => {
    const contents = await readFile(filename, "utf8");
    const extension = path.extname(filename).toLowerCase();
    const inspectable = [".js", ".css"].includes(extension)
      ? [...contents.matchAll(/["'`]([^"'`\n]{1,1000})["'`]/g)].map((match) => match[1]).join("\n")
      : contents;
    const errors = [];
    if (![".js", ".css"].includes(extension) && containsAbsoluteLocalPath(inspectable)) {
      errors.push(`${publicName(root, filename)}: absolute local path`);
    }
    if (inspectable.toLowerCase().includes(privateCorpusName)) errors.push(`${publicName(root, filename)}: ${privateCorpusName}`);
    if (highConfidenceCredential.test(inspectable)) errors.push(`${publicName(root, filename)}: credential pattern`);
    return errors;
  }))).flat();
}

function frontmatter(contents, filename, errors) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(contents);
  if (!match) {
    errors.push(`${filename}: missing YAML frontmatter`);
    return undefined;
  }
  try {
    return parseYaml(match[1]);
  } catch (error) {
    errors.push(`${filename}: invalid YAML frontmatter (${error.message})`);
    return undefined;
  }
}

async function yamlRecords(root, directory, errors) {
  const files = (await filesRecursively(path.join(root, "content", directory), sourceTextExtensions))
    .filter((filename) => [".yaml", ".yml"].includes(path.extname(filename).toLowerCase())).sort();
  const records = [];
  for (const filename of files) {
    try {
      records.push({ filename: publicName(root, filename), value: parseYaml(await readFile(filename, "utf8")) });
    } catch (error) {
      errors.push(`${publicName(root, filename)}: invalid YAML (${error.message})`);
    }
  }
  return records;
}

function requiredId(record, filename, kind, errors) {
  if (typeof record?.id !== "string" || record.id.length === 0) {
    errors.push(`${filename}: missing ${kind} identifier`);
    return undefined;
  }
  return record.id;
}

export async function checkPublicContent(root = process.cwd()) {
  const repositoryRoot = path.resolve(root);
  const surfaceFiles = await reviewedSourceFiles(repositoryRoot);
  const errors = await scanSensitiveContents(repositoryRoot, surfaceFiles);
  const surfaceContents = new Map(
    await Promise.all(surfaceFiles.map(async (filename) => [filename, await readFile(filename, "utf8")])),
  );
  const [claimRecords, sourceRecords, revisionRecords, architectureRecords, lessonRecords] = await Promise.all([
    yamlRecords(repositoryRoot, "claims", errors),
    yamlRecords(repositoryRoot, "sources", errors),
    yamlRecords(repositoryRoot, "revisions", errors),
    yamlRecords(repositoryRoot, "architectures", errors),
    yamlRecords(repositoryRoot, "lessons", errors),
  ]);
  const sourceIds = new Set();
  for (const { filename, value } of sourceRecords) {
    const id = requiredId(value, filename, "source", errors);
    if (id) sourceIds.add(id);
    if (typeof value?.license_status !== "string" || value.license_status.trim() === "") {
      errors.push(`${filename}: missing license_status`);
    }
  }
  const claimIds = new Set();
  for (const { filename, value } of claimRecords) {
    const id = requiredId(value, filename, "claim", errors);
    if (id) claimIds.add(id);
    if (!allowedEvidenceLabels.has(value?.label)) errors.push(`${filename}: invalid evidence label ${String(value?.label)}`);
    for (const sourceId of Array.isArray(value?.source_ids) ? value.source_ids : []) {
      if (!sourceIds.has(sourceId)) errors.push(`${filename}: unresolved source identifier ${sourceId}`);
    }
  }
  const revisionIds = new Set();
  for (const { filename, value } of revisionRecords) {
    const id = requiredId(value, filename, "revision", errors);
    if (id) revisionIds.add(id);
    for (const claimId of Array.isArray(value?.affected_claim_ids) ? value.affected_claim_ids : []) {
      if (!claimIds.has(claimId)) errors.push(`${filename}: unresolved claim identifier ${claimId}`);
    }
  }
  const architectureIds = new Set();
  for (const { filename, value } of architectureRecords) {
    const id = requiredId(value, filename, "architecture", errors);
    if (id) architectureIds.add(id);
    for (const sourceId of Array.isArray(value?.source_ids) ? value.source_ids : []) {
      if (!sourceIds.has(sourceId)) errors.push(`${filename}: unresolved source identifier ${sourceId}`);
    }
    if (
      value?.status === "public" &&
      value?.record_kind !== "synthetic-baseline" &&
      !allowedArchitectureGrades.has(value?.evidence_grade)
    ) {
      errors.push(`${filename}: invalid public architecture evidence grade ${String(value?.evidence_grade)}`);
    }
    if (value?.record_kind === "synthetic-baseline" && value?.evidence_grade !== undefined) {
      errors.push(`${filename}: synthetic baseline must not have an evidence grade`);
    }
  }
  for (const { filename, value } of lessonRecords) {
    requiredId(value, filename, "lesson", errors);
    for (const sourceId of Array.isArray(value?.source_ids) ? value.source_ids : []) {
      if (!sourceIds.has(sourceId)) errors.push(`${filename}: unresolved source identifier ${sourceId}`);
    }
    for (const architectureId of Array.isArray(value?.architecture_ids) ? value.architecture_ids : []) {
      if (!architectureIds.has(architectureId)) errors.push(`${filename}: unresolved architecture identifier ${architectureId}`);
    }
  }
  const essayFiles = (await filesRecursively(path.join(repositoryRoot, "content", "essays"), sourceTextExtensions))
    .filter((filename) => path.extname(filename).toLowerCase() === ".mdx").sort();
  const essays = new Map();
  for (const filename of essayFiles) {
    const name = publicName(repositoryRoot, filename);
    const metadata = frontmatter(surfaceContents.get(filename) ?? await readFile(filename, "utf8"), name, errors);
    if (!metadata || typeof metadata.slug !== "string") continue;
    essays.set(metadata.slug, metadata);
    for (const sourceId of Array.isArray(metadata.source_manifest_ids) ? metadata.source_manifest_ids : []) {
      if (!sourceIds.has(sourceId)) errors.push(`${name}: unresolved source identifier ${sourceId}`);
    }
    if (!revisionIds.has(metadata.revision_id)) {
      errors.push(`${name}: unresolved revision identifier ${String(metadata.revision_id)}`);
    }
  }
  for (const [filename, contents] of surfaceContents.entries()) {
    const topLevel = publicName(repositoryRoot, filename).split("/")[0];
    if (!["app", "components"].includes(topLevel)) continue;
    for (const match of contents.matchAll(/\/fieldbook\/([a-z0-9]+(?:-[a-z0-9]+)*)/g)) {
      const essay = essays.get(match[1]);
      if (!essay || essay.status !== "public") {
        errors.push(`${publicName(repositoryRoot, filename)}: navigation references unpublished essay ${match[1]}`);
      }
    }
  }
  if (errors.length > 0) throw new Error([...new Set(errors)].sort().join("\n"));
  return {
    filesChecked: surfaceFiles.length,
    publicEssays: [...essays.values()].filter((essay) => essay.status === "public").length,
  };
}

export async function checkBuiltOutput(root, outputDirectory) {
  const repositoryRoot = path.resolve(root);
  const outputRoot = path.resolve(outputDirectory);
  const deployableRoots = path.basename(outputRoot) === ".next"
    ? [path.join(outputRoot, "server"), path.join(outputRoot, "static")]
    : [outputRoot];
  const files = (await Promise.all(
    deployableRoots.map((directory) => filesRecursively(directory, builtTextExtensions)),
  )).flat().sort();
  const errors = await scanBuiltContents(repositoryRoot, files);
  if (errors.length > 0) throw new Error([...new Set(errors)].sort().join("\n"));
  return { filesChecked: files.length };
}

function cliOptions(arguments_) {
  const valueAfter = (flag) => {
    const index = arguments_.indexOf(flag);
    if (index === -1) return undefined;
    if (!arguments_[index + 1]) throw new Error(`${flag} requires a directory`);
    return arguments_[index + 1];
  };
  return { root: valueAfter("--root") ?? process.cwd(), builtOutput: valueAfter("--built-output") };
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isCli) {
  try {
    const options = cliOptions(process.argv.slice(2));
    if (options.builtOutput) {
      const result = await checkBuiltOutput(options.root, options.builtOutput);
      process.stdout.write(`Built output check passed (${result.filesChecked} text assets).\n`);
    } else {
      const result = await checkPublicContent(options.root);
      process.stdout.write(`Public content check passed (${result.filesChecked} files, ${result.publicEssays} public essays).\n`);
    }
  } catch (error) {
    process.stderr.write(`Public content check failed:\n${error.message}\n`);
    process.exitCode = 1;
  }
}
