import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const allowedEvidenceLabels = new Set([
  "observed",
  "author-reported",
  "inferred",
  "proposed",
  "unproved",
]);
const scannedRoots = ["content", "app", "components", "lib", "public"];
const scannedExtensions = new Set([
  ".atom",
  ".cjs",
  ".css",
  ".csv",
  ".env",
  ".gql",
  ".graphql",
  ".htm",
  ".html",
  ".ini",
  ".js",
  ".json",
  ".jsx",
  ".less",
  ".map",
  ".md",
  ".mdx",
  ".mjs",
  ".rss",
  ".sass",
  ".scss",
  ".svg",
  ".toml",
  ".ts",
  ".tsv",
  ".tsx",
  ".txt",
  ".webmanifest",
  ".xml",
  ".yaml",
  ".yml",
]);
// Multi-segment absolute POSIX tokens fail closed unless their route root has
// been reviewed here. This keeps arbitrary filesystem roots detectable while
// allowing the publication's real routes/assets. A new route root must be
// added deliberately rather than becoming an implicit scanner exemption.
const approvedPublicPathPrefixes = [
  "/_next/",
  "/assets/",
  "/fieldbook/",
  "/fonts/",
  "/images/",
];
const approvedPublicPaths = new Set([
  "/home/about",
  "/robots.txt",
  "/rss.xml",
  "/sitemap.xml",
  "/users/profile",
]);

