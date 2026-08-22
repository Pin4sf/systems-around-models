import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const schemaVersion = 1;
const validationSchemaVersion = "publication-v1";

function sha256(contents) {
  return `sha256-${createHash("sha256").update(contents).digest("hex")}`;
}

async function filesRecursively(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesRecursively(filename, extension);
    return entry.isFile() && entry.name.endsWith(extension) ? [filename] : [];
  }));
  return nested.flat();
}

function frontmatter(contents, filename) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(contents);
  if (!match) throw new Error(`Missing frontmatter in ${filename}`);
  return parseYaml(match[1]);
}

async function yamlRecords(directory) {
  const filenames = (await filesRecursively(directory, ".yaml")).sort();
  return Promise.all(filenames.map(async (filename) => parseYaml(await readFile(filename, "utf8"))));
}

export async function generatePublicManifest(root = process.cwd()) {
  const repositoryRoot = path.resolve(root);
  const contentRoot = path.join(repositoryRoot, "content");
  const essayFiles = (await filesRecursively(path.join(contentRoot, "essays"), ".mdx")).sort();
  const essays = await Promise.all(essayFiles.map(async (filename) => {
    const source = await readFile(filename, "utf8");
    return { filename, source, metadata: frontmatter(source, filename) };
  }));
  const [revisions, sourceRecords] = await Promise.all([
    yamlRecords(path.join(contentRoot, "revisions")),
    yamlRecords(path.join(contentRoot, "sources")),
  ]);
  const sourceValidation = sourceRecords.map((source) => ({
    id: source.id,
    lastValidated: source.last_validated,
  })).sort((left, right) => left.id.localeCompare(right.id));
  const revisionRecords = revisions.map((revision) => {
    const essay = essays.find(({ metadata }) => metadata.revision_id === revision.id);
    if (!essay) throw new Error(`No essay resolves revision ${revision.id}`);
    return {
      id: revision.id,
      essaySlug: essay.metadata.slug,
      revision: revision.revision,
      publishedAt: revision.published_at,
      substantivelyRevisedAt: revision.substantively_revised_at,
      summary: revision.summary,
      affectedClaimIds: [...revision.affected_claim_ids].sort(),
      correctionDisposition: revision.correction_disposition,
      contentHash: sha256(essay.source),
      sourceIds: [...essay.metadata.source_manifest_ids].sort(),
      sourceValidationDates: Object.fromEntries(
        essay.metadata.source_manifest_ids.map((id) => {
          const source = sourceRecords.find((record) => record.id === id);
          if (!source) throw new Error(`Unresolved source ${id} for ${essay.metadata.slug}`);
          return [id, source.last_validated];
        }),
      ),
    };
  }).sort((left, right) => left.id.localeCompare(right.id));
  const payload = {
    schemaVersion,
    validationSchemaVersion,
    revisions: revisionRecords,
    sources: sourceValidation,
  };
  const manifest = { ...payload, buildId: sha256(JSON.stringify(payload)) };
  const publicRoot = path.join(repositoryRoot, "public");
  const manifestRoot = path.join(publicRoot, "manifests");
  await mkdir(manifestRoot, { recursive: true });
  await writeFile(
    path.join(publicRoot, "publication-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  await Promise.all(revisionRecords.map(async (revision) => {
    const sourceDetails = revision.sourceIds.map((id) => {
      const source = sourceRecords.find((record) => record.id === id);
      return {
        id,
        title: source.title,
        canonicalUrl: source.canonical_url,
        lastValidated: source.last_validated,
        licenseStatus: source.license_status,
      };
    });
    await writeFile(
      path.join(manifestRoot, `${revision.id}.json`),
      `${JSON.stringify({ ...revision, schemaVersion, validationSchemaVersion, sources: sourceDetails }, null, 2)}\n`,
    );
  }));
  return manifest;
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
    const manifest = await generatePublicManifest(cliRoot(process.argv.slice(2)));
    process.stdout.write(`Publication manifest generated (${manifest.buildId}).\n`);
  } catch (error) {
    process.stderr.write(`Publication manifest generation failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
