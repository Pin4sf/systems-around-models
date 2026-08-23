import { afterEach, describe, expect, it, vi } from "vitest";
import { buildHomeJsonLd, buildHomeMetadata } from "@/lib/publication/metadata";
import { resolveSiteUrl } from "@/lib/publication/site-url";
import { generateMetadata, buildArticleStructuredData } from "@/app/fieldbook/[slug]/page";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { GET as getRss } from "@/app/rss.xml/route";

const canonicalSite = "https://fieldbook.example";
const chapterPath = "/fieldbook/the-model-is-not-the-agent";
const guidePath = "/fieldbook/harness-engineering-study-guide";
const memoryGuidePath = "/fieldbook/memory-engineering-study-guide";
const releasedChapterPaths = [
  "/fieldbook/the-h0-to-h9-progression",
  "/fieldbook/twelve-recurring-failure-classes",
  "/fieldbook/four-surface-classes",
  "/fieldbook/developer-and-product-runtime-harnesses",
  "/fieldbook/instructions-and-context-assembly",
  "/fieldbook/tools-capability-manifests-and-binding",
  "/fieldbook/environments-sandboxes-and-custody",
  "/fieldbook/state-journals-checkpoints-and-replay",
  "/fieldbook/loops-workflows-graphs-and-delegation",
  "/fieldbook/memory-compaction-and-continuity",
  "/fieldbook/identity-authority-and-admission",
  "/fieldbook/leases-fencing-cancellation-and-budgets",
  "/fieldbook/external-effects-and-transactional-outboxes",
  "/fieldbook/ambiguity-idempotency-and-recovery",
  "/fieldbook/security-credentials-supply-chain-and-revocation",
];

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

  it.each([
    "http://localhost:3000",
    "http://LOCALHOST.:3000",
    "http://preview.localhost:3000",
    "http://127.0.0.2:3000",
    "http://127.1:3000",
    "http://0.0.0.0:3000",
    "http://[::1]:3000",
    "http://[0:0:0:0:0:0:0:1]:3000",
    "http://[::]:3000",
    "http://[::ffff:127.0.0.1]:3000",
    "http://[::ffff:7f00:1]:3000",
  ])("rejects a production localhost or loopback SITE_URL: %s", (siteUrl) => {
    expect(() => resolveSiteUrl({ NODE_ENV: "production", SITE_URL: siteUrl })).toThrow(
      "SITE_URL must not use localhost or a loopback origin in production",
    );
  });

  it("permits explicit localhost in development and the reserved CI origin in production", () => {
    expect(resolveSiteUrl({ NODE_ENV: "development", SITE_URL: "http://127.0.0.1:4000" }).origin)
      .toBe("http://127.0.0.1:4000");
    expect(resolveSiteUrl({ NODE_ENV: "test", SITE_URL: "http://[::1]:4000" }).origin)
      .toBe("http://[::1]:4000");
    expect(resolveSiteUrl({ NODE_ENV: "production", SITE_URL: "https://example.invalid" }).origin)
      .toBe("https://example.invalid");
  });

  it.each([
    "fieldbook.example",
    "ftp://fieldbook.example",
    "https://fieldbook.example/path",
    "https://user:password@fieldbook.example",
    "https://fieldbook.example?preview=true",
  ])("retains absolute http(s) origin validation for SITE_URL: %s", (siteUrl) => {
    expect(() => resolveSiteUrl({ NODE_ENV: "production", SITE_URL: siteUrl })).toThrow(
      "SITE_URL must be an absolute http(s) origin",
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
    expect(home.authors).toEqual([
      { name: "Shivansh Fulper", url: "https://shivanshfulper.com" },
    ]);
    expect(home.keywords).toContain("agent harness engineering");
    expect(home.robots).toMatchObject({ index: true, follow: true });
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
      expect.objectContaining({
        "@type": "Person",
        name: "Shivansh Fulper",
        url: "https://shivanshfulper.com",
      }),
    ]);
    expect(structuredData).toMatchObject({
      image: `${canonicalSite}/social/systems-around-models.png`,
      articleSection: "Harness Engineering",
      publisher: {
        "@type": "Person",
        name: "Shivansh Fulper",
        url: "https://shivanshfulper.com",
      },
    });
  });

  it("publishes a connected WebSite, author, and fieldbook graph for answer engines", () => {
    vi.stubEnv("SITE_URL", canonicalSite);
    const structuredData = buildHomeJsonLd();

    expect(structuredData["@graph"]).toEqual(expect.arrayContaining([
      expect.objectContaining({
        "@type": "WebSite",
        name: "Systems Around Models",
        author: { "@id": "https://shivanshfulper.com/#person" },
      }),
      expect.objectContaining({
        "@type": "Person",
        name: "Shivansh Fulper",
        url: "https://shivanshfulper.com",
      }),
      expect.objectContaining({
        "@type": "CollectionPage",
        about: expect.arrayContaining([
          { "@type": "Thing", name: "agent harness engineering" },
        ]),
      }),
    ]));
  });
});

describe("publication discovery endpoints", () => {
  it("lists exactly the complete publication routes in the sitemap", async () => {
    vi.stubEnv("SITE_URL", canonicalSite);
    const entries = await sitemap();

    expect(entries.map((entry) => entry.url)).toEqual([
      `${canonicalSite}/`,
      `${canonicalSite}/architectures`,
      `${canonicalSite}/architectures/deepseek-harness-cordis`,
      `${canonicalSite}/architectures/openai-codex`,
      `${canonicalSite}${guidePath}`,
      `${canonicalSite}${memoryGuidePath}`,
      `${canonicalSite}${chapterPath}`,
      ...releasedChapterPaths.map((path) => `${canonicalSite}${path}`),
    ]);
  });

  it("publishes the flagship essay and canonical URL in RSS", async () => {
    vi.stubEnv("SITE_URL", canonicalSite);
    const response = await getRss();
    const body = await response.text();

    expect(response.headers.get("content-type")).toContain("application/rss+xml");
    expect(body).toContain("<title>The Model Is Not the Agent</title>");
    expect(body).toContain("<title>Harness Engineering: A Practical Study Guide</title>");
    expect(body).toContain("<title>Memory Engineering: A Practical Study Guide</title>");
    expect(body).toContain(`<link>${canonicalSite}${guidePath}</link>`);
    expect(body).toContain(`<link>${canonicalSite}${chapterPath}</link>`);
    expect(body).toContain(`<link>${canonicalSite}${memoryGuidePath}</link>`);
    expect(body).toContain("revision-memory-engineering-study-guide-001");
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
