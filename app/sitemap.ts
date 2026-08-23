import type { MetadataRoute } from "next";
import { loadContent } from "@/lib/content/load-content";
import { canonicalUrl } from "@/lib/publication/site-url";
import { listArchitectureStudies } from "@/lib/study-guide/architecture-study-registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await loadContent();
  const essays = [...content.essays.values()]
    .filter((essay) => essay.status === "public")
    .sort((left, right) => left.sequencePosition - right.sequencePosition);
  const revisionDates = essays.map((essay) => {
    const revision = content.revisions.get(essay.revisionId);
    if (!revision) throw new Error(`Missing public revision: ${essay.revisionId}`);
    return revision.substantivelyRevisedAt;
  });
  const publicationLastModified = revisionDates.sort().at(-1);
  const architectureLastModified = [...content.architectures.values()]
    .filter((record) => record.status === "public")
    .map((record) => record.lastReviewed)
    .sort()
    .at(-1);
  const studyRecords = listArchitectureStudies(content.architectures);

  return [
    {
      url: canonicalUrl("/"),
      lastModified: publicationLastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: canonicalUrl("/architectures"),
      lastModified: architectureLastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...studyRecords.map((record) => ({
      url: canonicalUrl(`/architectures/${record.slug}`),
      lastModified: record.lastReviewed,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...essays.map((essay) => {
      const revision = content.revisions.get(essay.revisionId);
      if (!revision) throw new Error(`Missing public revision: ${essay.revisionId}`);
      return {
        url: canonicalUrl(`/fieldbook/${essay.slug}`),
        lastModified: revision.substantivelyRevisedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
    }),
  ];
}
