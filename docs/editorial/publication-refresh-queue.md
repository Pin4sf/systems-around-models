# Publication refresh queue

Last updated: 2026-08-23

This is the maintained operational list for material that can ship from current evidence and material that still needs source work. Readiness describes the publication record, not the quality or maturity of the named system.

## In the current build

| Artifact | Public state | Evidence boundary | Next update |
|---|---|---|---|
| Harness Chapters 2–16 | Released | Original clean-room chapters grounded in the source manifests named in each article | Review corrections and reader feedback before revision 2; edit Chapters 17–20 as the next curriculum batch |
| OpenAI Codex architecture study | Released working study | Current official pin `343074d4207d572809bd8cea15f4be1d09d98e0b`; README-level inspection | Inspect app-server, thread/session state, compaction, sandbox and approvals, interruption, recovery, and review paths |
| DeepSeek Harness and Cordis architecture study | Released, refresh due | Mechanisms pinned to Harness `47f943859bef60e4160492346772ded9b24f765a` and Cordis `8cc9e33fab69e2d0476d126baaf2acb24e6a6ab4` | Reinspect changed paths at Harness `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e` and package `0.1.1-rc.2` |

## Next research queue

1. Refresh DeepSeek Harness at the named current head while retaining Cordis proof limits and release-provenance unknowns.
2. Expand Codex from a current working study into an implementation-pinned dossier; do not upgrade its evidence label before the source paths are inspected.
3. Build the LangGraph dossier, keeping the Python library, checkpoint packages, SDK, and hosted platform as separate editions and responsibility boundaries.
4. Refresh Claude Code only from official sources; leaked or reconstructed internals remain discovery input, not publication evidence.
5. Refresh the memory-system cohort in this order: Mem0 edition split, Cognee convergence correction, Letta/MemGPT/Letta Code boundaries, then Graphiti/Zep.

## Mandatory correction gate

- Hermes did not originate Dreaming Mode or the five-tier memory taxonomy.
- OpenClaw Active Memory has two tools; do not carry over the Git profile, Watcher, or `context_version` misattributions.
- Cognee convergence detection is absent from the inspected implementation.
- Mem0 v2 paper claims must not describe current SDK behavior.
- OpenHarness has four compaction stages; PTL retry is inside stage four.
- Secondary or leaked Claude Code internals cannot support implementation claims.

## Release rule

Every architecture page must retain an inspected version, evidence boundary, source list, normalized topology, failure boundary, retrieval check, and explicit refresh target when its deep mechanism pin trails upstream. A current repository head alone is not a full dossier.
