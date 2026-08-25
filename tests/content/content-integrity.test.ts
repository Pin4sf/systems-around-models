import { loadClaims, loadContent, loadRevisions, loadSources } from "@/lib/content/load-content";
import { memoryClaimCoverage } from "@/lib/study-guide/memory-claim-coverage";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const validSource = `id: source-valid\ntitle: Valid source\nauthor: Researcher\ncanonical_url: https://example.com/source\npublished_at: 2026-08-20\nretrieved_at: 2026-08-21\ninspected_paths: []\nsource_type: first-party-essay\nbasis: Direct reading of the public source at its canonical URL.\nlicense_status: unknown\nevidence_grade: FD\nobserved_mechanisms: []\nauthor_reported_claims: []\nunknowns:\n  - The source has an explicit unknown.\nfalsifiers:\n  - A correction changes this source record.\nlast_validated: 2026-08-21\ncorrection_ledger_status: reviewed\n`;

const validClaim = `id: claim-valid\nstatement: A sufficiently long public claim statement for validation.\nlabel: inferred\nscope: general\nsource_ids:\n  - source-valid\nfalsifiers:\n  - A counterexample invalidates the claim in scope.\nlast_reviewed: 2026-08-21\nrevision: 1\n`;

const validRevision = `id: revision-valid\ntarget_slug: valid-essay\nrevision: 1\npublished_at: 2026-08-21\nsubstantively_revised_at: 2026-08-21\nsummary: A sufficiently long revision summary for validation.\naffected_claim_ids:\n  - claim-valid\ncorrection_disposition: publication\n`;

const validEssay = `---\nslug: valid-essay\ntitle: A Valid Essay\ndescription: A sufficiently long essay description for validation.\nsequence: Harness Engineering\nsequence_position: 1\nrevision: 1\nauthors:\n  - Researcher\npublished_at: 2026-08-21\nsubstantively_revised_at: 2026-08-21\nreading_time_source: manual estimate\nstatus: public\nsource_manifest_ids:\n  - source-valid\nrevision_id: revision-valid\n---\n\nPublic essay body.\n`;

const validEssayWithRevision = validEssay;

async function fixtureRepository(files: Record<string, string>): Promise<string> {
  const repository = await mkdtemp(path.join(tmpdir(), "systems-around-models-content-"));
  await Promise.all(
    Object.entries(files).map(async ([filename, contents]) => {
      const target = path.join(repository, "content", filename);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, contents);
    }),
  );
  return repository;
}