function containsAbsoluteLocalPath(contents) {
  if (/[Ff][Ii][Ll][Ee]:\/\//.test(contents)) return true;
  if (/(?<![A-Za-z0-9+.-])[A-Za-z]:[\\/][^\s'"`]+/.test(contents)) return true;
  if (/\\\\[^\\\s'"`]+\\[^\s'"`]+/.test(contents)) return true;

  // Remove complete web URLs before looking for slash-prefixed tokens so the
  // `/posts/...` portion of an HTTPS citation cannot be mistaken for a path.
  const withoutWebUrls = contents.replace(/\bhttps?:\/\/[^\s'"`<>{}\[\]()]+/gi, "");
  const withoutModuleAliases = withoutWebUrls.replace(/@\/[^\s'"`<>{}\[\]()]+/g, "");
  const withoutModuleSpecifiers = withoutModuleAliases
    .replace(/(?:from\s+|import\s*)["'][^"']+["']/g, "")
    .replace(/(?:require|import)\(["'][^"']+["']\)/g, "");
  const absolutePosixPaths = withoutModuleSpecifiers.match(
    /(?<![:/])\/(?!\/)(?:[A-Za-z0-9._~%-]+\/)+[A-Za-z0-9._~%+=:@,;-]+/g,
  ) ?? [];
  return absolutePosixPaths.some((candidate) =>
    !approvedPublicPaths.has(candidate)
    && !approvedPublicPathPrefixes.some((prefix) => candidate.startsWith(prefix)),
  );
}

const sensitiveChecks = [
  { label: "absolute local path", test: containsAbsoluteLocalPath },
  { label: "waldo-brain", test: (contents) => /waldo-brain/i.test(contents) },
  {
    label: "credential pattern",
    test: (contents) => /(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKIA[0-9A-Z]{16}\b|\bgh[pousr]_[A-Za-z0-9]{20,}\b|\bsk-[A-Za-z0-9_-]{20,}\b|\b(?:api[_-]?key|password|secret)\s*[:=]\s*["']?[^\s"']{8,})/i.test(contents),
  },
];

function publicName(root, filename) {
  return path.relative(root, filename).split(path.sep).join("/");
}

async function filesRecursively(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  const nested = await Promise.all(entries.map(async (entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesRecursively(filename);
    return entry.isFile() && scannedExtensions.has(path.extname(entry.name).toLowerCase())
      ? [filename]
      : [];
  }));
  return nested.flat();
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
  const files = (await filesRecursively(path.join(root, "content", directory)))
    .filter((filename) => [".yaml", ".yml"].includes(path.extname(filename).toLowerCase()))
    .sort();
  const records = [];
  for (const filename of files) {
    try {
      records.push({
        filename: publicName(root, filename),
        value: parseYaml(await readFile(filename, "utf8")),
      });
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
  const errors = [];
  const surfaceFiles = (await Promise.all(
    scannedRoots.map((directory) => filesRecursively(path.join(repositoryRoot, directory))),
  )).flat().sort();
  const surfaceContents = new Map();

  for (const filename of surfaceFiles) {
    const contents = await readFile(filename, "utf8");
    surfaceContents.set(filename, contents);
    for (const { label, test } of sensitiveChecks) {
      if (test(contents)) errors.push(`${publicName(repositoryRoot, filename)}: ${label}`);
    }
  }

  const [claimRecords, sourceRecords, revisionRecords] = await Promise.all([
    yamlRecords(repositoryRoot, "claims", errors),
    yamlRecords(repositoryRoot, "sources", errors),
    yamlRecords(repositoryRoot, "revisions", errors),
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
    if (!allowedEvidenceLabels.has(value?.label)) {
      errors.push(`${filename}: invalid evidence label ${String(value?.label)}`);
    }
    const references = Array.isArray(value?.source_ids) ? value.source_ids : [];
    for (const sourceId of references) {
      if (!sourceIds.has(sourceId)) {
        errors.push(`${filename}: unresolved source identifier ${sourceId}`);
      }
    }
  }

  const revisionIds = new Set();
  for (const { filename, value } of revisionRecords) {
    const id = requiredId(value, filename, "revision", errors);
    if (id) revisionIds.add(id);
    const affectedClaims = Array.isArray(value?.affected_claim_ids) ? value.affected_claim_ids : [];
    for (const claimId of affectedClaims) {
      if (!claimIds.has(claimId)) errors.push(`${filename}: unresolved claim identifier ${claimId}`);
    }
  }

  const essayFiles = (await filesRecursively(path.join(repositoryRoot, "content", "essays")))
    .filter((filename) => path.extname(filename).toLowerCase() === ".mdx")
    .sort();
  const essays = new Map();
  for (const filename of essayFiles) {
    const name = publicName(repositoryRoot, filename);
    const metadata = frontmatter(surfaceContents.get(filename) ?? await readFile(filename, "utf8"), name, errors);
    if (!metadata || typeof metadata.slug !== "string") continue;
    essays.set(metadata.slug, metadata);
    const sourceReferences = Array.isArray(metadata.source_manifest_ids)
      ? metadata.source_manifest_ids
      : [];
    for (const sourceId of sourceReferences) {
      if (!sourceIds.has(sourceId)) errors.push(`${name}: unresolved source identifier ${sourceId}`);
    }
    if (!revisionIds.has(metadata.revision_id)) {
      errors.push(`${name}: unresolved revision identifier ${String(metadata.revision_id)}`);
    }
  }

  const navigationFiles = [...surfaceContents.entries()].filter(([filename]) =>
    ["app", "components"].includes(path.relative(repositoryRoot, filename).split(path.sep)[0]),
  );
  for (const [filename, contents] of navigationFiles) {
    for (const match of contents.matchAll(/\/fieldbook\/([a-z0-9]+(?:-[a-z0-9]+)*)/g)) {
      const slug = match[1];
      const essay = essays.get(slug);
      if (!essay || essay.status !== "public") {
        errors.push(`${publicName(repositoryRoot, filename)}: navigation references unpublished essay ${slug}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error([...new Set(errors)].sort().join("\n"));
  }
  return {
    filesChecked: surfaceFiles.length,
    publicEssays: [...essays.values()].filter((essay) => essay.status === "public").length,
  };
}

function cliRoot(arguments_) {
  const index = arguments_.indexOf("--root");
  if (index === -1) return process.cwd();
  if (!arguments_[index + 1]) throw new Error("--root requires a directory");
  return arguments_[index + 1];
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isCli) {
  try {
    const result = await checkPublicContent(cliRoot(process.argv.slice(2)));
    process.stdout.write(
      `Public content check passed (${result.filesChecked} files, ${result.publicEssays} public essays).\n`,
    );
  } catch (error) {
    process.stderr.write(`Public content check failed:\n${error.message}\n`);
    process.exitCode = 1;
  }
}
