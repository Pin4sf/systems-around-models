import type { ArchitectureRecord, SourceRecord } from "@/lib/content/schema";

export type ArchitectureStudy = {
  architectureId: string;
  deck: string;
  evidenceBoundary: string;
  systemBoundary: string[];
  mechanismNotes: Array<{ title: string; body: string }>;
  failureBoundary: string[];
  retrievalCheck: string;
  refreshTarget?: string;
};

const studies: ArchitectureStudy[] = [
  {
    architectureId: "architecture-deepseek-harness",
    deck: "A source-pinned study of a concrete coding loop, an event-derived session model, and a plugin runtime designed to make ownership and teardown explicit.",
    evidenceBoundary: "Mechanism claims below are implementation-pinned to DeepSeek Harness 47f943859bef and Cordis 8cc9e33fab69. They are not a production-readiness claim. The newer upstream head remains a named refresh target.",
    systemBoundary: [
      "DeepSeek Harness owns one coding agent's turn and step lifecycle, context assembly, capability dispatch, session facts, and runtime projections.",
      "Cordis owns in-process composition: contexts, services, dependencies, lifecycle fibers, and registered inverse effects.",
      "The developer and surrounding product still own outcome acceptance, production policy, and consequences outside the local runtime.",
    ],
    mechanismNotes: [
      { title: "One reconstructable session record", body: "Normalized session events feed provider requests, trajectories, queries, persistence, and interface views. The useful invariant is not merely that events are logged, but that model-visible history can be derived from them." },
      { title: "Overlap execution, preserve causal commit", body: "Concurrency-safe tool bodies may overlap within bounds. Exclusive calls form barriers, while results and deferred context commit in model order so wall-clock timing does not rewrite durable meaning." },
      { title: "Reversible ownership", body: "Cordis associates registrations and cleanup with lifecycle owners. Unload can unwind those effects in reverse order, making residue testable—without pretending that arbitrary external effects are reversible." },
    ],
    failureBoundary: [
      "A correct inverse is an author obligation; the runtime cannot prove that cleanup restores the intended semantics.",
      "The documented trust model is a developer preview and does not establish multi-tenant or public-network security.",
      "The inspected mechanism pin trails upstream head b150a551b8d465e31e418e1b2eaf5e79bbb7d28e.",
    ],
    retrievalCheck: "Why can the runtime overlap two tool bodies but still commit their durable results in the model's original order? Name the property this preserves, then explain why reversible plugin cleanup does not imply rollback of an external payment.",
    refreshTarget: "Upstream refresh target: DeepSeek Harness b150a551b8d465e31e418e1b2eaf5e79bbb7d28e · package 0.1.1-rc.2",
  },
  {
    architectureId: "architecture-openai-codex",
    deck: "A current, deliberately bounded working study of the open-source local coding agent and the responsibilities its public repository summary does—and does not—establish.",
    evidenceBoundary: "This page is current at the recorded repository pin, but its source inspection is README-level. Unknown internal paths stay unknown rather than inheriting claims from older or adjacent Codex products.",
    systemBoundary: [
      "The inspected official repository presents Codex as a coding agent that runs locally in a developer's terminal and working directory.",
      "Local execution makes workspace identity, sandboxing, approvals, and project checks important harness boundaries, but the current source record does not yet map their complete implementation.",
      "The developer and repository policy remain responsible for review, protected merge, deployment, and product acceptance.",
    ],
    mechanismNotes: [
      { title: "Local work is still governed work", body: "Running on a developer machine does not collapse identity, permission, or acceptance into the model loop. The working directory and admitted task are part of the effective system." },
      { title: "Current does not mean complete", body: "The repository pin and release identity are current, while compaction, resume, multi-agent, capability binding, and effect recovery remain scheduled for path-level inspection." },
      { title: "External checks remain real owners", body: "A coding agent can produce a change and run project commands. CI, code review, protected merge, deployment gates, and the product owner retain distinct closure responsibilities." },
    ],
    failureBoundary: [
      "This working study does not claim a complete internal control, compaction, recovery, or multi-agent architecture.",
      "Local execution alone does not prove least privilege, data custody, or safe external effects.",
      "Project-specific correctness and product acceptance remain outside the inspected repository summary.",
    ],
    retrievalCheck: "A Codex run changes the intended files and reports that tests passed. Which responsibilities remain external? Name at least review, protected merge, deployment admission, and product acceptance—and do not treat local execution as proof of any one of them.",
    refreshTarget: "Deep-inspection backlog: compaction · resume · multi-agent · approvals and sandbox · ambiguous-effect behavior",
  },
];

export function listArchitectureStudies(): ArchitectureStudy[] {
  return [...studies].sort((left, right) => left.architectureId.localeCompare(right.architectureId));
}

export function resolveArchitectureStudy(
  slug: string,
  architectures: Map<string, ArchitectureRecord>,
  sources: Map<string, SourceRecord>,
): { study: ArchitectureStudy; architecture: ArchitectureRecord; sourceRecords: SourceRecord[] } | undefined {
  const architecture = [...architectures.values()].find((record) => record.slug === slug && record.status === "public");
  if (!architecture) return undefined;
  const study = studies.find((candidate) => candidate.architectureId === architecture.id);
  if (!study) return undefined;
  const sourceRecords = architecture.sourceIds.map((sourceId) => {
    const source = sources.get(sourceId);
    if (!source) throw new Error(`Unresolved architecture study source ${sourceId}`);
    return source;
  });
  return { study, architecture, sourceRecords };
}
