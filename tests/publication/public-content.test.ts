import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const fixtureRoots: string[] = [];
const scanner = path.join(process.cwd(), "scripts", "check-public-content.mjs");

async function write(root: string, filename: string, contents: string) {
  const target = path.join(root, filename);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents);
}

async function publicFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "systems-around-models-public-"));
  fixtureRoots.push(root);
  await write(root, "content/sources/source-public.yaml", [
    "id: source-public",
    "title: Public source",
    "license_status: CC-BY-4.0",
    "",
  ].join("\n"));
  await write(root, "content/claims/claim-public.yaml", [
    "id: claim-public",
    "statement: A sufficiently detailed public claim.",
    "label: observed",
    "source_ids:",
    "  - source-public",
    "",
  ].join("\n"));
  await write(root, "content/essays/public-essay.mdx", [
    "---",
    "slug: public-essay",
    "title: Public essay",
    "description: A public essay used by the release scanner fixture.",
    "status: public",
    "source_manifest_ids:",
    "  - source-public",
    "revision_id: revision-public",
    "---",
    "",
    "Public prose.",
    "",
  ].join("\n"));
  await write(root, "content/revisions/revision-public.yaml", [
    "id: revision-public",
    "target_slug: public-essay",
    "affected_claim_ids:",
    "  - claim-public",
    "",
  ].join("\n"));
  await write(
    root,
    "app/page.tsx",
    'export default function Page() { return <a href="/fieldbook/public-essay">Read</a>; }\n',
  );
  return root;
}

async function runScanner(root: string) {
  try {
    const result = await execFileAsync(process.execPath, [scanner, "--root", root]);
    return { code: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    const failure = error as { code: number; stdout: string; stderr: string };
    return { code: failure.code, stdout: failure.stdout, stderr: failure.stderr };
  }
}

afterEach(async () => {
  await Promise.all(fixtureRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("deterministic public-content scanner", () => {
  it("accepts a coherent public fixture", async () => {
    const root = await publicFixture();
    const result = await runScanner(root);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain("Public content check passed");
  });

  it.each([
    ["absolute local paths", "Local file /Users/example/private/trace.json", "absolute local path"],
    ["private corpus names", "Runtime dependency: waldo-brain", "waldo-brain"],
    ["credential patterns", "Leaked token: ghp_1234567890abcdefghijklmnop", "credential pattern"],
  ])("rejects %s", async (_name, prose, expected) => {
    const root = await publicFixture();
    await write(root, "content/essays/leak.md", prose);

    const result = await runScanner(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain(expected);
    expect(result.stderr).toContain("content/essays/leak.md");
  });

  it.each([
    ["public/trace.txt", "Local trace /private/var/folders/ab/private-trace.json", "absolute local path"],
    ["app/globals.css", "/* Runtime dependency: waldo-brain */", "waldo-brain"],
    ["content/essays/LEAK.MDX", "Leaked token: ghp_1234567890abcdefghijklmnop", "credential pattern"],
    ["public/config.json", '{"privatePath":"/root/private/config.json"}', "absolute local path"],
    ["public/diagram.svg", "<svg><text>Runtime dependency: waldo-brain</text></svg>", "waldo-brain"],
    ["public/index.html", "<p>Runtime dependency: waldo-brain</p>", "waldo-brain"],
    ["public/runtime.js", "const privateCorpus = 'waldo-brain';", "waldo-brain"],
  ])("scans deployable text surface %s", async (filename, contents, expected) => {
    const root = await publicFixture();
    await write(root, filename, contents);

    const result = await runScanner(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain(expected);
    expect(result.stderr).toContain(filename);
  });

  it.each([
    "/root/private/trace.json",
    "/private/tmp/private-trace.json",
    "/var/folders/ab/private-trace.json",
    "/Volumes/Research/private-trace.json",
    "C:\\work\\private-trace.json",
    "\\\\workstation\\private\\trace.json",
    "/opt/private/research.json",
    "/etc/company/secret.conf",
    "/workspace/private/notes.md",
    "/var/lib/company/private.db",
    "/quasar-lab/private/evidence.parquet",
    "/assets/private/research.json",
    "/fieldbook/private/research.json",
    "/images/etc/company/secret.conf",
  ])("rejects additional absolute local path form %s", async (localPath) => {
    const root = await publicFixture();
    await write(root, "public/trace.txt", `Local artifact: ${localPath}`);

    const result = await runScanner(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("absolute local path");
    expect(result.stderr).toContain("public/trace.txt");
  });

  it("does not confuse ordinary web paths with local filesystem paths", async () => {
    const root = await publicFixture();
    await write(root, "app/globals.css", "@font-face { src: url(/fonts/editorial.woff2); }\n");
    await write(root, "lib/imports.ts", [
      'import font from "next/font/google";',
      'import helper from "@/lib/helper";',
      "export { font, helper };",
      "",
    ].join("\n"));
    await write(root, "public/routes.json", JSON.stringify({
      chapter: "/fieldbook/public-essay",
      home: "/home/about",
      robots: "/robots.txt",
      rss: "/rss.xml",
      sitemap: "/sitemap.xml",
      source: "https://example.org/posts/harnesses",
      users: "/users/profile",
    }));

    const result = await runScanner(root);
    expect(result.code).toBe(0);
  });

  it("rejects unresolved source_ids", async () => {
    const root = await publicFixture();
    await write(root, "content/claims/claim-public.yaml", [
      "id: claim-public",
      "statement: A sufficiently detailed public claim.",
      "label: observed",
      "source_ids:",
      "  - source-missing",
      "",
    ].join("\n"));

    const result = await runScanner(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("unresolved source identifier source-missing");
  });

  it("rejects invalid evidence labels", async () => {
    const root = await publicFixture();
    await write(root, "content/claims/claim-public.yaml", [
      "id: claim-public",
      "statement: A sufficiently detailed public claim.",
      "label: probably",
      "source_ids:",
      "  - source-public",
      "",
    ].join("\n"));

    const result = await runScanner(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("invalid evidence label probably");
  });

  it("rejects sources without a license status", async () => {
    const root = await publicFixture();
    await write(root, "content/sources/source-public.yaml", [
      "id: source-public",
      "title: Public source",
      "",
    ].join("\n"));

    const result = await runScanner(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("missing license_status");
  });

  it("rejects navigation to an unpublished essay", async () => {
    const root = await publicFixture();
    await write(root, "content/essays/draft-essay.mdx", [
      "---",
      "slug: draft-essay",
      "title: Draft essay",
      "description: A draft essay that must not be reachable from public navigation.",
      "status: draft",
      "source_manifest_ids:",
      "  - source-public",
      "revision_id: revision-public",
      "---",
      "",
    ].join("\n"));
    await write(
      root,
      "app/page.tsx",
      'export default function Page() { return <a href="/fieldbook/draft-essay">Draft</a>; }\n',
    );

    const result = await runScanner(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("navigation references unpublished essay draft-essay");
  });
});
