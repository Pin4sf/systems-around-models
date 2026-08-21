import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleReader } from "@/components/article/article-reader";
import {
  listEssays,
  loadContent,
  loadEssay,
} from "@/lib/content/load-content";
import {
  buildArticleJsonLd,
  buildArticleMetadata,
} from "@/lib/publication/metadata";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await listEssays())
    .filter((essay) => essay.status === "public")
    .map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [essay, content] = await Promise.all([loadEssay(slug), loadContent()]);
  if (!essay || essay.status !== "public") return {};
  const revision = content.revisions.get(essay.revisionId);
  if (!revision) throw new Error(`Missing public revision: ${essay.revisionId}`);

  return buildArticleMetadata(essay, revision);
}

export async function buildArticleStructuredData(slug: string) {
  const [essay, content] = await Promise.all([loadEssay(slug), loadContent()]);
  if (!essay || essay.status !== "public") return undefined;
  const revision = content.revisions.get(essay.revisionId);
  if (!revision) throw new Error(`Missing public revision: ${essay.revisionId}`);
  return buildArticleJsonLd(essay, revision);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [essay, content] = await Promise.all([
    loadEssay(slug),
    loadContent(),
  ]);

  if (!essay || essay.status !== "public") notFound();
  const revision = content.revisions.get(essay.revisionId);
  if (!revision) throw new Error(`Missing public revision: ${essay.revisionId}`);
  const structuredData = buildArticleJsonLd(essay, revision);
  const article = await ArticleReader({
    essay,
    revision,
    claims: content.claims,
    sources: content.sources,
    releasedEssays: [...content.essays.values()].filter(
      (releasedEssay) => releasedEssay.status === "public" && releasedEssay.sequence === essay.sequence,
    ),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      {article}
    </>
  );
}
