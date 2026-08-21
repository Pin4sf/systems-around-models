import { afterEach, describe, expect, it, vi } from "vitest";
import { buildHomeMetadata } from "@/lib/publication/metadata";
import { resolveSiteUrl } from "@/lib/publication/site-url";
import { generateMetadata, buildArticleStructuredData } from "@/app/fieldbook/[slug]/page";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { GET as getRss } from "@/app/rss.xml/route";

const canonicalSite = "https://fieldbook.example";
const chapterPath = "/fieldbook/the-model-is-not-the-agent";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("canonical publication metadata", () => {
  it("fails closed when a production build has no SITE_URL", () => {
    expect(() => resolveSiteUrl({ NODE_ENV: "production" })).toThrow(
      "SITE_URL is required for production metadata",
    );
  });

  it("uses localhost only outside production", () => {
    expect(resolveSiteUrl({ NODE_ENV: "test" }).toString()).toBe(
      "http://localhost:3000/",
    );
  });

  it("gives the homepage and chapter distinct canonical records", async () => {
    vi.stubEnv("SITE_URL", canonicalSite);
    const home = buildHomeMetadata();
    const chapter = await generateMetadata({
      params: Promise.resolve({ slug: "the-model-is-not-the-agent" }),
    });

    expect(home.title).toBe("Systems Around Models");
    expect(home.description).not.toBe(chapter.description);
    expect(home.alternates?.canonical).toBe("/");
    expect(chapter.title).toBe("The Model Is Not the Agent | Systems Around Models");
    expect(chapter.alternates?.canonical).toBe(chapterPath);
    expect(chapter.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-08-21",
      modifiedTime: "2026-08-21",
      url: `${canonicalSite}${chapterPath}`,
    });
  });

  it("builds Article JSON-LD from the canonical essay and revision", async () => {
    vi.stubEnv("SITE_URL", canonicalSite);
    const structuredData = await buildArticleStructuredData(
      "the-model-is-not-the-agent",
    );
    expect(structuredData).toBeDefined();
    if (!structuredData) throw new Error("Expected public article structured data");

    expect(structuredData).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "The Model Is Not the Agent",
      datePublished: "2026-08-21",
      dateModified: "2026-08-21",
      mainEntityOfPage: `${canonicalSite}${chapterPath}`,
    });
    expect(structuredData.author).toEqual([
      { "@type": "Organization", name: "Systems Around Models" },
    ]);
  });
});

describe("publication discovery endpoints", () => {
  it("lists exactly the complete publication routes in the sitemap", async () => {
    vi.stubEnv("SITE_URL", canonicalSite);
    const entries = await sitemap();

    expect(entries.map((entry) => entry.url)).toEqual([
      `${canonicalSite}/`,
      `${canonicalSite}${chapterPath}`,
    ]);
  });

  it("publishes the flagship essay and canonical URL in RSS", async () => {
    vi.stubEnv("SITE_URL", canonicalSite);
    const response = await getRss();
    const body = await response.text();

    expect(response.headers.get("content-type")).toContain("application/rss+xml");
    expect(body).toContain("<title>The Model Is Not the Agent</title>");
    expect(body).toContain(`<link>${canonicalSite}${chapterPath}</link>`);
    expect(body).toContain("revision-fieldbook-essay-001");
  });

  it("points crawlers at the canonical sitemap", () => {
    vi.stubEnv("SITE_URL", canonicalSite);

    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${canonicalSite}/sitemap.xml`,
      host: canonicalSite,
    });
  });
});
