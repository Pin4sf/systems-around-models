import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleReader } from "@/components/article/article-reader";
import {
  listEssays,
  loadContent,
  loadEssay,
} from "@/lib/content/load-content";

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
  const essay = await loadEssay(slug);
  if (!essay || essay.status !== "public") return {};

  return {
    title: `${essay.title} | Systems Around Models`,
    description: essay.description,
  };
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

  return ArticleReader({
    essay,
    revision,
    claims: content.claims,
    sources: content.sources,
  });
}
