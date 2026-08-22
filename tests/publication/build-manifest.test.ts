import { execFile } from "node:child_process";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const fixtureRoots: string[] = [];
const generator = path.join(process.cwd(), "scripts", "generate-public-manifest.mjs");

async function manifestFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "systems-around-models-manifest-"));
  fixtureRoots.push(root);
  await cp(path.join(process.cwd(), "content"), path.join(root, "content"), { recursive: true });
  return root;
}

async function generate(root: string) {
  try {
    const result = await execFileAsync(process.execPath, [generator, "--root", root]);
    return { code: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    const failure = error as { code: number; stdout: string; stderr: string };
    return { code: failure.code, stdout: failure.stdout, stderr: failure.stderr };
  }
}

afterEach(async () => {
  await Promise.all(fixtureRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("deterministic public build manifest", () => {
  it("contains revision, essay hash, source validation, and a stable schema version", async () => {
    const root = await manifestFixture();
    const result = await generate(root);
    expect(result.code).toBe(0);

    const manifest = JSON.parse(
      await readFile(path.join(root, "public", "publication-manifest.json"), "utf8"),
    );
    expect(manifest).toMatchObject({
      schemaVersion: 1,
      validationSchemaVersion: "publication-v1",
      revisions: [
        {
          id: "revision-fieldbook-essay-001",
          essaySlug: "the-model-is-not-the-agent",
          publishedAt: "2026-08-21",
          substantivelyRevisedAt: "2026-08-21",
          summary: "Initial public revision for the first Harness Engineering fieldbook chapter.",
          affectedClaimIds: [
            "claim-ambiguous-effect-failure-pattern",
            "claim-architecture-selection-responsibilities",
            "claim-earendil-beginner-harness-map",
            "claim-earendil-harness-ownership-philosophy",
            "claim-harness-capability-configuration",
            "claim-system-trace-responsibility-checklist",
          ],
          correctionDisposition: "publication",
          sourceIds: [
            "source-earendil-what-is-a-harness",
            "source-harness-engineering-fieldbook-v1",
          ],
        },
      ],
    });
    expect(manifest.buildId).toMatch(/^sha256-[a-f0-9]{64}$/);
    expect(manifest.revisions[0].contentHash).toMatch(/^sha256-[a-f0-9]{64}$/);
    expect(manifest.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "source-harness-engineering-fieldbook-v1",
        lastValidated: "2026-08-21",
      }),
    ]));
    await expect(
      readFile(
        path.join(root, "public", "manifests", "revision-fieldbook-essay-001.json"),
        "utf8",
      ),
    ).resolves.toContain('"correctionDisposition": "publication"');
  });

  it("is stable for identical content and changes its hashes when essay content changes", async () => {
    const root = await manifestFixture();
    expect((await generate(root)).code).toBe(0);
    const manifestPath = path.join(root, "public", "publication-manifest.json");
    const first = await readFile(manifestPath, "utf8");
    expect((await generate(root)).code).toBe(0);
    expect(await readFile(manifestPath, "utf8")).toBe(first);

    const essayPath = path.join(
      root,
      "content",
      "essays",
      "harness",
      "the-model-is-not-the-agent.mdx",
    );
    await writeFile(essayPath, `${await readFile(essayPath, "utf8")}\nA substantive test change.\n`);
    expect((await generate(root)).code).toBe(0);
    const second = await readFile(manifestPath, "utf8");
    expect(JSON.parse(second).buildId).not.toBe(JSON.parse(first).buildId);
    expect(JSON.parse(second).revisions[0].contentHash).not.toBe(
      JSON.parse(first).revisions[0].contentHash,
    );
  });
});
