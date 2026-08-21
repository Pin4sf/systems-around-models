import { loadClaims, loadContent, loadRevisions, loadSources } from "@/lib/content/load-content";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const validSource = `id: source-valid\ntitle: Valid source\nauthor: Researcher\ncanonical_url: https://example.com/source\npublished_at: 2026-08-20\nretrieved_at: 2026-08-21\ninspected_paths: []\nsource_type: first-party-essay\nlicense_status: unknown\nevidence_grade: FD\nobserved_mechanisms: []\nauthor_reported_claims: []\nunknowns:\n  - The source has an explicit unknown.\nfalsifiers:\n  - A correction changes this source record.\nlast_validated: 2026-08-21\ncorrection_ledger_status: reviewed\n`;

const validClaim = `id: claim-valid\nstatement: A sufficiently long public claim statement for validation.\nlabel: inferred\nscope: general\nsource_ids:\n  - source-valid\nfalsifiers:\n  - A counterexample invalidates the claim in scope.\nlast_reviewed: 2026-08-21\nrevision: 1\n`;

const validRevision = `id: revision-valid\ntarget_slug: valid-essay\nrevision: 1\npublished_at: 2026-08-21\nsubstantively_revised_at: 2026-08-21\nsummary: A sufficiently long revision summary for validation.\naffected_claim_ids:\n  - claim-valid\ncorrection_disposition: publication\n`;

const validEssay = `---\nslug: valid-essay\ntitle: A Valid Essay\ndescription: A sufficiently long essay description for validation.\nsequence: Harness Engineering\nsequence_position: 1\nauthors:\n  - Researcher\npublished_at: 2026-08-21\nsubstantively_revised_at: 2026-08-21\nreading_time_source: manual estimate\nstatus: public\nsource_manifest_ids:\n  - source-valid\nrevision_id: revision-valid\n---\n\nPublic essay body.\n`;

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
});
