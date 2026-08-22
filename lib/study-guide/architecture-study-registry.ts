import type { ArchitectureRecord, SourceRecord } from "@/lib/content/schema";

export type ResolvedArchitectureStudy = {
  architecture: ArchitectureRecord & { study: NonNullable<ArchitectureRecord["study"]> };
  sourceRecords: SourceRecord[];
};

export function listArchitectureStudies(
  architectures: Map<string, ArchitectureRecord>,
): Array<ArchitectureRecord & { study: NonNullable<ArchitectureRecord["study"]> }> {
  return [...architectures.values()]
    .filter((record): record is ArchitectureRecord & { study: NonNullable<ArchitectureRecord["study"]> } =>
      record.status === "public" && record.study !== undefined)
    .sort((left, right) => left.slug.localeCompare(right.slug));
}

export function resolveArchitectureStudy(
  slug: string,
  architectures: Map<string, ArchitectureRecord>,
  sources: Map<string, SourceRecord>,
): ResolvedArchitectureStudy | undefined {
  const architecture = listArchitectureStudies(architectures).find((record) => record.slug === slug);
  if (!architecture) return undefined;
  const sourceRecords = architecture.sourceIds.map((sourceId) => {
    const source = sources.get(sourceId);
    if (!source) throw new Error(`Unresolved architecture study source ${sourceId}`);
    return source;
  });
  return { architecture, sourceRecords };
}
