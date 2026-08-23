import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { buildHomeMetadata } from "@/lib/publication/metadata";
import { loadContent } from "@/lib/content/load-content";
import { buildArticleMetadata } from "@/lib/publication/metadata";

async function repositoryFile(filename: string) {
  return readFile(path.join(process.cwd(), filename), "utf8");
}

describe("release review assets", () => {
  it("keeps print evidence, revisions, expanded URLs, and monochrome diagrams", async () => {
    const css = await repositoryFile("app/globals.css");

    expect(css).toContain("@media print");
    expect(css).toContain('.article-reader a[href^="http"]::after');
    expect(css).toMatch(/\.evidence-disclosure__details\s*{[\s\S]*?display: block !important/);
    expect(css).toMatch(/\.system-trace,[\s\S]*?break-inside: avoid/);
    expect(css).toContain("color: #000 !important");
  });

  it("disables motion under the reduced-motion preference", async () => {
    const css = await repositoryFile("app/globals.css");
    const reducedMotion = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));

    expect(reducedMotion).toContain("transition: none !important");
    expect(reducedMotion).toContain("animation: none !important");
  });

  it("collects a precise correction while warning against private submissions", async () => {
    const template = parseYaml(
      await repositoryFile(".github/ISSUE_TEMPLATE/correction.yml"),
    ) as {
      body: Array<{ id?: string; attributes?: { value?: string } }>;
    };
    const ids = template.body.flatMap((field) => field.id ? [field.id] : []);
    const prose = JSON.stringify(template);

    expect(ids).toEqual([
      "page-url",
      "revision",
      "section",
      "disputed-statement",
      "counter-evidence",
      "desired-correction",
      "privacy-confirmation",
    ]);
    for (const protectedData of [
      "credentials",
      "personal data",
      "health data",
      "private traces",
      "copyrighted documents",
    ]) {
      expect(prose).toContain(protectedData);
    }
  });

  it("runs every release gate in CI with an explicit non-public SITE_URL", async () => {
    const workflow = await repositoryFile(".github/workflows/verify.yml");
    const packageJson = JSON.parse(await repositoryFile("package.json")) as {
      scripts: Record<string, string>;
    };

    expect(workflow).toContain("SITE_URL: https://example.invalid");
    expect(workflow).toMatch(/run: npm ci[\s\S]*run: npm run verify:release/);
    expect(packageJson.scripts["verify:release"]).toBe(
      "npm run lint && npm test && npm run check:public && npm run build && npm run check:built && npm run check:bundle && npm run test:e2e",
    );
    expect(packageJson.scripts["check:built"]).toContain("--built-output .next");
    expect(packageJson.scripts["check:bundle"]).toContain("120000");
  });

  it("uses a production Playwright server after the authoritative build", async () => {
    const config = await repositoryFile("playwright.config.ts");

    expect(config).toContain("npm run start");
    expect(config).not.toContain("npm run dev");
  });

  it("publishes an original 1200 by 630 share asset in home and article metadata", async () => {
    const asset = path.join(process.cwd(), "public", "social", "systems-around-models.png");
    await expect(access(asset)).resolves.toBeUndefined();
    const metadata = await sharp(asset).metadata();
    expect(metadata).toMatchObject({ width: 1200, height: 630, format: "png" });

    const home = buildHomeMetadata();
    const content = await loadContent();
    const essay = content.essays.get("the-model-is-not-the-agent");
    const revision = content.revisions.get("revision-fieldbook-essay-001");
    if (!essay || !revision) throw new Error("Expected flagship publication records");
    const article = buildArticleMetadata(essay, revision);
    expect(home.openGraph).toMatchObject({
      images: [{ url: "/social/systems-around-models.png", width: 1200, height: 630 }],
    });
    expect(home.twitter).toMatchObject({
      card: "summary_large_image",
      images: ["/social/systems-around-models.png"],
    });
    expect(article.openGraph).toMatchObject({
      images: [{ url: "/social/systems-around-models.png", width: 1200, height: 630 }],
    });
  });

  it("ships the system-orbit brand mark as the favicon and manifest icon", async () => {
    const [icon, manifest] = await Promise.all([
      repositoryFile("app/icon.svg"),
      repositoryFile("app/manifest.ts"),
    ]);

    expect(icon).toContain("Systems Around Models");
    expect(icon).toContain("#28513d");
    expect(manifest).toContain('src: "/icon.svg"');
    expect(buildHomeMetadata().icons).toMatchObject({ shortcut: "/icon.svg" });
  });

  it("keeps the share-card trace aligned with the canonical end-to-end trace", async () => {
    const svg = await repositoryFile("assets/social/systems-around-models.svg");
    const labels = [
      "ADMIT", "CONTEXT", "CAPABILITIES", "EXECUTE", "STATE", "EFFECT", "RECONCILE",
      "EVIDENCE", "VERIFY", "ACCEPT OR RE-ENTER",
    ];

    let cursor = -1;
    for (const label of labels) {
      const index = svg.indexOf(label);
      expect(index, `share-card trace includes ${label}`).toBeGreaterThan(cursor);
      cursor = index;
    }
  });

  it("keeps every normal-size publication text token above WCAG AA contrast", async () => {
    const css = await repositoryFile("app/globals.css");
    const tokens = Object.fromEntries(
      [...css.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})/gi)].map((match) => [match[1], match[2]]),
    );
    const luminance = (hex: string) => {
      const channels = hex.slice(1).match(/../g)?.map((value) => Number.parseInt(value, 16) / 255);
      if (!channels) throw new Error(`Invalid color ${hex}`);
      const [red, green, blue] = channels.map((value) =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
      );
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const ratio = (foreground: string, background: string) => {
      const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
      return (values[0] + 0.05) / (values[1] + 0.05);
    };
    const pairings = [
      ["ink-muted", "paper"],
      ["ink-muted", "paper-deep"],
      ["ink-muted", "evidence-wash"],
      ["evidence", "paper"],
      ["evidence", "evidence-wash"],
      ["gold", "paper"],
      ["gold", "paper-deep"],
      ["correction", "paper"],
      ["correction", "paper-deep"],
      ["correction", "correction-wash"],
    ];

    for (const [foreground, background] of pairings) {
      expect(
        ratio(tokens[foreground], tokens[background]),
        `${foreground} on ${background}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
});
