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
      schemaVersion: 2,
      validationSchemaVersion: "publication-v2",
      revisions: expect.arrayContaining([
        expect.objectContaining({
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
          sourceIds: expect.arrayContaining([
            "source-earendil-what-is-a-harness",
            "source-harness-engineering-fieldbook-v1",
          ]),
        }),
        expect.objectContaining({
          id: "revision-harness-engineering-study-guide-001",
          essaySlug: "harness-engineering-study-guide",
          publishedAt: "2026-08-22",
          substantivelyRevisedAt: "2026-08-22",
          summary: "Initial public edition of the complete short Harness Engineering study guide.",
          correctionDisposition: "publication",
          sourceIds: expect.arrayContaining([
            "source-earendil-what-is-a-harness",
            "source-harness-engineering-fieldbook-v1",
            "source-walkinglabs-learn-harness-engineering",
            "source-walkinglabs-awesome-harness-engineering",
            "source-rasa-why-agents-fail",
            "source-anthropic-effective-long-running-harnesses",
            "source-langchain-anatomy-agent-harness",
            "source-humanlayer-12-factor-agents",
          ]),
        }),
        expect.objectContaining({
          id: "revision-harness-engineering-study-guide-002",
          essaySlug: "harness-engineering-study-guide",
          publishedAt: "2026-08-22",
          substantivelyRevisedAt: "2026-08-25",
          correctionDisposition: "publication",
          sourceIds: expect.arrayContaining([
            "source-openviking-context-database",
            "source-agentmemory-runtime",
            "source-anthropic-agent-skills-repository",
            "source-diagram-design-skill",
            "source-scientific-agent-skills",
            "source-ai-boost-awesome-harness-engineering",
            "source-community-cybersecurity-skills",
            "source-ai-job-search-workflow",
            "source-architecture-openhands",
            "source-browser-use-runtime",
          ]),
        }),
        expect.objectContaining({
          id: "revision-memory-engineering-study-guide-001",
          essaySlug: "memory-engineering-study-guide",
          publishedAt: "2026-08-22",
          substantivelyRevisedAt: "2026-08-22",
          summary: "Initial public edition of the complete short Memory Engineering study guide.",
          correctionDisposition: "publication",
          sourceIds: expect.arrayContaining([
            "source-memory-memgpt",
            "source-memory-anthropic-context-engineering",
            "source-memory-owasp-memory-attack-surface",
          ]),
        }),
      ]),
    });
    expect(manifest.architectures).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "architecture-openai-codex",
        slug: "openai-codex",
        revision: 1,
        evidenceGrade: "FD",
        evidenceFidelity: "working-profile",
        sourceIds: ["source-architecture-openai-codex"],
        contentHash: expect.stringMatching(/^sha256-[a-f0-9]{64}$/),
      }),
      expect.objectContaining({
        id: "architecture-mem0",
        slug: "mem0",
      }),
    ]));
    expect(manifest.lessons).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "lesson-how-to-compare-agent-systems",
        architectureIds: expect.arrayContaining([
          "architecture-openai-codex",
          "architecture-mem0",
        ]),
      }),
    ]));
    expect(manifest.buildId).toMatch(/^sha256-[a-f0-9]{64}$/);
    expect(manifest.revisions[0].contentHash).toMatch(/^sha256-[a-f0-9]{64}$/);
    expect(manifest.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "source-harness-engineering-fieldbook-v1",
        lastValidated: "2026-08-21",
      }),
      expect.objectContaining({
        id: "source-memory-memgpt",
        lastValidated: "2026-08-22",
      }),
    ]));
    await expect(
      readFile(
        path.join(root, "public", "manifests", "revision-fieldbook-essay-001.json"),
        "utf8",
      ),
    ).resolves.toContain('"correctionDisposition": "publication"');
    await expect(
      readFile(
        path.join(root, "public", "manifests", "revision-harness-engineering-study-guide-001.json"),
        "utf8",
      ),
    ).resolves.toContain('"essaySlug": "harness-engineering-study-guide"');
    await expect(
      readFile(
        path.join(root, "public", "manifests", "revision-harness-engineering-study-guide-002.json"),
        "utf8",
      ),
    ).resolves.toContain('"revision": 2');
    await expect(
      readFile(
        path.join(root, "public", "manifests", "revision-memory-engineering-study-guide-001.json"),
        "utf8",
      ),
    ).resolves.toContain('"essaySlug": "memory-engineering-study-guide"');
    await expect(
      readFile(path.join(root, "public", "manifests", "architecture-openai-codex.json"), "utf8"),
    ).resolves.toContain('"slug": "openai-codex"');
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
    const firstRevision = JSON.parse(first).revisions.find(
      (revision: { id: string }) => revision.id === "revision-fieldbook-essay-001",
    );
    const secondRevision = JSON.parse(second).revisions.find(
      (revision: { id: string }) => revision.id === "revision-fieldbook-essay-001",
    );
    expect(secondRevision.contentHash).not.toBe(firstRevision.contentHash);
  });

  it("keeps historical source identity frozen when a live source record changes", async () => {
    const root = await manifestFixture();
    expect((await generate(root)).code).toBe(0);
    const historicalPath = path.join(
      root,
      "public",
      "manifests",
      "revision-harness-engineering-study-guide-001.json",
    );
    const before = JSON.parse(await readFile(historicalPath, "utf8"));
    const sourcePath = path.join(
      root,
      "content",
      "sources",
      "source-earendil-what-is-a-harness.yaml",
    );
    const source = await readFile(sourcePath, "utf8");
    await writeFile(
      sourcePath,
      source
        .replace("https://earendil.com/posts/what-is-a-harness/", "https://example.com/revalidated-source")
        .replace("last_validated: 2026-08-21", "last_validated: 2026-08-25"),
    );

    expect((await generate(root)).code).toBe(0);
    const after = JSON.parse(await readFile(historicalPath, "utf8"));
    expect(after.sources).toEqual(before.sources);
    expect(after.sourceValidationDates).toEqual(before.sourceValidationDates);
  });

  it("rejects a historical revision with a malformed frozen snapshot", async () => {
    const root = await manifestFixture();
    const revisionPath = path.join(
      root,
      "content",
      "revisions",
      "revision-harness-engineering-study-guide-001.yaml",
    );
    const revision = await readFile(revisionPath, "utf8");
    await writeFile(revisionPath, revision.replace(/^content_hash: .*$/m, "content_hash: not-a-hash"));

    const result = await generate(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("missing its frozen content and source snapshot");
  });

  it("rejects malformed source identity inside a historical snapshot", async () => {
    const root = await manifestFixture();
    const revisionPath = path.join(
      root,
      "content",
      "revisions",
      "revision-harness-engineering-study-guide-001.yaml",
    );
    const revision = await readFile(revisionPath, "utf8");
    await writeFile(
      revisionPath,
      revision.replace(
        "canonical_url: https://earendil.com/posts/what-is-a-harness/",
        "canonical_url: not-a-url",
      ),
    );

    const result = await generate(root);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("contains an invalid source snapshot");
  });
});
