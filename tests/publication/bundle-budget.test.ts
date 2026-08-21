import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const fixtureRoots: string[] = [];
const checker = path.join(process.cwd(), "scripts", "check-bundle-budget.mjs");
const stripper = path.join(process.cwd(), "scripts", "strip-static-client-scripts.mjs");

async function write(root: string, filename: string, contents: string) {
  const target = path.join(root, filename);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents);
}

async function bundleFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "systems-around-models-bundle-"));
  fixtureRoots.push(root);
  await write(root, "server/app/fieldbook/chapter.html", [
    '<script src="/_next/static/chunks/a.js"></script>',
    '<script src="/_next/static/chunks/a.js"></script>',
    '<script src="/_next/static/chunks/b.js"></script>',
  ].join(""));
  await write(root, "static/chunks/a.js", "a".repeat(10_000));
  await write(root, "static/chunks/b.js", "b".repeat(10_000));
  return root;
}

async function run(root: string, limit: number) {
  try {
    const result = await execFileAsync(process.execPath, [
      checker,
      "--build-dir",
      root,
      "--route-html",
      "server/app/fieldbook/chapter.html",
      "--limit",
      String(limit),
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

describe("representative route JavaScript budget", () => {
  it("removes hydration scripts from static HTML while preserving JSON-LD", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "systems-around-models-static-html-"));
    fixtureRoots.push(root);
    const htmlPath = "server/app/fieldbook/chapter.html";
    await write(root, htmlPath, [
      '<link rel="preload" as="script" href="/_next/static/chunks/a.js">',
      '<script src="/_next/static/chunks/a.js"></script>',
      '<script>self.__next_f.push([1,"route data"])</script>',
      '<script type="application/ld+json">{"@type":"Article"}</script>',
      '<main>Readable without JavaScript</main>',
    ].join(""));

    const result = await execFileAsync(process.execPath, [stripper, "--build-dir", root]);
    expect(result.stdout).toContain("Static client scripts removed");
    const stripped = await import("node:fs/promises").then(({ readFile }) => readFile(path.join(root, htmlPath), "utf8"));
    expect(stripped).not.toContain("/_next/static/chunks/a.js");
    expect(stripped).not.toContain("self.__next_f");
    expect(stripped).toContain('<script type="application/ld+json">{"@type":"Article"}</script>');
    expect(stripped).toContain("Readable without JavaScript");
  });

  it("counts unique route assets with deterministic gzip and passes under the limit", async () => {
    const root = await bundleFixture();
    const result = await run(root, 1_000);

    expect(result.code).toBe(0);
    expect(result.stdout).toMatch(/2 unique JavaScript assets/);
    expect(result.stdout).toMatch(/gzip bytes/);
  });

  it("fails when the unique compressed route assets exceed the limit", async () => {
    const root = await bundleFixture();
    const result = await run(root, 1);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain("exceeds 1 byte budget");
  });
});
