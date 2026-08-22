import type { Metadata } from "next";
import type { EssayMetadata, RevisionRecord } from "@/lib/content/schema";
import { canonicalUrl, resolveSiteUrl } from "@/lib/publication/site-url";

export const publicationTitle = "Systems Around Models";
export const publicationDescription =
  "A practical study guide to the harnesses, memory, environments, authority, recovery, and verification that turn model responses into reliable work.";
const socialImage = {
  url: "/social/systems-around-models.png",
  width: 1200,
  height: 630,
  alt: "Systems Around Models — The model is only one part of the agent.",
};

export function buildHomeMetadata(): Metadata {
  return {
    metadataBase: resolveSiteUrl(),
    title: publicationTitle,
    description: publicationDescription,
    applicationName: publicationTitle,
    authors: [{ name: publicationTitle }],
    creator: publicationTitle,
    publisher: publicationTitle,
    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: publicationTitle,
      title: publicationTitle,
      description: publicationDescription,
      url: canonicalUrl("/"),
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: publicationTitle,
      description: publicationDescription,
      images: [socialImage.url],
    },
  };
}

export function buildArticleMetadata(
  essay: EssayMetadata,
  revision: RevisionRecord,
): Metadata {
  const route = `/fieldbook/${essay.slug}`;
  const url = canonicalUrl(route);

  return {
    title: `${essay.title} | ${publicationTitle}`,
    description: essay.description,
    authors: essay.authors.map((name) => ({ name })),
    alternates: { canonical: route },
    openGraph: {
      type: "article",
      locale: "en_US",
      siteName: publicationTitle,
      title: essay.title,
      description: essay.description,
      url,
      authors: essay.authors,
      publishedTime: revision.publishedAt,
      modifiedTime: revision.substantivelyRevisedAt,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: essay.title,
      description: essay.description,
      images: [socialImage.url],
    },
    other: {
      "article:revision": revision.id,
    },
  };
}

export function buildArticleJsonLd(
  essay: EssayMetadata,
  revision: RevisionRecord,
) {
  const url = canonicalUrl(`/fieldbook/${essay.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: essay.title,
    description: essay.description,
    datePublished: revision.publishedAt,
    dateModified: revision.substantivelyRevisedAt,
    author: essay.authors.map((name) => ({
      "@type": name === publicationTitle ? "Organization" : "Person",
      name,
    })),
    publisher: {
      "@type": "Organization",
      name: publicationTitle,
    },
    mainEntityOfPage: url,
    url,
    isAccessibleForFree: true,
  };
}
