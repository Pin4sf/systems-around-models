import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const fixtureRoots: string[] = [];
const scanner = path.join(process.cwd(), "scripts", "check-public-content.mjs");
const privateCorpusName = ["waldo", "brain"].join("-");
const fakeGitHubToken = ["ghp", "1234567890abcdefghijklmnop"].join("_");
const fakeApiKey = ["sk", "abcdefghijklmnopqrstuv"].join("-");
const credentialField = ["sec", "ret"].join("");
const posixPath = (...segments: string[]) => path.posix.join("/", ...segments);

async function write(root: string, filename: string, contents: string) {
  const target = path.join(root, filename);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents);
}

async function writeTracked(root: string, filename: string, contents: string) {
  await write(root, filename, contents);
  await execFileAsync("git", ["add", "-f", "--", filename], { cwd: root });
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
  await write(root, ".gitignore", [
    "node_modules/",
    ".next/",
    "playwright-report/",
    "test-results/",
    "",
  ].join("\n"));
  await execFileAsync("git", ["init", "-q"], { cwd: root });
  await execFileAsync("git", ["add", "."], { cwd: root });
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

async function runBuiltScanner(root: string, outputDirectory: string) {
  try {
    const result = await execFileAsync(process.execPath, [
      scanner,
      "--root",
      root,
      "--built-output",
      outputDirectory,
    ]);
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
    ["absolute local paths", `Local file ${posixPath("Users", "example", "private", "trace.json")}`, "absolute local path"],
    ["private corpus names", `Runtime dependency: ${privateCorpusName}`, privateCorpusName],
    ["credential patterns", `Leaked token: ${fakeGitHubToken}`, "credential pattern"],
  ])("rejects %s", async (_name, prose, expected) => {
    const root = await publicFixture();
    await writeTracked(root, "content/essays/leak.md", prose);

    const result = await runScanner(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain(expected);
    expect(result.stderr).toContain("content/essays/leak.md");
  });

  it.each([
    ["public/trace.txt", `Local trace ${posixPath("private", "var", "folders", "ab", "private-trace.json")}`, "absolute local path"],
    ["app/globals.css", `/* Runtime dependency: ${privateCorpusName} */`, privateCorpusName],
    ["content/essays/LEAK.MDX", `Leaked token: ${fakeGitHubToken}`, "credential pattern"],
    ["public/config.json", JSON.stringify({ privatePath: posixPath("root", "private", "config.json") }), "absolute local path"],
    ["public/diagram.svg", `<svg><text>Runtime dependency: ${privateCorpusName}</text></svg>`, privateCorpusName],
    ["public/index.html", `<p>Runtime dependency: ${privateCorpusName}</p>`, privateCorpusName],
    ["public/runtime.js", `const privateCorpus = '${privateCorpusName}';`, privateCorpusName],
  ])("scans deployable text surface %s", async (filename, contents, expected) => {
    const root = await publicFixture();
    await writeTracked(root, filename, contents);

    const result = await runScanner(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain(expected);
    expect(result.stderr).toContain(filename);
  });

  it.each([
    ["package.json", JSON.stringify({ scripts: { preview: `echo ${privateCorpusName}` } }), privateCorpusName],
    ["next.config.ts", `export default ${JSON.stringify({ [credentialField]: fakeApiKey })};`, "credential pattern"],
    ["vercel.json", JSON.stringify({ buildCommand: `echo ${privateCorpusName}` }), privateCorpusName],
    ["Dockerfile", `RUN echo ${privateCorpusName}`, privateCorpusName],
    ["release-config", `private_path=${posixPath("Users", "example", "private", "release.json")}`, "absolute local path"],
    ["scripts/release.mjs", `const local = "${posixPath("Users", "example", "private", "release.json")}";`, "absolute local path"],
    [".github/workflows/verify.yml", `env:\n  PRIVATE_CORPUS: ${privateCorpusName}\n`, privateCorpusName],
  ])("scans tracked publication/build file %s", async (filename, contents, expected) => {
    const root = await publicFixture();
    await writeTracked(root, filename, contents);

    const result = await runScanner(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain(expected);
    expect(result.stderr).toContain(filename);
  });

  it("does not scan dependencies, caches, git data, ignored reports, or binary assets", async () => {
    const root = await publicFixture();
    await write(root, "node_modules/package/leak.js", privateCorpusName);
    await write(root, ".next/cache/leak.txt", privateCorpusName);
    await write(root, ".git/private.txt", privateCorpusName);
    await write(root, "playwright-report/leak.html", privateCorpusName);
    await write(root, "public/card.png", privateCorpusName);
    await execFileAsync("git", [
      "add", "-f", "--", "node_modules/package/leak.js", ".next/cache/leak.txt",
      "playwright-report/leak.html", "public/card.png",
    ], { cwd: root });

    const result = await runScanner(root);
    expect(result.code).toBe(0);
  });

  it("ignores a tracked publication file deleted in the working tree", async () => {
    const root = await publicFixture();
    await write(root, "scripts/removed.mjs", "export const removed = true;\n");
    await execFileAsync("git", ["add", "scripts/removed.mjs"], { cwd: root });
    await rm(path.join(root, "scripts", "removed.mjs"));

    const result = await runScanner(root);
    expect(result.code).toBe(0);
  });

  it.each([
    ["server/app/index.html", `<p>${privateCorpusName}</p>`, privateCorpusName],
    ["server/app/config.json", JSON.stringify({ path: posixPath("Users", "example", "private", "build.json") }), "absolute local path"],
    ["static/chunks/app.js", `const token = "${fakeGitHubToken}";`, "credential pattern"],
  ])("rejects sensitive text in deployable generated output %s", async (filename, contents, expected) => {
    const root = await publicFixture();
    const output = path.join(root, "generated-site");
    await write(root, `generated-site/${filename}`, contents);

    const result = await runBuiltScanner(root, output);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain(`generated-site/${filename}`);
    expect(result.stderr).toContain(expected);
  });

  it.each([
    ["server/chunks/runtime.js", `const corpus = '${privateCorpusName}';`, privateCorpusName],
    ["server/app/robots.txt.body", `Local file ${posixPath("Users", "example", "private", "robots.txt")}`, "absolute local path"],
    ["server/app/index.rsc", fakeGitHubToken, "credential pattern"],
  ])("rejects sensitive text throughout .next deployable output %s", async (filename, contents, expected) => {
    const root = await publicFixture();
    const output = path.join(root, ".next");
    await write(root, `.next/${filename}`, contents);

    const result = await runBuiltScanner(root, output);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain(`.next/${filename}`);
    expect(result.stderr).toContain(expected);
  });

  it("accepts safe deployable generated text and ignores generated binary noise", async () => {
    const root = await publicFixture();
    const output = path.join(root, "generated-site");
    await write(root, "generated-site/server/app/index.html", "<p>Public fieldbook</p>");
    await write(root, "generated-site/static/chunks/app.js", "console.log('public');");
    await write(root, "generated-site/public/card.png", privateCorpusName);

    const result = await runBuiltScanner(root, output);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain("Built output check passed");
  });

  it("accepts safe .next server chunks, route bodies, RSC payloads, static assets, and binary noise", async () => {
    const root = await publicFixture();
    const output = path.join(root, ".next");
    await write(root, ".next/server/chunks/runtime.js", "console.log('public runtime');");
    await write(root, ".next/server/app/robots.txt.body", "User-agent: *\nAllow: /\n");
    await write(root, ".next/server/app/index.rsc", "1:[\"$\",\"main\",null,{\"children\":\"Public fieldbook\"}]");
    await write(root, ".next/static/chunks/app.js", "console.log('public client');");
    await write(root, ".next/server/app/card.png", privateCorpusName);

    const result = await runBuiltScanner(root, output);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain("Built output check passed");
  });

  it.each([
    posixPath("root", "private", "trace.json"),
    posixPath("private", "tmp", "private-trace.json"),
    posixPath("var", "folders", "ab", "private-trace.json"),
    posixPath("Volumes", "Research", "private-trace.json"),
    ["C:", "work", "private-trace.json"].join("\\"),
    ["", "", "workstation", "private", "trace.json"].join("\\"),
    posixPath("opt", "private", "research.json"),
    posixPath("etc", "company", "secret.conf"),
    posixPath("workspace", "private", "notes.md"),
    posixPath("var", "lib", "company", "private.db"),
    posixPath("quasar-lab", "private", "evidence.parquet"),
    posixPath("assets", "private", "research.json"),
    posixPath("fieldbook", "private", "research.json"),
    posixPath("images", "etc", "company", "secret.conf"),
  ])("rejects additional absolute local path form %s", async (localPath) => {
    const root = await publicFixture();
    await writeTracked(root, "public/trace.txt", `Local artifact: ${localPath}`);

    const result = await runScanner(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("absolute local path");
    expect(result.stderr).toContain("public/trace.txt");
  });

  it("does not confuse ordinary web paths with local filesystem paths", async () => {
    const root = await publicFixture();
    await writeTracked(root, "app/globals.css", "@font-face { src: url(/fonts/editorial.woff2); }\n");
    await writeTracked(root, "lib/imports.ts", [
      'import font from "next/font/google";',
      'import helper from "@/lib/helper";',
      "export { font, helper };",
      "",
    ].join("\n"));
    await writeTracked(root, "public/routes.json", JSON.stringify({
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
