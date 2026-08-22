import type { MetadataRoute } from "next";
import { loadContent } from "@/lib/content/load-content";
import { canonicalUrl } from "@/lib/publication/site-url";

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

  return [
    {
      url: canonicalUrl("/"),
      lastModified: publicationLastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
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