describe("public content registry", () => {
  it("loads only normalized public evidence labels", async () => {
    const claims = await loadClaims();

    expect(claims.get("claim-harness-capability-configuration")?.label).toBe("inferred");
  });

  it("does not let a publication synthesis attest an observed claim about itself", async () => {
    const [claims, sources] = await Promise.all([loadClaims(), loadSources()]);
    const circularObservedClaims = [...claims.values()].filter((claim) =>
      claim.label === "observed" &&
      claim.sourceIds.every((sourceId) => sources.get(sourceId)?.sourceType === "publication-synthesis"),
    );

    expect(circularObservedClaims).toEqual([]);
    expect(claims.get("claim-ambiguous-effect-failure-pattern")?.label).toBe("proposed");
  });

  it("resolves every claim source and exposes the first revision record", async () => {
    const [claims, sources, revisions] = await Promise.all([
      loadClaims(),
      loadSources(),
      loadRevisions(),
    ]);

    for (const claim of claims.values()) {
      claim.sourceIds.forEach((id) => expect(sources.has(id)).toBe(true));
    }

    expect(revisions.has("revision-fieldbook-essay-001")).toBe(true);
  });

  it("relates Earendil's ownership philosophy to its public source and revision", async () => {
    const [claims, sources, revisions] = await Promise.all([
      loadClaims(),
      loadSources(),
      loadRevisions(),
    ]);
    const statement =
      "Earendil argues that people can own and adapt their agent harness, use its translation layer to choose among model providers, and retain local copies of sessions.";
    const claim = claims.get("claim-earendil-harness-ownership-philosophy");

    expect(claim).toMatchObject({
      statement,
      label: "author-reported",
      sourceIds: ["source-earendil-what-is-a-harness"],
    });
    expect(
      sources.get("source-earendil-what-is-a-harness")?.authorReportedClaims,
    ).toContain(statement);
    expect(
      revisions.get("revision-fieldbook-essay-001")?.affectedClaimIds,
    ).toContain("claim-earendil-harness-ownership-philosophy");
  });

  it("registers every external source named in the public study guide", async () => {
    const content = await loadContent();
    const guide = content.essays.get("harness-engineering-study-guide");
    if (!guide) throw new Error("Expected public Harness Engineering study guide");
    const source = await readFile(
      path.join(process.cwd(), "content/essays/harness/harness-engineering-study-guide.mdx"),
      "utf8",
    );
    const readingSection = source.split("## Sources and next reading")[1] ?? "";
    const namedExternalUrls = [...readingSection.matchAll(/\]\((https?:\/\/[^)]+)\)/g)]
      .map((match) => match[1]);
    const registeredUrls = guide.sourceManifestIds
      .map((sourceId) => content.sources.get(sourceId)?.canonicalUrl)
      .filter((url): url is string => Boolean(url?.startsWith("http")));

    expect(namedExternalUrls).toHaveLength(17);
    expect(registeredUrls).toEqual(expect.arrayContaining(namedExternalUrls));
  });

  it("registers every visible source family for the Memory Engineering guide", async () => {
    const content = await loadContent();
    const guide = content.essays.get("memory-engineering-study-guide");
    if (!guide) throw new Error("Expected public Memory Engineering study guide");
    const source = await readFile(
      path.join(process.cwd(), "content/essays/memory/memory-engineering-study-guide.mdx"),
      "utf8",
    );
    const readingSection = source.split("## Sources and next reading")[1] ?? "";
    const namedExternalUrls = [...readingSection.matchAll(/\]\((https?:\/\/[^)]+)\)/g)]
      .map((match) => match[1]);
    const registeredUrls = guide.sourceManifestIds
      .map((sourceId) => content.sources.get(sourceId)?.canonicalUrl)
      .filter((url): url is string => Boolean(url?.startsWith("http")));

    expect(namedExternalUrls).toHaveLength(9);
    expect(registeredUrls).toEqual(expect.arrayContaining(namedExternalUrls));
  });

  it("preserves the canonical ACL author order for the LoCoMo source record", async () => {
    const sources = await loadSources();

    expect(sources.get("source-memory-locomo")?.author).toBe(
      "Adyasha Maharana, Dong-Ho Lee, Sergey Tulyakov, Mohit Bansal, Francesco Barbieri, and Yuwei Fang",
    );
  });

  it("pins the context-database versus memory-engine boundary in Chapter 11", async () => {
    const [content, source] = await Promise.all([
      loadContent(),
      readFile(
        path.join(process.cwd(), "content/essays/harness/memory-compaction-and-continuity.mdx"),
        "utf8",
      ),
    ]);
    const essay = content.essays.get("memory-compaction-and-continuity");
    const revision = content.revisions.get("revision-memory-compaction-continuity-002");
    const openViking = content.sources.get("source-openviking-context-database");
    const agentMemory = content.sources.get("source-agentmemory-runtime");

    expect(essay).toMatchObject({
      revision: 2,
      revisionId: "revision-memory-compaction-continuity-002",
      sourceManifestIds: expect.arrayContaining([
        "source-openviking-context-database",
        "source-agentmemory-runtime",
      ]),
    });
    expect(revision?.summary).toContain("context-database-versus-memory-engine");
    expect(source).toContain("## Context database versus memory engine");
    expect(source).toContain("A scope filter is not identity proof");
    expect(openViking).toMatchObject({
      evidenceGrade: "IP",
      inspectedPaths: expect.arrayContaining([
        "docs/en/concepts/03-context-layers.md",
        "docs/en/concepts/11-multi-tenant.md",
        "openviking/retrieve/context_assembler/pipeline.py",
      ]),
    });
    expect(agentMemory).toMatchObject({
      evidenceGrade: "IP",
      inspectedPaths: expect.arrayContaining([
        "src/hooks/_project.ts",
        "src/functions/search.ts",
        "src/state/hybrid-search.ts",
        "src/mcp/tools-registry.ts",
        "src/hooks/session-start.ts",
      ]),
    });
    expect(source).toContain("common MCP `memory_recall` tool does not expose or forward project");
  });

  it("covers the central Memory Engineering claims with source-backed revision records", async () => {
    const [content, source] = await Promise.all([
      loadContent(),
      readFile(
        path.join(process.cwd(), "content/essays/memory/memory-engineering-study-guide.mdx"),
        "utf8",
      ),
    ]);
    const revision = content.revisions.get("revision-memory-engineering-study-guide-001");

    expect(memoryClaimCoverage).toEqual([
      {
        claimId: "claim-memory-function-before-database",
        heading: "2. Choose the memory function before the database",
        sourceIds: [
          "source-memory-memgpt",
          "source-memory-anthropic-context-engineering",
        ],
      },
      {
        claimId: "claim-memory-capture-not-belief",
        heading: "4. Capture is not belief",
        sourceIds: [
          "source-memory-memgpt",
          "source-memory-owasp-memory-attack-surface",
        ],
      },
      {
        claimId: "claim-memory-decision-scoped-retrieval",
        heading: "5. Retrieve for a decision, not merely for similarity",
        sourceIds: [
          "source-memory-anthropic-context-engineering",
          "source-memory-longmemeval",
        ],
      },
    ]);
    for (const coverage of memoryClaimCoverage) {
      const claim = content.claims.get(coverage.claimId);
      expect(claim).toMatchObject({
        label: "proposed",
        scope: "Memory Engineering study guide",
        sourceIds: coverage.sourceIds,
      });
      expect(revision?.affectedClaimIds).toContain(coverage.claimId);
      expect(source).toContain(`## ${coverage.heading}`);
    }
  });

  it("marks the superseded Memory-future design amendment without obscuring its history", async () => {
    const design = await readFile(
      path.join(process.cwd(), "docs/design/2026-08-21-reading-portal-design.md"),
      "utf8",
    );

    expect(design).not.toMatch(/Memory Engineering and gallery work remain future\s+projects\./i);
    expect(design).toMatch(/Superseded.*Harness-only[\s\S]*complete Memory Engineering short guide/i);
  });

  it("names malformed public fixtures when validation rejects them", async () => {
    const repository = await fixtureRepository({
      "claims/invalid-label.yaml": validClaim.replace("label: inferred", "label: private"),
      "sources/source-valid.yaml": validSource,
      "revisions/revision-valid.yaml": "id: revision-valid\ntarget_slug: valid\nrevision: 1\npublished_at: 2026-08-21\nsubstantively_revised_at: 2026-08-21\nsummary: A sufficiently long revision summary for validation.\naffected_claim_ids:\n  - claim-valid\ncorrection_disposition: publication\n",
    });

    await expect(loadClaims(repository)).rejects.toThrow("content/claims/invalid-label.yaml");
    await rm(repository, { recursive: true, force: true });
  });

  it("names the actual claim file when a source reference is unresolved", async () => {
    const repository = await fixtureRepository({
      "claims/named-claim.yaml": validClaim.replace("source-valid", "source-missing"),
      "sources/.keep": "",
      "revisions/.keep": "",
    });

    await expect(loadClaims(repository)).rejects.toThrow("content/claims/named-claim.yaml");
    await rm(repository, { recursive: true, force: true });
  });

  it("rejects a revision target that does not resolve to an essay", async () => {
    const repository = await fixtureRepository({
      "claims/claim-valid.yaml": validClaim,
      "sources/source-valid.yaml": validSource,
      "revisions/revision-valid.yaml": validRevision.replace("valid-essay", "missing-essay"),
      "essays/harness/valid-essay.mdx": validEssay,
    });

    await expect(loadContent(repository)).rejects.toThrow("content/revisions/revision-valid.yaml");
    await rm(repository, { recursive: true, force: true });
  });

  it("rejects an essay source manifest identifier that does not resolve", async () => {
    const repository = await fixtureRepository({
      "claims/claim-valid.yaml": validClaim,
      "sources/source-valid.yaml": validSource,
      "revisions/revision-valid.yaml": validRevision,
      "essays/harness/valid-essay.mdx": validEssay.replace("source-valid", "source-missing"),
    });

    await expect(loadContent(repository)).rejects.toThrow("content/essays/harness/valid-essay.mdx");
    await rm(repository, { recursive: true, force: true });
  });

  it("rejects an essay revision identifier that does not resolve", async () => {
    const repository = await fixtureRepository({
      "claims/claim-valid.yaml": validClaim,
      "sources/source-valid.yaml": validSource,
      "revisions/revision-valid.yaml": validRevision,
      "essays/harness/valid-essay.mdx": validEssay.replace("revision-valid", "revision-missing"),
    });

    await expect(loadContent(repository)).rejects.toThrow("content/essays/harness/valid-essay.mdx");
    await rm(repository, { recursive: true, force: true });
  });

  it("rejects a revision record attached to a different essay", async () => {
    const repository = await fixtureRepository({
      "claims/claim-valid.yaml": validClaim,
      "sources/source-valid.yaml": validSource,
      "revisions/revision-valid.yaml": validRevision.replace("valid-essay", "other-essay"),
      "essays/harness/valid-essay.mdx": validEssayWithRevision,
      "essays/harness/other-essay.mdx": validEssayWithRevision
        .replaceAll("valid-essay", "other-essay")
        .replace("sequence_position: 1", "sequence_position: 2"),
    });

    await expect(loadContent(repository)).rejects.toThrow(/revision-valid.*other-essay|different essay/i);
    await rm(repository, { recursive: true, force: true });
  });

  it.each([
    ["publication date", "published_at: 2026-08-21", "published_at: 2026-08-20"],
    [
      "substantive revision date",
      "substantively_revised_at: 2026-08-21",
      "substantively_revised_at: 2026-08-20",
    ],
    ["revision number", "revision: 1", "revision: 2"],
  ])("rejects an essay and revision %s mismatch", async (_name, before, after) => {
    const repository = await fixtureRepository({
      "claims/claim-valid.yaml": validClaim,
      "sources/source-valid.yaml": validSource,
      "revisions/revision-valid.yaml": validRevision,
      "essays/harness/valid-essay.mdx": validEssayWithRevision.replace(before, after),
    });

    await expect(loadContent(repository)).rejects.toThrow(/does not agree|mismatch/i);
    await rm(repository, { recursive: true, force: true });
  });

  it("rejects unresolved or non-reciprocal public sequence neighbors", async () => {
    const repository = await fixtureRepository({
      "claims/claim-valid.yaml": validClaim,
      "sources/source-valid.yaml": validSource,
      "revisions/revision-valid.yaml": validRevision,
      "essays/harness/valid-essay.mdx": validEssayWithRevision.replace(
        "revision_id: revision-valid",
        "revision_id: revision-valid\nnext_essay_slug: missing-essay",
      ),
    });

    await expect(loadContent(repository)).rejects.toThrow(/next essay|sequence/i);
    await rm(repository, { recursive: true, force: true });
  });

  it("rejects duplicate heading anchors and broken internal fragments", async () => {
    const duplicateRepository = await fixtureRepository({
      "claims/claim-valid.yaml": validClaim,
      "sources/source-valid.yaml": validSource,
      "revisions/revision-valid.yaml": validRevision,
      "essays/harness/valid-essay.mdx": `${validEssayWithRevision}\n## Same heading\n\n## Same heading\n`,
    });
    const brokenLinkRepository = await fixtureRepository({
      "claims/claim-valid.yaml": validClaim,
      "sources/source-valid.yaml": validSource,
      "revisions/revision-valid.yaml": validRevision,
      "essays/harness/valid-essay.mdx": `${validEssayWithRevision}\n[Missing section](#not-here)\n`,
    });

    await expect(loadContent(duplicateRepository)).rejects.toThrow(/duplicate.*anchor/i);
    await expect(loadContent(brokenLinkRepository)).rejects.toThrow(/unresolved.*#not-here/i);
    await Promise.all([
      rm(duplicateRepository, { recursive: true, force: true }),
      rm(brokenLinkRepository, { recursive: true, force: true }),
    ]);
  });

  it("accepts reciprocal sequence links and resolvable route fragments", async () => {
    const secondRevision = validRevision
      .replaceAll("revision-valid", "revision-second")
      .replace("valid-essay", "second-essay");
    const firstEssay = `${validEssayWithRevision.replace(
      "revision_id: revision-valid",
      "revision_id: revision-valid\nnext_essay_slug: second-essay",
    )}\n## First section\n\n[Second](/fieldbook/second-essay#second-section)\n\n[Architectures](/architectures)\n`;
    const secondEssay = `${validEssayWithRevision
      .replaceAll("valid-essay", "second-essay")
      .replace("sequence_position: 1", "sequence_position: 2")
      .replace("revision_id: revision-valid", "revision_id: revision-second\nprevious_essay_slug: valid-essay")}\n## Second section\n\n[First](/fieldbook/valid-essay#first-section)\n`;
    const repository = await fixtureRepository({
      "claims/claim-valid.yaml": validClaim,
      "sources/source-valid.yaml": validSource,
      "revisions/revision-valid.yaml": validRevision,
      "revisions/revision-second.yaml": secondRevision,
      "essays/harness/valid-essay.mdx": firstEssay,
      "essays/harness/second-essay.mdx": secondEssay,
    });

    await expect(loadContent(repository)).resolves.toBeDefined();
    await rm(repository, { recursive: true, force: true });
  });
});
