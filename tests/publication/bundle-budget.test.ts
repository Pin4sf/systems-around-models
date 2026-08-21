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

async function runStripper(root: string) {
  try {
    const result = await execFileAsync(process.execPath, [stripper, "--build-dir", root]);
    return { code: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    const failure = error as { code: number; stdout: string; stderr: string };
    return { code: failure.code, stdout: failure.stdout, stderr: failure.stderr };
  }
}

async function productionHtmlFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "systems-around-models-static-html-"));
  fixtureRoots.push(root);
  await Promise.all([
    write(root, "server/app/index.html", "<main>Homepage</main>"),
    write(root, "server/app/fieldbook/the-model-is-not-the-agent.html", "<main>Chapter</main>"),
    write(root, "server/app/_not-found.html", "<main>Not found</main>"),
    write(root, "server/pages/404.html", "<main>404</main>"),
  ]);
  return root;
}

afterEach(async () => {
  await Promise.all(fixtureRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("representative route JavaScript budget", () => {
  it("fails closed when no production HTML exists", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "systems-around-models-empty-build-"));
    fixtureRoots.push(root);
    await mkdir(path.join(root, "server", "app"), { recursive: true });

    const result = await runStripper(root);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain("No production HTML documents found");
  });

  it("requires the homepage, chapter, and not-found production documents", async () => {
    const root = await productionHtmlFixture();
    await rm(path.join(root, "server", "app", "_not-found.html"));

    const result = await runStripper(root);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain("Missing expected production HTML");
    expect(result.stderr).toContain("server/app/_not-found.html");
  });

  it.each([
    ["homepage", "server/app/index.html"],
    ["chapter", "server/app/fieldbook/the-model-is-not-the-agent.html"],
    ["not-found", "server/app/_not-found.html"],
    ["404", "server/pages/404.html"],
  ])("strips executable script forms from the %s document", async (_name, htmlPath) => {
    const root = await productionHtmlFixture();
    await write(root, htmlPath, [
      '<link rel="preload" as="font" href="/font.woff2">',
      '<link rel="stylesheet" href="/styles.css">',
      '<link rel=preload as=script href="/_next/static/chunks/preload.js">',
      '<link rel=modulepreload href="/_next/static/chunks/module.js">',
      '<script src="/_next/static/chunks/self-closing.js"/>',
      '<script src="/_next/static/chunks/paired.js"></script>',
      '<script>self.__next_f.push([1,"route data"])</script>',
      '<script type="application/ld+json">{"@type":"Article"}</script>',
      '<script src="/_next/static/chunks/unclosed.js">',
      '<main>Readable without JavaScript</main>',
    ].join(""));

    const result = await runStripper(root);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain("Static client scripts removed");
    const stripped = await import("node:fs/promises").then(({ readFile }) => readFile(path.join(root, htmlPath), "utf8"));
    expect(stripped).not.toMatch(/<script(?![^>]*type=["']application\/ld\+json["'])/i);
    expect(stripped).not.toMatch(/rel=["'](?:modulepreload|preload)["'][^>]*as=["']script["']/i);
    expect(stripped).not.toContain("modulepreload");
    expect(stripped).toContain('<script type="application/ld+json">{"@type":"Article"}</script>');
    expect(stripped).toContain('rel="preload" as="font"');
    expect(stripped).toContain('rel="stylesheet"');
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
