import { loadContent } from "@/lib/content/load-content";
import {
  publicationDescription,
  publicationTitle,
} from "@/lib/publication/metadata";
import { canonicalUrl } from "@/lib/publication/site-url";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function rssDate(date: string): string {
  return new Date(`${date}T00:00:00.000Z`).toUTCString();
}

export async function GET() {
  const content = await loadContent();
  const essays = [...content.essays.values()]
    .filter((essay) => essay.status === "public")
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
  const items = essays.map((essay) => {
    const revision = content.revisions.get(essay.revisionId);
    if (!revision) throw new Error(`Missing public revision: ${essay.revisionId}`);
    const url = canonicalUrl(`/fieldbook/${essay.slug}`);
    return [
      "    <item>",
      `      <title>${escapeXml(essay.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <description>${escapeXml(essay.description)}</description>`,
      `      <pubDate>${rssDate(revision.publishedAt)}</pubDate>`,
      `      <sam:revision>${escapeXml(revision.id)}</sam:revision>`,
      "    </item>",
    ].join("\n");
  });
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sam="https://github.com/Pin4sf/systems-around-models#publication">',
    "  <channel>",
    `    <title>${escapeXml(publicationTitle)}</title>`,
    `    <link>${escapeXml(canonicalUrl("/"))}</link>`,
    `    <description>${escapeXml(publicationDescription)}</description>`,
    `    <atom:link href="${escapeXml(canonicalUrl("/rss.xml"))}" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
