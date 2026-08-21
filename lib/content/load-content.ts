import { readFile, readdir } from "node:fs/promises";
import type { Dirent } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import {
  ClaimSchema,
  type ClaimRecord,
  EssayMetadataSchema,
  type EssayMetadata,
  RevisionSchema,
  type RevisionRecord,
  SourceSchema,
  type SourceRecord,
} from "@/lib/content/schema";

type Registry = {
  claims: Map<string, ClaimRecord>;
  sources: Map<string, SourceRecord>;
  revisions: Map<string, RevisionRecord>;
};

type LoadedRegistry = Registry & {
  revisionFilenames: Map<string, string>;
};

export type ContentRegistry = Registry & {
  essays: Map<string, EssayMetadata>;
};

const CONTENT_DIRECTORY = "content";

function publicFilename(repositoryRoot: string, filename: string): string {
  return path.relative(repositoryRoot, filename).split(path.sep).join("/");
}

function recordError(repositoryRoot: string, filename: string, reason: string): Error {
  return new Error(`Invalid ${publicFilename(repositoryRoot, filename)}: ${reason}`);
}

function resolveRecordPath(
  repositoryRoot: string,
  directory: string,
  filename: string,
): string {
  if (path.isAbsolute(directory) || path.isAbsolute(filename) || directory.includes("..") || filename.includes("..")) {
    throw new Error(`Invalid content path: ${directory}/${filename}`);
  }

  const contentRoot = path.resolve(repositoryRoot, CONTENT_DIRECTORY);
  const resolved = path.resolve(contentRoot, directory, filename);
  const relative = path.relative(contentRoot, resolved);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Invalid content path: ${directory}/${filename}`);
  }

  return resolved;
}

async function yamlRecords(
  repositoryRoot: string,
  directory: "claims" | "sources" | "revisions",
): Promise<Array<{ filename: string; value: unknown }>> {
  const contentRoot = path.resolve(repositoryRoot, CONTENT_DIRECTORY);
  const recordsDirectory = resolveRecordPath(repositoryRoot, directory, "");
  let entries: Dirent[];

  try {
    entries = await readdir(recordsDirectory, { withFileTypes: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unable to read directory";
    throw new Error(`Invalid ${publicFilename(repositoryRoot, contentRoot)}/${directory}: ${message}`);
  }

  const filenames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".yaml"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  return Promise.all(
    filenames.map(async (filename) => {
      const recordPath = resolveRecordPath(repositoryRoot, directory, filename);
      const displayName = publicFilename(repositoryRoot, recordPath);
      try {
        return { filename: recordPath, value: parseYaml(await readFile(recordPath, "utf8")) };
      } catch (error) {
        const message = error instanceof Error ? error.message : "unable to parse YAML";
        throw new Error(`Invalid ${displayName}: ${message}`);
      }
    }),
  );
}

function claimFromYaml(value: unknown, repositoryRoot: string, filename: string): ClaimRecord {
  const raw = value as Record<string, unknown>;
  const result = ClaimSchema.safeParse({
    ...raw,
    sourceIds: raw.source_ids,
    lastReviewed: raw.last_reviewed,
  });

  if (!result.success) {
    throw recordError(repositoryRoot, filename, result.error.issues.map((issue) => issue.message).join("; "));
  }
  return result.data;
}

function sourceFromYaml(value: unknown, repositoryRoot: string, filename: string): SourceRecord {
  const raw = value as Record<string, unknown>;
  const mechanisms = Array.isArray(raw.observed_mechanisms)
    ? raw.observed_mechanisms.map((mechanism) => {
        const item = mechanism as Record<string, unknown>;
        return { ...item, evidenceGrade: item.evidence_grade };
      })
    : raw.observed_mechanisms;
  const result = SourceSchema.safeParse({
    ...raw,
    canonicalUrl: raw.canonical_url,
    publishedAt: raw.published_at,
    retrievedAt: raw.retrieved_at,
    repositoryCommit: raw.repository_commit,
    inspectedPaths: raw.inspected_paths,
    sourceType: raw.source_type,
    licenseStatus: raw.license_status,
    evidenceGrade: raw.evidence_grade,
    observedMechanisms: mechanisms,
    authorReportedClaims: raw.author_reported_claims,
    lastValidated: raw.last_validated,
    correctionLedgerStatus: raw.correction_ledger_status,
  });

  if (!result.success) {
    throw recordError(repositoryRoot, filename, result.error.issues.map((issue) => issue.message).join("; "));
  }
  return result.data;
}

function revisionFromYaml(value: unknown, repositoryRoot: string, filename: string): RevisionRecord {
  const raw = value as Record<string, unknown>;
  const result = RevisionSchema.safeParse({
    ...raw,
    targetSlug: raw.target_slug,
    publishedAt: raw.published_at,
    substantivelyRevisedAt: raw.substantively_revised_at,
    affectedClaimIds: raw.affected_claim_ids,
    correctionDisposition: raw.correction_disposition,
  });

  if (!result.success) {
    throw recordError(repositoryRoot, filename, result.error.issues.map((issue) => issue.message).join("; "));
  }
  return result.data;
}

function mapById<T extends { id: string }>(
  records: T[],
  repositoryRoot: string,
  filenames: string[],
): Map<string, T> {
  const registry = new Map<string, T>();
  records.forEach((record, index) => {
    if (registry.has(record.id)) {
      throw recordError(repositoryRoot, filenames[index], `duplicate identifier ${record.id}`);
    }
    registry.set(record.id, record);
  });
  return registry;
}

async function loadRegistry(repositoryRoot = process.cwd()): Promise<LoadedRegistry> {
  const [claimValues, sourceValues, revisionValues] = await Promise.all([
    yamlRecords(repositoryRoot, "claims"),
    yamlRecords(repositoryRoot, "sources"),
    yamlRecords(repositoryRoot, "revisions"),
  ]);
  const parsedClaims = claimValues.map(({ filename, value }) =>
    claimFromYaml(value, repositoryRoot, filename),
  );
  const parsedRevisions = revisionValues.map(({ filename, value }) =>
    revisionFromYaml(value, repositoryRoot, filename),
  );
  const claims = mapById(
    parsedClaims,
    repositoryRoot,
    claimValues.map(({ filename }) => filename),
  );
  const sources = mapById(
    sourceValues.map(({ filename, value }) => sourceFromYaml(value, repositoryRoot, filename)),
    repositoryRoot,
    sourceValues.map(({ filename }) => filename),
  );
  const revisions = mapById(
    parsedRevisions,
    repositoryRoot,
    revisionValues.map(({ filename }) => filename),
  );
  const claimFilenames = new Map(parsedClaims.map((claim, index) => [claim.id, claimValues[index].filename]));
  const revisionFilenames = new Map(
    parsedRevisions.map((revision, index) => [revision.id, revisionValues[index].filename]),
  );

  for (const claim of claims.values()) {
    for (const sourceId of claim.sourceIds) {
      if (!sources.has(sourceId)) {
        throw recordError(
          repositoryRoot,
          claimFilenames.get(claim.id) ?? `content/claims/${claim.id}.yaml`,
          `unresolved source identifier ${sourceId}`,
        );
      }
    }
  }
  for (const revision of revisions.values()) {
    for (const claimId of revision.affectedClaimIds) {
      if (!claims.has(claimId)) {
        throw recordError(
          repositoryRoot,
          revisionFilenames.get(revision.id) ?? `content/revisions/${revision.id}.yaml`,
          `unresolved claim identifier ${claimId}`,
        );
      }
    }
  }

  return { claims, sources, revisions, revisionFilenames };
}

export async function loadClaims(repositoryRoot = process.cwd()): Promise<Map<string, ClaimRecord>> {
  return (await loadRegistry(repositoryRoot)).claims;
}

export async function loadSources(repositoryRoot = process.cwd()): Promise<Map<string, SourceRecord>> {
  return (await loadRegistry(repositoryRoot)).sources;
}

export async function loadRevisions(repositoryRoot = process.cwd()): Promise<Map<string, RevisionRecord>> {
  return (await loadRegistry(repositoryRoot)).revisions;
}

function essayFromFrontmatter(value: unknown, repositoryRoot: string, filename: string): EssayMetadata {
  const raw = value as Record<string, unknown>;
  const result = EssayMetadataSchema.safeParse({
    ...raw,
    sequencePosition: raw.sequence_position,
    publishedAt: raw.published_at,
    substantivelyRevisedAt: raw.substantively_revised_at,
    readingTimeSource: raw.reading_time_source,
    sourceManifestIds: raw.source_manifest_ids,
    revisionId: raw.revision_id,
    previousEssaySlug: raw.previous_essay_slug,
    nextEssaySlug: raw.next_essay_slug,
  });
  if (!result.success) {
    throw recordError(repositoryRoot, filename, result.error.issues.map((issue) => issue.message).join("; "));
  }
  return result.data;
}

function readFrontmatter(contents: string, repositoryRoot: string, filename: string): unknown {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(contents);
  if (!match) {
    throw recordError(repositoryRoot, filename, "missing YAML frontmatter");
  }
  try {
    return parseYaml(match[1]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unable to parse frontmatter";
    throw recordError(repositoryRoot, filename, message);
  }
}

async function essayFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return essayFiles(entryPath);
      return entry.isFile() && entry.name.toLowerCase().endsWith(".mdx") ? [entryPath] : [];
    }),
  );
  return nested.flat();
}

async function loadEssayRegistry(repositoryRoot: string): Promise<{
  essays: Map<string, EssayMetadata>;
  filenames: Map<string, string>;
}> {
  const essaysRoot = resolveRecordPath(repositoryRoot, "essays", "");
  let filenames: string[];
  try {
    filenames = (await essayFiles(essaysRoot)).sort((left, right) => left.localeCompare(right));
  } catch (error) {
    const code = error as NodeJS.ErrnoException;
    if (code.code === "ENOENT") return { essays: new Map(), filenames: new Map() };
    const message = error instanceof Error ? error.message : "unable to read essays";
    throw new Error(`Invalid content/essays: ${message}`);
  }

  const records = await Promise.all(
    filenames.map(async (filename) =>
      essayFromFrontmatter(
        readFrontmatter(await readFile(filename, "utf8"), repositoryRoot, filename),
        repositoryRoot,
        filename,
      ),
    ),
  );
  const essays = new Map<string, EssayMetadata>();
  const filenamesBySlug = new Map<string, string>();
  records.forEach((essay, index) => {
    if (essays.has(essay.slug)) {
      throw recordError(repositoryRoot, filenames[index], `duplicate essay slug ${essay.slug}`);
    }
    essays.set(essay.slug, essay);
    filenamesBySlug.set(essay.slug, filenames[index]);
  });
  return { essays, filenames: filenamesBySlug };
}

function validateUnifiedIntegrity(
  repositoryRoot: string,
  registry: LoadedRegistry,
  essays: Map<string, EssayMetadata>,
  essayFilenames: Map<string, string>,
): void {
  for (const revision of registry.revisions.values()) {
    if (!essays.has(revision.targetSlug)) {
      throw recordError(
        repositoryRoot,
        registry.revisionFilenames.get(revision.id) ?? `content/revisions/${revision.id}.yaml`,
        `unresolved essay target ${revision.targetSlug}`,
      );
    }
  }
  for (const essay of essays.values()) {
    const filename = essayFilenames.get(essay.slug) ?? `content/essays/${essay.slug}.mdx`;
    for (const sourceId of essay.sourceManifestIds) {
      if (!registry.sources.has(sourceId)) {
        throw recordError(repositoryRoot, filename, `unresolved source identifier ${sourceId}`);
      }
    }
    if (!registry.revisions.has(essay.revisionId)) {
      throw recordError(repositoryRoot, filename, `unresolved revision identifier ${essay.revisionId}`);
    }
  }
}

export async function loadContent(repositoryRoot = process.cwd()): Promise<ContentRegistry> {
  const [registry, essayRegistry] = await Promise.all([
    loadRegistry(repositoryRoot),
    loadEssayRegistry(repositoryRoot),
  ]);
  validateUnifiedIntegrity(repositoryRoot, registry, essayRegistry.essays, essayRegistry.filenames);
  return {
    claims: registry.claims,
    sources: registry.sources,
    revisions: registry.revisions,
    essays: essayRegistry.essays,
  };
}

export async function listEssays(repositoryRoot = process.cwd()): Promise<EssayMetadata[]> {
  const { essays } = await loadEssayRegistry(repositoryRoot);
  return [...essays.values()].sort((left, right) => left.sequencePosition - right.sequencePosition);
}

export async function loadEssay(
  slug: string,
  repositoryRoot = process.cwd(),
): Promise<EssayMetadata | undefined> {
  return (await listEssays(repositoryRoot)).find((essay) => essay.slug === slug);
}
