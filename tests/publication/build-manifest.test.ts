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
          sourceValidationDates: expect.objectContaining({
            "source-anthropic-effective-long-running-harnesses": "2026-08-22",
          }),
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
        expect.objectContaining({
          id: "revision-memory-compaction-continuity-002",
          essaySlug: "memory-compaction-and-continuity",
          publishedAt: "2026-08-22",
          substantivelyRevisedAt: "2026-08-25",
          correctionDisposition: "publication",
          sourceIds: expect.arrayContaining([
            "source-openviking-context-database",
            "source-agentmemory-runtime",
          ]),
        }),
        expect.objectContaining({
          id: "revision-hermes-integrated-agent-runtime-001",
          essaySlug: "hermes-integrated-agent-runtime",
          revision: 1,
          contentHash: "sha256-4fce1564f719e726c40175373e32c1ae99bcd6c0f2a066005d38e57d6fb2d4cc",
          sourceValidationDates: {
            "source-harness-engineering-fieldbook-v1": "2026-08-21",
            "source-hermes-agent-runtime": "2026-08-25",
          },
        }),
        expect.objectContaining({
          id: "revision-hermes-integrated-agent-runtime-002",
          essaySlug: "hermes-integrated-agent-runtime",
          revision: 2,
          substantivelyRevisedAt: "2026-08-26",
        }),
        expect.objectContaining({
          id: "revision-qm-scoped-resources-and-leased-runs-001",
          essaySlug: "qm-scoped-resources-and-leased-runs",
          sourceIds: expect.arrayContaining(["source-qm-agent-runtime"]),
        }),
        expect.objectContaining({
          id: "revision-cloudflare-think-and-agents-001",
          essaySlug: "cloudflare-think-and-agents",
          sourceIds: expect.arrayContaining(["source-cloudflare-think-agents"]),
        }),
        expect.objectContaining({
          id: "revision-deepseek-harness-and-cordis-001",
          essaySlug: "deepseek-harness-and-cordis",
          sourceIds: expect.arrayContaining([
            "source-architecture-deepseek-harness",
            "source-architecture-cordis",
          ]),
        }),
        expect.objectContaining({
          id: "revision-drover-fleet-custody-and-evidence-001",
          essaySlug: "drover-fleet-custody-and-evidence",
          sourceIds: expect.arrayContaining(["source-drover-fleet-runtime"]),
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
      expect.objectContaining({
        id: "architecture-langgraph",
        slug: "langgraph",
        revision: 2,
        inspectedVersion: "95af6a00718588e7b7ce17310e8006d267896a77",
        evidenceGrade: "IP",
        evidenceFidelity: "implementation-pinned",
      }),
      expect.objectContaining({
        id: "architecture-deepseek-harness",
        revision: 2,
        inspectedVersion: "b150a551b8d465e31e418e1b2eaf5e79bbb7d28e",
        dossierStatus: "ready",
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
      expect.objectContaining({
        id: "source-qm-agent-runtime",
        lastValidated: "2026-08-26",
      }),
      expect.objectContaining({
        id: "source-cloudflare-think-agents",
        lastValidated: "2026-08-26",
      }),
      expect.objectContaining({
        id: "source-drover-fleet-runtime",
        lastValidated: "2026-08-26",
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
      readFile(
        path.join(root, "public", "manifests", "revision-memory-compaction-continuity-002.json"),
        "utf8",
      ),
    ).resolves.toContain('"revision": 2');
    await expect(
      readFile(path.join(root, "public", "manifests", "architecture-openai-codex.json"), "utf8"),
    ).resolves.toContain('"slug": "openai-codex"');
    await expect(
      readFile(path.join(root, "public", "manifests", "architecture-langgraph.json"), "utf8"),
    ).resolves.toContain('"revision": 2');
    await expect(
      readFile(path.join(root, "public", "manifests", "architecture-deepseek-harness.json"), "utf8"),
    ).resolves.toContain('"inspectedVersion": "b150a551b8d465e31e418e1b2eaf5e79bbb7d28e"');
    await expect(
      readFile(
        path.join(root, "public", "manifests", "revision-qm-scoped-resources-and-leased-runs-001.json"),
        "utf8",
      ),
    ).resolves.toContain("d931fe963de3ac20b9a7526ea9a4873c0d8ed18e");
    await expect(
      readFile(
        path.join(root, "public", "manifests", "revision-hermes-integrated-agent-runtime-001.json"),
        "utf8",
      ),
    ).resolves.toContain("sha256-4fce1564f719e726c40175373e32c1ae99bcd6c0f2a066005d38e57d6fb2d4cc");
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

  it("keeps a frozen revision date unchanged when the same source is revalidated", async () => {
    const root = await manifestFixture();
    expect((await generate(root)).code).toBe(0);
    const historicalPath = path.join(
      root,
      "public",
      "manifests",
      "revision-harness-engineering-study-guide-001.json",
    );
    const sourcePath = path.join(
      root,
      "content",
      "sources",
      "source-anthropic-effective-long-running-harnesses.yaml",
    );
    const source = await readFile(sourcePath, "utf8");
    await writeFile(
      sourcePath,
      source.replace("last_validated: 2026-08-25", "last_validated: 2026-08-26"),
    );

    expect((await generate(root)).code).toBe(0);
    const historical = JSON.parse(await readFile(historicalPath, "utf8"));
    expect(historical.sourceValidationDates[
      "source-anthropic-effective-long-running-harnesses"
    ]).toBe("2026-08-22");
    expect(historical.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "source-anthropic-effective-long-running-harnesses",
        lastValidated: "2026-08-22",
      }),
    ]));
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
