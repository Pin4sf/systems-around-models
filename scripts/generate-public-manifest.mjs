import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import {
  isCanonicalSourceUrl,
  isIsoDate,
  isSourceId,
  isSourceLicenseStatus,
} from "../lib/content/publication-values.mjs";

const schemaVersion = 2;
const validationSchemaVersion = "publication-v2";

function sha256(contents) {
  return `sha256-${createHash("sha256").update(contents).digest("hex")}`;
}

function historicalSourceSnapshot(revision) {
  if (!/^sha256-[a-f0-9]{64}$/.test(revision.content_hash ?? "") || !Array.isArray(revision.sources) || revision.sources.length === 0) {
    throw new Error(`Historical revision ${revision.id} is missing its frozen content and source snapshot`);
  }
  const sourceDetails = revision.sources.map((source) => {
    if (
      !isSourceId(source?.id) ||
      typeof source?.title !== "string" || source.title.trim().length < 3 ||
      typeof source?.canonical_url !== "string" || !isCanonicalSourceUrl(source.canonical_url) ||
      typeof source?.last_validated !== "string" || !isIsoDate(source.last_validated) ||
      !isSourceLicenseStatus(source?.license_status)
    ) {
      throw new Error(`Historical revision ${revision.id} contains an invalid source snapshot`);
    }
    return {
      id: source.id,
      title: source.title,
      canonicalUrl: source.canonical_url,
      lastValidated: source.last_validated,
      licenseStatus: source.license_status,
    };
  });
  const sourceIds = sourceDetails.map((source) => source.id);
  if (new Set(sourceIds).size !== sourceIds.length) {
    throw new Error(`Historical revision ${revision.id} contains duplicate source snapshots`);
  }
  const validationOrder = revision.source_validation_order ?? sourceIds;
  if (
    !Array.isArray(validationOrder) ||
    validationOrder.length !== sourceIds.length ||
    new Set(validationOrder).size !== validationOrder.length ||
    validationOrder.some((id) => !sourceIds.includes(id))
  ) {
    throw new Error(`Historical revision ${revision.id} contains an invalid source validation order`);
  }
  return { sourceDetails, sourceIds, validationOrder };
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

async function versionedYamlRecords(directory) {
  const filenames = (await filesRecursively(directory, ".yaml")).sort();
  return Promise.all(filenames.map(async (filename) => {
    const source = await readFile(filename, "utf8");
    return { filename, source, metadata: parseYaml(source) };
  }));
}

export async function generatePublicManifest(root = process.cwd()) {
  const repositoryRoot = path.resolve(root);
  const contentRoot = path.join(repositoryRoot, "content");
  const essayFiles = (await filesRecursively(path.join(contentRoot, "essays"), ".mdx")).sort();
  const essays = await Promise.all(essayFiles.map(async (filename) => {
    const source = await readFile(filename, "utf8");
    return { filename, source, metadata: frontmatter(source, filename) };
  }));
  const [revisions, sourceRecords, architectureFiles, lessonFiles] = await Promise.all([
    yamlRecords(path.join(contentRoot, "revisions")),
    yamlRecords(path.join(contentRoot, "sources")),
    versionedYamlRecords(path.join(contentRoot, "architectures")),
    versionedYamlRecords(path.join(contentRoot, "lessons")),
  ]);
  const sourceValidation = sourceRecords.map((source) => ({
    id: source.id,
    lastValidated: source.last_validated,
  })).sort((left, right) => left.id.localeCompare(right.id));
  const frozenRevisionSources = new Map();
  const revisionRecords = revisions.map((revision) => {
    const essay = essays.find(({ metadata }) => metadata.revision_id === revision.id);
    if (!essay) {
      const { sourceDetails, sourceIds, validationOrder } = historicalSourceSnapshot(revision);
      frozenRevisionSources.set(revision.id, sourceDetails);
      return {
        id: revision.id,
        essaySlug: revision.target_slug,
        revision: revision.revision,
        publishedAt: revision.published_at,
        substantivelyRevisedAt: revision.substantively_revised_at,
        summary: revision.summary,
        affectedClaimIds: [...revision.affected_claim_ids].sort(),
        correctionDisposition: revision.correction_disposition,
        contentHash: revision.content_hash,
        sourceIds: [...sourceIds].sort(),
        sourceValidationDates: Object.fromEntries(
          validationOrder.map((id) => {
            const source = sourceDetails.find((item) => item.id === id);
            return [id, source.lastValidated];
          }),
        ),
      };
    }
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

  const sourceValidationDates = (sourceIds) => Object.fromEntries(
    sourceIds.map((id) => {
      const source = sourceRecords.find((record) => record.id === id);
      if (!source) throw new Error(`Unresolved source ${id}`);
      return [id, source.last_validated];
    }),
  );
  const architectureRecords = architectureFiles
    .filter(({ metadata }) => metadata.status === "public")
    .map(({ source, metadata }) => ({
      id: metadata.id,
      slug: metadata.slug,
      recordKind: metadata.record_kind,
      productClass: metadata.product_class,
      revision: metadata.revision,
      lastReviewed: metadata.last_reviewed,
      inspectedVersion: metadata.inspected_version,
      dossierStatus: metadata.dossier_status,
      evidenceGrade: metadata.evidence_grade,
      evidenceFidelity: metadata.evidence_fidelity,
      contentHash: sha256(source),
      sourceIds: [...metadata.source_ids].sort(),
      sourceValidationDates: sourceValidationDates(metadata.source_ids),
    }))
    .sort((left, right) => left.id.localeCompare(right.id));
  const lessonRecords = lessonFiles
    .filter(({ metadata }) => metadata.status === "public")
    .map(({ source, metadata }) => ({
      id: metadata.id,
      slug: metadata.slug,
      revision: metadata.revision,
      lastReviewed: metadata.last_reviewed,
      contentHash: sha256(source),
      architectureIds: [...metadata.architecture_ids].sort(),
      sourceIds: [...metadata.source_ids].sort(),
      sourceValidationDates: sourceValidationDates(metadata.source_ids),
    }))
    .sort((left, right) => left.id.localeCompare(right.id));
  const payload = {
    schemaVersion,
    validationSchemaVersion,
    revisions: revisionRecords,
    sources: sourceValidation,
    architectures: architectureRecords,
    lessons: lessonRecords,
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
    const sourceDetails = frozenRevisionSources.get(revision.id) ?? revision.sourceIds.map((id) => {
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
  await Promise.all(architectureRecords.map(async (architecture) => {
    const sources = architecture.sourceIds.map((id) => {
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
      path.join(manifestRoot, `${architecture.id}.json`),
      `${JSON.stringify({ ...architecture, schemaVersion, validationSchemaVersion, sources }, null, 2)}\n`,
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
