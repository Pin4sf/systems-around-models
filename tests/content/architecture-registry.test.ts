import { loadArchitectures, loadLessons } from "@/lib/content/load-content";

describe("architecture study registry", () => {
  it("loads a shared, source-backed comparison cohort", async () => {
    const architectures = await loadArchitectures();
    const publicSystems = [...architectures.values()].filter(
      (record) => record.status === "public" && record.recordKind === "system",
    );

    expect(architectures.get("architecture-baseline-harness")).toMatchObject({
      recordKind: "synthetic-baseline",
      status: "public",
      evidenceGrade: undefined,
    });
    expect(publicSystems.map((record) => record.name)).toEqual(
      expect.arrayContaining([
        "Claude Code",
        "OpenAI Codex",
        "Gemini CLI",
        "OpenHands",
        "LangGraph",
        "Letta",
        "Mem0",
        "Graphiti",
      ]),
    );
    expect(publicSystems).toHaveLength(8);
    publicSystems.forEach((record) => {
      expect(record.sourceIds.length).toBeGreaterThan(0);
      expect(record.topologySteps.length).toBeGreaterThanOrEqual(3);
      expect(record.lifecycleTrace.length).toBeGreaterThanOrEqual(3);
      expect(record.deliberateOmissions.length).toBeGreaterThan(0);
    });
  });

  it("loads the comparison lesson from the same architecture records", async () => {
    const lessons = await loadLessons();
    const lesson = lessons.get("lesson-how-to-compare-agent-systems");

    expect(lesson).toMatchObject({
      slug: "how-to-compare-agent-systems",
      status: "public",
      architectureIds: expect.arrayContaining([
        "architecture-baseline-harness",
        "architecture-openai-codex",
        "architecture-mem0",
      ]),
    });
  });
});
