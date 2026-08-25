# Publication refresh queue

Last updated: 2026-08-26

This is the maintained operational list for material that can ship from current evidence and material that still needs source work. Readiness describes the publication record, not the quality or maturity of the named system.

## In the current build

| Artifact | Public state | Evidence boundary | Next update |
|---|---|---|---|
| Harness Chapters 1–28 | Released | Clean-room chapters grounded in the release-pinned source manifests named in each article | Review corrections and reader feedback before revision 2; edit Chapters 29–32 as the next curriculum batch |
| OpenAI Codex architecture study | Released working study | Current official pin `343074d4207d572809bd8cea15f4be1d09d98e0b`; README-level inspection | Inspect app-server, thread/session state, compaction, sandbox and approvals, interruption, recovery, and review paths |
| DeepSeek Harness and Cordis architecture study | Released, refreshed | Mechanisms pinned to Harness `dsh-v0.1.1-rc.2` at `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e`, vendored `@deepseek-ai/cordis` `4.0.1`, and standalone Cordis `8cc9e33fab69e2d0476d126baaf2acb24e6a6ab4` | Recheck the developer-preview line when a newer package or tag appears; retain the cleanup and external-effect proof limits |

## Next research queue

1. Expand Codex from a current working study into an implementation-pinned dossier; do not upgrade its evidence label before the source paths are inspected.
2. Extend the LangGraph architecture dossier beyond the inspected Python 1.2.9 core, keeping checkpoint packages, SDK, and hosted platform as separate editions and responsibility boundaries.
3. Refresh Claude Code only from official sources; leaked or reconstructed internals remain discovery input, not publication evidence.
4. Refresh the memory-system cohort in this order: Mem0 edition split, Cognee convergence correction, Letta/MemGPT/Letta Code boundaries, then Graphiti/Zep.

## Mandatory correction gate

- Hermes did not originate Dreaming Mode or the five-tier memory taxonomy.
- OpenClaw Active Memory has two tools; do not carry over the Git profile, Watcher, or `context_version` misattributions.
- Cognee convergence detection is absent from the inspected implementation.
- Mem0 v2 paper claims must not describe current SDK behavior.
- OpenHarness has four compaction stages; PTL retry is inside stage four.
- Secondary or leaked Claude Code internals cannot support implementation claims.

## Release rule

Every architecture page must retain an inspected version, evidence boundary, source list, normalized topology, failure boundary, retrieval check, and explicit refresh target when its deep mechanism pin trails upstream. A current repository head alone is not a full dossier.
