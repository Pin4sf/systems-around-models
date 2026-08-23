import type { Metadata } from "next";
import type { EssayMetadata, RevisionRecord } from "@/lib/content/schema";
import { canonicalUrl, resolveSiteUrl } from "@/lib/publication/site-url";

export const publicationTitle = "Systems Around Models";
export const publicationDescription =
  "A practical study guide to the harnesses, memory, environments, authority, recovery, and verification that turn model responses into reliable work.";
export const publicationTagline = "The agent systems fieldbook";
export const authorName = "Shivansh Fulper";
export const authorUrl = "https://shivanshfulper.com";
export const authorRole = "Founder and AI systems researcher";
export const authorSameAs = [
  authorUrl,
  "https://github.com/Pin4sf",
  "https://www.linkedin.com/in/shivansh-fulper/",
];
export const publicationKeywords = [
  "agent systems",
  "AI agent architecture",
  "agent harness engineering",
  "AI memory engineering",
  "reliable AI agents",
  "AI agent security",
  "agent evaluation",
  "long-running agents",
];
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
    authors: [{ name: authorName, url: authorUrl }],
    creator: authorName,
    publisher: authorName,
    keywords: publicationKeywords,
    category: "technology",
    referrer: "origin-when-cross-origin",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: "/icon.svg",
    },
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
    authors: [{ name: authorName, url: authorUrl }],
    creator: authorName,
    publisher: authorName,
    keywords: publicationKeywords,
    category: essay.sequence,
    alternates: { canonical: route },
    openGraph: {
      type: "article",
      locale: "en_US",
      siteName: publicationTitle,
      title: essay.title,
      description: essay.description,
      url,
      authors: [authorName],
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
      citation_title: essay.title,
      citation_author: authorName,
      citation_publication_date: revision.publishedAt,
      citation_public_url: url,
    },
  };
}

export function buildHomeJsonLd() {
  const url = canonicalUrl("/");
  const websiteId = `${url}#website`;
  const authorId = `${authorUrl}/#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url,
        name: publicationTitle,
        alternateName: publicationTagline,
        description: publicationDescription,
        inLanguage: "en",
        author: { "@id": authorId },
        publisher: { "@id": authorId },
      },
      {
        "@type": "Person",
        "@id": authorId,
        name: authorName,
        url: authorUrl,
        jobTitle: authorRole,
        sameAs: authorSameAs,
      },
      {
        "@type": "CollectionPage",
        "@id": `${url}#fieldbook`,
        url,
        name: publicationTitle,
        description: publicationDescription,
        isPartOf: { "@id": websiteId },
        author: { "@id": authorId },
        about: publicationKeywords.slice(0, 6).map((name) => ({
          "@type": "Thing",
          name,
        })),
      },
    ],
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
    author: [{
      "@type": "Person",
      name: authorName,
      url: authorUrl,
      sameAs: authorSameAs,
    }],
    publisher: {
      "@type": "Person",
      name: authorName,
      url: authorUrl,
    },
    image: canonicalUrl(socialImage.url),
    articleSection: essay.sequence,
    keywords: publicationKeywords.join(", "),
    isPartOf: {
      "@type": "WebSite",
      name: publicationTitle,
      url: canonicalUrl("/"),
    },
    mainEntityOfPage: url,
    url,
    isAccessibleForFree: true,
  };
}
