import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";

async function repositoryFile(filename: string) {
  return readFile(path.join(process.cwd(), filename), "utf8");
}

describe("release review assets", () => {
  it("keeps print evidence, revisions, expanded URLs, and monochrome diagrams", async () => {
    const css = await repositoryFile("app/globals.css");

    expect(css).toContain("@media print");
    expect(css).toContain('.article-reader a[href^="http"]::after');
    expect(css).toMatch(/\.evidence-disclosure__static-label\s*{[\s\S]*?display: inline-block !important/);
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

    expect(workflow).toContain("SITE_URL: https://example.invalid");
    for (const command of [
      "npm ci",
      "npm run lint",
      "npm test",
      "npm run check:public",
      "npm run build",
    ]) {
      expect(workflow).toContain(`run: ${command}`);
    }
  });
});
