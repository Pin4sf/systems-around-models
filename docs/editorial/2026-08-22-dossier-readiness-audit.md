# Dossier readiness audit

Date: 2026-08-22

Status: editorial planning record; not reader-facing content

Scope: 344 files across the private repository, research, ADL, blog, and paper collections, plus the Harness and Memory manuscripts

## Decision

The corpus is deep enough to sustain a fieldbook, but it is not uniformly ready for clean-room publication. The strongest existing implementation-pinned dossiers are DeepSeek Harness/Cordis, Cloudflare OS, QM, OpenBase Coder, Omi, Osaurus, Drover, Paperclip, Webhound, and several focused mechanism cases. The highest-interest public candidates—OpenAI Codex, Claude Code, Gemini CLI, OpenHands, and LangGraph—still need either a new official-source deep dive or a material refresh before they become long-form architecture pages.

The existing `/architectures` records remain truthful as working profiles. They must not be relabeled as full dossiers merely because they have current commit pins.

## Method and status vocabulary

Every plausible system was checked for topology, full lifecycle, state or memory, authority or effects, recovery or verification, evidence fidelity, version/license status, and known corrections. Coverage uses `H/M/L/–` for high, partial, mention-only, or absent.

- `ready`: the existing dossier has enough shape and primary evidence for clean-room editing after a publication-time re-pin.
- `refresh`: the dossier is deep, but its version, license, correction ledger, or current product boundary must be refreshed first.
- `new deep dive`: the corpus does not yet support a long-form architecture page.
- `teaching-only`: useful for a mechanism, pattern, or caution, but not as an implementation-comparable flagship.

“Ready” is not a current-production claim. Every named system must still be re-pinned on the day its public artifact is edited.

## Current primary-source validation

These checks were run against official repositories and documentation on 2026-08-22. A repository head is a dated evidence boundary, not a stability or quality judgment.

| System | Current official boundary | License observed | Readiness consequence |
|---|---|---|---|
| OpenAI Codex | [`343074d`](https://github.com/openai/codex/commit/343074d4207d572809bd8cea15f4be1d09d98e0b), release `rust-v0.149.0` | Apache-2.0 | Public working-profile pin is current; a full dossier still needs source-path inspection beyond the README. |
| LangGraph | [`f09cfe8`](https://github.com/langchain-ai/langgraph/commit/f09cfe8ffc1eeffd68f4b628ed69c30f7cad229f), Python `1.2.11`; latest repository release is SDK `0.4.3` | MIT | Record exact library edition separately from SDK and hosted-platform editions; new implementation deep dive required. |
| Claude Code | [`5cfc0a1`](https://github.com/anthropics/claude-code/commit/5cfc0a1905ce0c0a9bd81d8a90fe6b62ff614357), release `v2.1.240` | No SPDX license detected | Official-source refresh required; leaked or reconstructed internals may not support public implementation claims. |
| Pi | Repository transferred from `badlogic/pi-mono` to [`earendil-works/pi`](https://github.com/earendil-works/pi); [`c49906e`](https://github.com/earendil-works/pi/commit/c49906ec77788625aacbdc53ebca6fbe65bd20f5), `0.84.2` | MIT | The existing deep dossier is reusable only after repository identity and current behavior are refreshed. |
| Hermes Agent | [`999703f`](https://github.com/NousResearch/hermes-agent/commit/999703fd43ab6d75c4a5c7bc8b610dd73ecece76), package `0.20.5`, release line `v2026.8.19` | MIT | Large drift from the v0.13 dossier; correction-ledger and source refresh required. |
| Cloudflare Think | [`cloudflare/agents@a0e134b`](https://github.com/cloudflare/agents/commit/a0e134bbc327fc8a519b5aa66cb8ce4038815d05), `@cloudflare/think` `0.16.0`; official docs updated 2026-08-20 | MIT | Real package and implementation exist, but `runTurn()` and Think remain experimental; refresh as a bounded preview runtime. |
| DeepSeek Harness / Cordis | Harness [`b150a55`](https://github.com/deepseek-ai/deepseek-harness/commit/b150a551b8d465e31e418e1b2eaf5e79bbb7d28e), package `0.1.1-rc.2`; Cordis remains [`8cc9e33`](https://github.com/cordiverse/cordis/commit/8cc9e33fab69e2d0476d126baaf2acb24e6a6ab4) | MIT | Existing implementation-pinned dossier is structurally ready; refresh release provenance and changed paths. |
| Drover | [`e4b1a04`](https://github.com/arniesaha/drover/commit/e4b1a04a78251202e5d4cbf348e7d700449ab628), `0.3.7` | Apache-2.0 | The previously missing license is resolved; refresh from v0.3.2 before reuse. |
| OpenClaw | [`6917a15`](https://github.com/openclaw/openclaw/commit/6917a15bce84169528cb047cc3933ee3bff9f2e0), package `2026.8.1` | GitHub reports `NOASSERTION` | Do not repeat the private dossier's MIT label until the exact applicable license is adjudicated. |
| OpenHarness | [`9b2efd7`](https://github.com/HKUDS/OpenHarness/commit/9b2efd795c6aa09f88b0c257d269a9e518da6ae7), `0.1.9` | MIT | Version is stable relative to the dossier, but the four-stage compaction correction is mandatory. |
| OpenHands | Repository now resolves to [`OpenHands/OpenHands`](https://github.com/OpenHands/OpenHands); [`35331e7`](https://github.com/OpenHands/OpenHands/commit/35331e795bae37f426b23cad6671bb22ec4b5f27), `v1.15.0` | MIT | New deep dive required; do not infer current architecture from the older landscape notes. |
| Gemini CLI | [`5411f11`](https://github.com/google-gemini/gemini-cli/commit/5411f113cafae26161b4969b0237b8e1e024e2c2), `v0.56.0` | Apache-2.0 | New deep dive required. |
| Google ADK | [`d9f4d3d`](https://github.com/google/adk-python/commit/d9f4d3d288257593471fc708a9ab851779005ca5), `v2.7.1` | Apache-2.0 | Existing mechanism note is deep enough to route research, not publish; refresh implementation card. |
| OpenAI Agents SDK | Python [`7f7a44f`](https://github.com/openai/openai-agents-python/commit/7f7a44f8dc0650296bd5ab6c745c9bcbaa6ac3b7), `v0.22.0`; TypeScript [`6d0c61a`](https://github.com/openai/openai-agents-js/commit/6d0c61a5f62a5ed8142996a25b33446c810f84b3), `v0.17.0` | MIT | Editions must be treated separately; new deep dive required. |
| Microsoft Agent Framework | [`d9d3fb6`](https://github.com/microsoft/agent-framework/commit/d9d3fb6252f7ae9e7f8104edce7266f0782a813c), Python `1.15.0`, latest .NET release `1.19.0` | MIT | New edition-specific deep dive required. |
| CrewAI | [`f4731f5`](https://github.com/crewAIInc/crewAI/commit/f4731f5025f861c78e3af0487cc80bf5e7c64782), `1.15.17` | MIT | Complete corpus gap; new deep dive required before any comparison row. |
| Letta Code | [`d292d99`](https://github.com/letta-ai/letta-code/commit/d292d991818aa0c9eaa68659988ef5bab6c9d351), `v0.30.29` | Apache-2.0 | Refresh the v0.30.23 manuscript snapshot and keep Letta server, Letta Code, and MemGPT paper boundaries distinct. |
| Mem0 | [`8d5b786`](https://github.com/mem0ai/mem0/commit/8d5b7865bd0521e75fe9ab1b260eeccc83f8a378), Python `2.0.18`, latest TS release `3.1.6` | Apache-2.0 | Refresh and keep v2 paper, current Python algorithm, TypeScript SDK, OSS, and managed product claims separate. |
| Graphiti | [`993e081`](https://github.com/getzep/graphiti/commit/993e081a6d7948a0d8851c12a5fbdbeb49fed862), `0.29.3` | Apache-2.0 | Release matches the manuscript; re-pin head and retain Graphiti/Zep boundary. |
| LangMem | [`29cbe41`](https://github.com/langchain-ai/langmem/commit/29cbe41e58528f92e9efa773c12e15c47be3808c), `0.0.30`, no GitHub release | MIT | Current manuscript pin is exact; expand sparse lifecycle/authority/recovery coverage before a deep dive. |
| Cognee | [`a8f9760`](https://github.com/topoteretes/cognee/commit/a8f9760bb6da90a9956b3be77c0d0534134f533a), `1.5.2` | Apache-2.0 | Refresh from 1.5.0 and remove the false convergence mechanism before reuse. |
| MemOS | [`be68e2f`](https://github.com/MemTensor/MemOS/commit/be68e2fb5370866bd5e2b188bb3d22bd13b49e09), source `2.0.31`, latest release `2.0.30` | Apache-2.0 | Preserve source-versus-release drift and the unimplemented parametric-memory boundary. |
| Hindsight | [`da9a588`](https://github.com/vectorize-io/hindsight/commit/da9a588c78296527268ed492fc2cc2c687ab8118), `0.9.1` | MIT | Material drift from the v0.6.1 dossier; full refresh required. |
| OpenViking | [`6e944cc`](https://github.com/volcengine/OpenViking/commit/6e944cc3e14872ec7e7a80edec9265397f367894), `v0.4.16` | AGPL-3.0 | Refresh from the v0.4.5-era scan; keep code-reuse constraints explicit. |

## Complete candidate inventory

Source keys below are relative editorial pointers into the private corpus. They are discovery inputs, not public-build dependencies.

### Flagship harnesses and runtimes

| Candidate | Source key(s) | Category | Pin/license state in dossier | T/L/S/A/RV | Correction or fidelity boundary | Readiness | Recommended artifact |
|---|---|---|---|---|---|---|---|
| OpenAI Codex | `research/kennel-mcp-agent-intelligence-benchmark-2026-07-20.md`; Harness atlas | Coding harness | July pin; current public repo now pinned | H/H/M/H/H | Strong protocol material, no single full lifecycle dossier | new deep dive | Full deep dive; comparison row |
| Claude Code | `repos/claude-code-internals.md`; `repos/dive-into-claude-code.md`; Anthropic article | Coding harness | Official product pin exists; applicable license unresolved | M/M/M/M/M | Leaked/reconstructed sources are teaching input only | new deep dive | Official-source deep dive after regrounding |
| Gemini CLI | Harness atlas; `blogs/google-agent-skills-repository.md` | Coding harness | Current repo/license now known | M/M/–/M/M | Landscape evidence only | new deep dive | Full deep dive |
| OpenCode | Harness atlas; AHE paper | Coding harness | Current repo/license now known | M/–/–/–/– | Benchmark mention is not an architecture dossier | new deep dive | Full deep dive or defer |
| OpenHands | Harness atlas; `ADL/agent-fs-alternatives-2026.md` | Coding harness | Current repo/license now known | M/M/–/M/M | Landscape synthesis only | new deep dive | Full deep dive |
| Pi | `repos/pi-mono.md`; `research/qm-hermes-pi-cloudflare-agent-harness-benchmark-convergence-2026-08-01.md` | Thin agent runtime | Old identity/pin; MIT | H/H/H/H/M | Repository transfer and version drift | refresh | Full deep dive |
| Hermes Agent | `repos/hermes-agent.md`; Hermes ADL dossiers; convergence synthesis | Personal runtime | v0.13, no commit; MIT | H/H/H/H/M | Apply Hermes attribution corrections; large version drift | refresh | Full deep dive |
| OpenClaw | `repos/openclaw.md`; convergence synthesis | Personal runtime | May snapshot; dossier says MIT | H/H/H/H/M | Multiple misattributions corrected; current license unresolved | refresh | Full deep dive |
| OpenHarness / Ohmo | `repos/openharness.md`; correction ledger | Coding/personal runtime | v0.1.9, MIT | H/H/H/M/H | Four stages, not five; derivative claims need source/license care | refresh | Compaction/runtime deep dive |
| DeepSeek Harness / Cordis | `repos/deepseek-harness.md`; `research/drover-deepseek-harness-product-engineering-dissection-2026-08-16.md` | Composable coding runtime | Commit-pinned; MIT | H/H/H/H/H | Release provenance remains unresolved | ready | Full deep dive |
| Cloudflare Think | `repos/project-think.md`; convergence synthesis | Durable server runtime | Earlier package pin; current source MIT | H/H/H/H/H | Experimental API and default-authority boundaries | refresh | Full bounded deep dive |
| Cloudflare OS v2 | `repos/cloudflare-os.md` | Agent substrate | Commit-pinned; Apache-2.0 | H/H/H/H/M | Early access; production recovery unknown | ready | Full deep dive |
| QM | `repos/qm.md`; convergence synthesis | Governed resource runtime | v0.1.4 commit-pinned; MIT | H/H/H/H/H | Operational deployment remains unverified | ready | Full deep dive |
| LangGraph | LangChain ADL/blog dossiers; Harness atlas | Workflow graph | Current repo/version/license now known | M/M/M/M/M | OSS library, SDK, and hosted platform must remain separate | new deep dive | Full deep dive |
| Google ADK | `repos/google-adk.md`; ecosystem synthesis | Workflow/multi-agent SDK | Unpinned older note; Apache-2.0 | H/H/H/H/M | Exact edition and implementation card absent | refresh | Full deep dive |
| OpenAI Agents SDK | `repos/openai-agents-sdk.md`; ecosystem synthesis | Multi-agent SDK | No dossier pin; current Python/TS editions known | M/M/M/M/M | Python and TypeScript feature parity must be proven, not assumed | new deep dive | Full deep dive or comparison row |
| Claude Agent SDK | `repos/claude-agent-sdk.md`; ecosystem synthesis | Agent SDK | No pin/version/license card | M/M/M/H/M | Official repositories only for public claims | new deep dive | Comparison row after research |
| Microsoft Agent Framework | `repos/microsoft-agent-framework.md`; ecosystem synthesis | Workflow SDK | Old unpinned note; current editions known | M/H/M/M/H | Python/.NET edition split | new deep dive | Comparison row or deep dive |
| CrewAI | No substantive corpus source | Role-based workflow SDK | Current repo/license known externally | –/–/–/–/– | Complete corpus gap | new deep dive | Defer until sourced |
| OpenBase Coder | `repos/openbase-coder.md` | Cross-provider controller | v0.27 commit-pinned; AGPL runtime/MIT dependency | H/H/H/H/H | Public/private execution boundary explicit | ready | Full deep dive |
| Osaurus | `repos/osaurus-ai-osaurus.md`; research dissection | Local model/runtime | Commit-pinned; MIT | H/H/H/H/M | Live providers and full runtime suite unverified | ready | Full deep dive |
| Goose | `repos/block-goose.md` | General coding agent | Unpinned; Apache-2.0 | M/M/M/M/L | Dated README treatment | refresh | Deep dive after source inspection |
| Swarms | `repos/swarms.md` | Multi-agent framework | v12 note; Apache-2.0 | H/H/H/M/M | Secondary/founder claims require pruning | refresh | Comparison or deep dive |
| OpenFang | `repos/openfang.md`; ecosystem synthesis | Agent runtime | No reproducible source card | H/H/M/H/M | Architecture claims lack a pin | refresh | Deep dive only after grounding |
| NemoClaw | `repos/nemoclaw.md` | Hardened runtime | Alpha; Apache-2.0 | M/M/M/H/L | Preview boundary | new deep dive | Security/runtime mechanism |

### Memory systems

| Candidate | Source key(s) | Category | Pin/license state in dossier | T/L/S/A/RV | Correction or fidelity boundary | Readiness | Recommended artifact |
|---|---|---|---|---|---|---|---|
| Letta / MemGPT / Letta Code | `repos/letta-memgpt.md`; Memory manuscript | Stateful agent memory | v0.16-era deep note; Apache-2.0 | H/H/H/M/M | Separate paper, legacy server, active server, and Code product | refresh | Memory deep dive |
| Mem0 | `repos/mem0.md`; Memory manuscript | Memory service/SDK | Deep but unpinned; Apache-2.0 | H/H/H/M/M | v2 paper must not describe current v3/Python behavior | refresh | Versioned memory deep dive |
| Graphiti / Zep | `repos/zep-graphiti.md`; Graphiti ADL note; Memory manuscript | Temporal graph memory | v0.29.2/3-era; Apache-2.0 | M/H/H/M/M | OSS engine and managed product differ | refresh | Memory deep dive |
| LangMem | Memory manuscript; intelligence benchmark | LangGraph memory toolkit | Exact current pin; MIT | M/M/H/M/M | Sparse lifecycle, authority, deletion, and recovery coverage | new deep dive | Memory case after research |
| Cognee | Cognee ADL dossier; Memory manuscript | Hybrid graph/vector memory | v1.5.0-era; current Apache-2.0 | H/H/H/M/M | Claimed convergence detection is false in inspected code | refresh | Corrected memory deep dive |
| MemOS | `repos/memory-os.md` is a different project; Memory manuscript has MemOS profile | Memory operating system | Current upstream version now known | M/M/H/M/M | Parametric memory is partly aspirational; source/release drift | refresh | New dedicated memory dossier |
| Hindsight / TEMPR | `repos/hindsight.md`; May digest; benchmark dossier | Reflective memory | v0.6.1; MIT | M/H/H/M/H | Correct entity-resolution weights; large current drift | refresh | Memory deep dive |
| OpenViking | `repos/openviking.md`; ecosystem synthesis | Context database | v0.4.5-era; AGPL-3.0 | H/M/H/M/M | Tag/unreleased boundaries and reuse constraints | refresh | Focused memory deep dive |
| GBrain | `repos/gbrain.md`; May digest | File/wiki memory | Short May pin; MIT | H/H/H/M/M | Re-pin and validate algorithms | refresh | Memory case |
| Basic Memory | intelligence benchmark | Local file memory | Old commit; AGPL-3.0 | M/H/H/M/H | Code reuse legally constrained | refresh | Mechanism lesson |
| Honcho | `repos/honcho.md`; ecosystem synthesis | User-model memory | Unpinned; AGPL-3.0 | M/M/H/M/L | Synthesis only | new deep dive | Memory case or defer |
| Memori | `repos/memori.md`; ecosystem synthesis | Agent memory | No pin; Apache-2.0 | L/L/M/L/L | Shallow | new deep dive | Defer |
| MemPalace | `repos/mempalace.md`; May correction ledger | Typed memory concept | No pin; MIT | L/L/M/L/– | Graph behavior and 96.6% claim contested | teaching-only | Correction/caution lesson |
| Memory OS (ClaudioDrews) | `repos/memory-os.md` | Local memory wrapper | Unpinned; license missing | H/H/H/M/M | Dual-writer and layer-count contradictions preserved | refresh | Focused memory case |
| Cloudflare Agent Memory | `blogs/cloudflare-agent-memory.md` | Managed memory | Private beta; no public implementation | H/H/H/M/M | R2 described as planned, not live | teaching-only | Managed-memory lesson |
| Anthropic managed memory | `blogs/anthropic-managed-agents-memory.md` | Managed agent memory | Proprietary product | M/M/H/M/H | Vendor-reported results only | teaching-only | Filesystem/versioning lesson |
| Omi | `repos/omi.md`; continuity synthesis | Ambient memory/runtime | Commit-pinned; MIT | H/H/H/H/H | Privacy and firmware-signing uncertainties | ready | Ambient-memory deep dive |
| Omi-adjacent knowledge agents | `repos/khoj.md`; `repos/anything-llm.md`; `repos/quivr.md` | Knowledge agents | Unpinned; mixed licenses | L/L/M/L/L | Product surfaces, not yet memory-substrate dossiers | new deep dive | Defer or comparison row |

### Focused cases and teaching sources

| Candidate | Source key(s) | Primary teaching job | T/L/S/A/RV | Readiness | Artifact |
|---|---|---|---|---|---|
| Drover | `repos/drover.md`; DeepSeek/Drover dissection | Fleet custody, facts/projections, quiescent upgrade | H/H/H/H/H | refresh | Mechanism lesson + comparison row |
| Paperclip | `repos/paperclip-orchestrator.md`; Paperclip research | Durable work governance | H/H/M/H/H | teaching-only | Governance lesson |
| Webhound | `repos/webhound-mcp.md` | Evidence packs and typed terminal truth | H/H/H/H/H | ready | Evidence lesson |
| Factory Missions + GitHub Copilot | Factory/Copilot dissection | Contract-first delivery and protected repository closure | H/H/M/H/H | teaching-only | Comparative mechanism lesson |
| Devin / Greptile / CodeRabbit / Qodo | Verification-product dissection | Distinct verification surfaces | M/H/M/M/H | teaching-only | One comparative lesson, not four peer dossiers |
| Anthropic long-running harness | Anthropic article note | Planner/generator/evaluator and structured handoffs | H/H/M/M/H | teaching-only | Curriculum pattern |
| Project Think launch article | Project Think note | Fibers, sessions, execution ladder, preview evolution | M/H/H/H/M | teaching-only | Historical pattern beside current Think runtime |
| Agent Orchestrator | AO research dissection | Multi-session operator and provider adapters | H/H/M/H/H | refresh | Operator deep dive or lesson |
| HarnessRouter CE / UHP | Meridian audit | Provider compatibility and conformance | H/H/M/M/H | ready | Protocol/conformance lesson |
| Spotify Xirp / Portal | Spotify dissection | Native custody and organizational context | H/H/M/M/M | teaching-only | Factual product pattern; legal boundary explicit |
| Medley / Spine | Medley dissection | Interviewed mission contract and receipts | H/H/M/M/M | teaching-only | Mission-contract lesson |
| Screenpipe | `repos/screenpipe-screenpipe.md` | Observation plane and provenance | H/M/H/M/M | teaching-only | Data-boundary lesson |
| Boop Agent | `repos/raroque-boop-agent.md` | Dispatcher and shadow memory proposals | H/H/H/M/M | teaching-only | Lifecycle/memory lesson |
| AutoResearch | `repos/autoresearch.md` | Locked evaluator and experiment ratchet | H/H/M/M/H | teaching-only | Harness-evolution lab |
| AutoContext | `repos/autocontext.md` | Feedback and curation loop | M/H/H/M/M | teaching-only | Learning-loop lesson |
| AHE / NexAU | AHE paper | Falsifiable harness evolution | H/H/H/M/H | teaching-only | Evaluation lab |
| Life-Harness | Life-Harness paper | Deterministic adaptation loop | H/H/M/M/H | teaching-only | Adaptation lab |
| Arbor | Arbor paper | Hypothesis-tree refinement | H/H/H/M/H | teaching-only | Research-loop lesson |
| AutoAgent | `repos/autoagent.md`; correction ledger | Historical zero-code tools and unsafe execution | H/H/H/H/M | teaching-only | Security caution only |
| Claude Code internals / Dive into Claude Code | respective repository notes | Reconstructed architecture vocabulary | H/H/H/H/M | teaching-only | Discovery input; no implementation claims |
| PicoClaw | `repos/picoclaw.md` | Synthetic pattern cluster | M/M/M/M/M | teaching-only | Never create a system profile |
| Twelve-Factor Agents | `repos/twelve-factor-agents.md` | Harness design principles | M/H/H/H/M | teaching-only | Curriculum chapter |
| ArtifactFS | `repos/artifact-fs.md` | Environment/artifact custody | H/M/H/M/M | teaching-only | Custody lesson |
| Pipecat / Pipecat Subagents | respective repository notes | Realtime interruption and message-bus delegation | H/H/M/M/M | new deep dive | Focused runtime lesson |
| Mercury Agent / Kuku | respective repository notes | Loop governance, checksums, ordered effects | H/H/H/H/M | refresh | Focused mechanism lessons |
| SkillClaw / SkillOpt / Hermes Self-Evolution | respective repository notes | Skill evolution and promotion | M/H/M/M/H | teaching-only | Evolution gallery |
| Paxel | clean-room Paxel dossier | Correctable longitudinal continuity | H/H/H/M/M | teaching-only | Provenance/continuity case |

### Remaining candidate registry

These rows complete the roster for systems that appear only as focused dossiers, atlas entries, or shallow ecosystem records. A missing pin is an explicit finding.

| Candidate | Source key(s) | Category and metadata boundary | T/L/S/A/RV | Fidelity or correction boundary | Readiness | Artifact |
|---|---|---|---|---|---|---|
| AutoGen | Ecosystem source of truth; Harness atlas | Multi-agent framework; no current pin/license card | M/M/L/M/M | Landscape only | new deep dive | Comparison row after research |
| MetaGPT | Ecosystem source of truth; Harness atlas | Organization-shaped workflow; no current pin/license card | M/M/L/M/M | Landscape only | new deep dive | Comparison row after research |
| Agenta | Harness atlas | Harness control product; no current pin/license card | M/M/M/M/M | Single routing record | new deep dive | Defer |
| OpenAgents | Harness atlas | Shared agent workspace; no current pin/license card | M/M/M/M/M | Single routing record | new deep dive | Defer |
| Flue | Ecosystem source of truth; Harness atlas | Portable runtime; no current pin/license card | M/M/–/M/M | Mechanism synthesis only | teaching-only | Portable-runtime lesson |
| deepagents | LangChain articles; Harness atlas | Middleware composition; no current pin/license card | M/M/M/M/M | Pattern-level evidence | teaching-only | Middleware lesson |
| Eve | Harness atlas | Suspend/resume workflow; no dossier pin/license | M/M/M/M/M | Atlas entry only | new deep dive | Defer |
| Agent Orchestrator | `research/agent-orchestrator-ao-product-engineering-dissection-2026-07-30.md` | Multi-session operator; old commit; Apache-2.0 | H/H/M/H/H | Backend test failures and unrun frontend/runtime retained | refresh | Operator deep dive or lesson |
| Paperclip | `repos/paperclip-orchestrator.md`; Paperclip research | Work governance; old commit; MIT | H/H/M/H/H | Later pinned re-audit supersedes older prose | teaching-only | Governance lesson |
| HarnessRouter CE | Meridian audit | Provider compatibility; old commit; Apache-2.0 | H/H/M/M/H | Published conformance not rerun live | ready | Protocol lesson |
| UHP | Meridian audit | Compatibility protocol; 2026-08-11 edition | H/H/M/M/H | Protocol edition must be pinned independently | ready | Protocol lesson |
| Medley | Medley/Spine dissection | Mission supervisor; public plugin pin, MIT shim | H/H/M/M/M | Closed engine internals unknown | teaching-only | Mission-contract lesson |
| Spine | Medley/Spine dissection | Mission contract engine; proprietary 0.9.0 boundary | H/H/M/M/M | Public contracts only | teaching-only | Mission-contract lesson |
| Factory Missions | Factory/Copilot dissection; official docs | Proprietary orchestration product | H/H/M/H/H | Private scheduler, memory, and effect replay unknown | teaching-only | Delivery lesson |
| GitHub Copilot cloud agent | Factory/Copilot dissection; official docs | Proprietary repository-delivery agent | H/H/M/H/H | Public policy/contracts only; no inferred internals | teaching-only | Protected-closure lesson |
| Devin | Verification-product dissection | Proprietary execution/review product | M/H/M/M/H | First-party product evidence only | teaching-only | Verification comparison |
| Greptile / TREX | Verification-product dissection | Proprietary code validation product | M/H/M/M/H | First-party product evidence only | teaching-only | Verification comparison |
| CodeRabbit | Verification-product dissection | Proprietary review product | M/H/M/M/H | First-party product evidence only | teaching-only | Verification comparison |
| Qodo | Verification-product dissection | Proprietary review product; public legacy PR-Agent differs | M/H/M/M/H | Do not transfer legacy code claims to current product | teaching-only | Verification comparison |
| Spotify Xirp | Spotify dissection | Proprietary local coding custody product | H/H/M/M/M | Subscription/legal boundary blocks reverse engineering | teaching-only | Native-custody lesson |
| Spotify Portal | Spotify dissection | Proprietary organizational context product | M/M/M/H/M | Public product contracts only | teaching-only | Permissioned-context lesson |
| Webhound | `repos/webhound-mcp.md` | Research adapter; old commit; MIT adapter/proprietary backend | H/H/H/H/H | Hosted internals bounded | ready | Evidence lesson |
| Screenpipe | `repos/screenpipe-screenpipe.md` | Observation plane; old commit; commercial license | H/M/H/M/M | Reuse legally constrained | teaching-only | Provenance lesson |
| Boop Agent | `repos/raroque-boop-agent.md` | Personal-agent template; old commit; MIT | H/H/H/M/M | Code-over-doc correction retained | teaching-only | Lifecycle lesson |
| LifeOS | `repos/danielmiessler-lifeos.md` | Personal operating system; old pin; license missing | H/H/H/H/H | Mechanism-rich but license unresolved | refresh | Authority-ladder lesson |
| Alive | `repos/alive.md` | Wake/kill runtime; no current pin/license | L/M/M/L/M | Shallow source | teaching-only | Circuit-breaker lesson |
| GenericAgent | `repos/generic-agent.md` | Minimal runtime; MIT, no current pin/version | M/H/H/M/M | Source identity needs refresh | new deep dive | Minimal-loop lesson |
| Kuku | `repos/kuku.md` | Agent runtime; v0.5-era, MIT | M/H/H/H/M | No reproducible current snapshot | refresh | Ordered-effects lesson |
| Mercury Agent | `repos/mercury-agent.md` | Loop-governor runtime; MIT, no SHA | H/H/H/H/M | Claim-versus-code gaps retained | refresh | Loop-governor lesson |
| Agentic Stack | `repos/agentic-stack.md` | Portable agent stack; v0.7.2, Apache-2.0 | H/H/H/M/M | Fast-moving early snapshot | refresh | Portable-memory lesson |
| AgentScript | `repos/agentscript.md` | Declarative runtime; v2-era, Apache-2.0 | M/M/M/M/M | No current pin | new deep dive | Declarative-control lesson |
| Agentic Inbox | `repos/agentic-inbox.md` | Per-entity agent runtime; no pin/license/version | M/L/M/H/– | Shallow | new deep dive | Per-entity actor lesson |
| AtlanClaw | `repos/atlanclaw.md` | Agent runtime; source identity unresolved | L/M/M/M/L | Shallow | new deep dive | Compaction lesson or defer |
| ClawTeam | `repos/clawteam.md` | Multi-agent coordination; no pin/license/version | M/H/M/M/M | Shallow | new deep dive | Coordination lesson |
| KinBot | `repos/kinbot.md` | Personal agent; no metadata card | M/L/M/M/L | Synthesis only | new deep dive | Defer |
| OpenAgent | `repos/openagent.md` | Local personal agent; no pin/license/version | M/M/M/M/L | Shallow | new deep dive | Local-agent lesson |
| Pipecat | `repos/pipecat.md` | Realtime voice runtime; v1-era, BSD-2-Clause | H/H/M/M/M | No current pin | new deep dive | Interruption lesson |
| Pipecat Subagents | `repos/pipecat-subagents.md` | Message-bus delegation; v0.3-era, BSD-2-Clause | M/H/M/M/M | No current pin | new deep dive | Delegation lesson |
| ArtifactFS | `repos/artifact-fs.md` | Artifact/environment substrate; beta, Apache-2.0 | H/M/H/M/M | No current pin | teaching-only | Custody lesson |
| AutoContext | `repos/autocontext.md` | Feedback/curation loop; Apache-2.0 | M/H/H/M/M | No current pin | teaching-only | Learning-loop lesson |
| AutoResearch | `repos/autoresearch.md` | Experiment harness; no current pin/license | H/H/M/M/H | Teaching pattern, not peer runtime | teaching-only | Evaluation lab |
| SIA | `repos/sia.md` | Harness/weight-update research runtime; MIT | M/H/M/M/H | Deep May audit, no current pin | teaching-only | Evolution lesson |
| SkillClaw | `repos/skillclaw.md` | Collective skill evolution; MIT | H/H/H/M/H | No current pin | teaching-only | Skill-evolution lesson |
| SkillOpt | `repos/skillopt.md` | Prompt/skill optimization; MIT | M/H/M/M/H | Deep May audit, no current pin | teaching-only | Optimization lesson |
| HyperAgents | `repos/hyperagents-meta.md` | Self-improving agents; CC BY-NC-SA 4.0 | H/M/M/L/H | Non-commercial reuse boundary | teaching-only | Evolution gallery |
| Hermes Self-Evolution | `repos/hermes-self-evolution.md` | Evolution/evaluation add-on; MIT per README | M/M/M/M/H | No current pin | teaching-only | Evolution gallery |
| Microsoft Agent 365 | Harness atlas | Enterprise agent governance; proprietary | M/M/M/H/M | Exposed behavior only | teaching-only | Governance gallery |
| Cursor Background Agents | Cursor ADL note; Harness atlas | Foreground/background coding sessions; proprietary | M/M/M/M/M | Exposed behavior only | teaching-only | Operator gallery |
| Warp Oz | Harness atlas | Multi-harness cloud operator; proprietary | M/M/M/M/M | Exposed behavior only | new deep dive | Operator comparison after research |
| Conductor | Harness atlas | Parallel coding workspaces; proprietary | M/M/L/M/M | Exposed behavior only | teaching-only | Workspace-isolation gallery |
| Vibe Island | Harness atlas; product research | Compact supervision surface; mixed public evidence | M/M/L/M/M | Do not infer runtime internals | teaching-only | Operator gallery |
| Vibe Notch | Harness atlas; product research | Compact supervision surface; mixed public evidence | M/M/L/M/M | Do not infer runtime internals | teaching-only | Operator gallery |
| AgentNotch | Harness atlas | Notch operator product; proprietary | L/M/–/M/M | Exposed behavior only | teaching-only | Operator gallery |
| Notchy | Harness atlas | Notch operator product; proprietary | L/M/–/M/M | Exposed behavior only | teaching-only | Operator gallery |
| NotchCode | Harness atlas | Notch operator product; proprietary | L/M/–/M/M | Exposed behavior only | teaching-only | Operator gallery |
| Cloudflare Computer | Harness atlas; Cloudflare docs | Execution substrate; current version not inventoried | H/M/M/H/M | Substrate, not complete harness | new deep dive | Environment lesson |
| Paxel | Clean-room Paxel dossier | Session intelligence product; proprietary | H/H/H/M/M | Derived claims are not user truth | teaching-only | Continuity lesson |
| Understand Anything | Harness atlas; repository note | Navigable code knowledge | M/M/H/L/M | Knowledge surface, not execution harness | teaching-only | Knowledge-navigation lesson |
| Folk | Harness atlas | Cross-channel personal agent; proprietary | M/M/M/M/M | Exposed behavior only | new deep dive | Product case after research |
| Poke | Harness atlas | Messaging administration agent; proprietary | M/M/M/H/M | Exposed behavior only | teaching-only | Trigger/effect gallery |
| Manus | Harness atlas | General computer-action product; proprietary | M/M/M/H/M | Exposed behavior only | new deep dive | Product case after research |
| ChatGPT Work | Harness atlas | General work execution product; proprietary | M/M/M/H/M | Exposed behavior only | new deep dive | Product case after research |
| Notion Custom Agents | Harness atlas | Workspace specialist product; proprietary | M/M/M/H/M | Exposed behavior only | teaching-only | Permission/logging gallery |
| Dust Pods | Harness atlas | Persistent shared initiatives; proprietary | M/M/M/M/M | Exposed behavior only | teaching-only | Initiative-object gallery |
| Glean Agents | Harness atlas | Enterprise context/action product; proprietary | M/M/H/H/M | Exposed behavior only | teaching-only | Permissioned-context gallery |
| WHOOP advisor | Harness atlas | Body-context advisor; proprietary | L/M/H/M/M | Health product behavior only; no runtime internals | teaching-only | Bounded body-context case |
| Oura advisor | Harness atlas | Body-context advisor; proprietary | L/M/H/M/M | Health product behavior only; no runtime internals | teaching-only | Bounded body-context case |
| Waldo / Kennel | Layer map; Harness and Memory manuscripts | Bounded private case study; designed/partial | H/H/H/H/H | Accepted, proposed, observed, and unproved states must remain distinct | teaching-only | Bounded case only |
| Khoj | `repos/khoj.md` | Knowledge/memory agent; v2 beta, AGPL-3.0 | L/L/M/L/– | Shallow | new deep dive | Defer |
| AnythingLLM | `repos/anything-llm.md` | Knowledge/memory agent; no current card | L/L/L/L/– | Publisher-level note only | new deep dive | Defer |
| Quivr | `repos/quivr.md` | Knowledge/memory agent; stagnant historical release | L/L/M/–/– | Historical/stale | teaching-only | Defer |
| OpenHuman | `repos/openhuman.md` | Personal memory/runtime; GPL-3.0, old commit date | M/M/H/M/M | No current pin | new deep dive | Hook/memory lesson |
| Claude Code auto-memory | Harness catalog; secondary memory analysis | Provider-native memory; current official docs not yet pinned | M/H/H/M/M | Reconstructed prompt is not official evidence | refresh | Provider-memory baseline |
| minimi | Harness catalog | Local memory product; no source card | M/M/H/M/M | Shallow | new deep dive | Defer |
| A-Mem | Memory survey | Research memory mechanism; paper only | M/H/H/–/M | Paper configuration only | teaching-only | Write-time evolution lesson |
| HeLa-Mem | HeLa ADL note | Research graph-memory mechanism; paper only | M/M/H/–/M | Paper configuration only | teaching-only | Graph-decay lesson |
| Hermes memory | Hermes dossier; correction ledger | Memory inside Hermes runtime | H/H/H/M/M | Never attribute five tiers or Dreaming Mode to Hermes | teaching-only | Connected runtime track |
| Boop memory | Boop dossier | Memory inside personal-agent template | H/H/H/M/M | Shadow proposals, not canonical mutation | teaching-only | Memory-lifecycle lesson |
| Cloudflare Agent Memory | Cloudflare memory blog | Managed/private-beta memory product | H/H/H/M/M | R2 described as planned, not live | teaching-only | Managed-memory lesson |

## Mandatory correction gate

No public prose may be drafted from affected notes until these corrections are applied at claim level:

1. Hermes did not originate “Dreaming Mode” or the five-tier memory taxonomy.
2. OpenClaw Active Memory has two tools, not three. Git profile distributions, Watchers, and `context_version` were also misattributed to OpenClaw.
3. Cognee convergence detection does not exist in the inspected implementation.
4. MemPalace graph behavior and its headline benchmark claim are contested.
5. Mem0 v3/current SDK behavior must not be described with the v2 paper.
6. OpenHarness has four compaction stages; PTL retry is a sub-path of stage four.
7. JiuwenClaw has four named skill-evolution components and separate Task Memory.
8. AutoAgent is historical/cautionary, not an active production peer.
9. Claude Code leaked or secondary internals are discovery input only.
10. Paperclip's later pinned re-audit supersedes its older unpinned prose.

## First-wave recommendation

Keep Chapters 2–5 as the first curriculum extraction. Do not begin both proposed deep dives as page-writing tasks yet.

Recommended sequence:

1. Create a new implementation-pinned Codex dossier from the current `rust-v0.149.0` source tree, including app-server protocol, thread/session state, compaction, permissions/sandboxing, interruption, recovery, review, and external closure.
2. Refresh DeepSeek Harness/Cordis from the existing implementation-pinned dossier and current `0.1.1-rc.2` source. This is the lowest-risk first long-form architecture page.
3. Publish Codex and DeepSeek as the first two deep dives only after both use the same responsibility/lifecycle contract and each includes a native-shape diagram, normalized topology, failure boundary, and retrieval check.
4. Build the LangGraph dossier next, explicitly separating `langgraph` `1.2.11`, checkpoint packages, SDK `0.4.3`, and hosted-platform responsibilities. It should replace DeepSeek only if that research reaches equivalent lifecycle and authority depth before writing starts.

This preserves one high-interest system and one already deep implementation case. It avoids spending the first vertical slice on two simultaneous source-research projects while keeping LangGraph as the next distinct control-shape priority.

## Publication boundary

- This audit is editorial planning, not a reader scorecard.
- No universal ranking or maturity score follows from readiness.
- Readiness describes this corpus, not the system's quality.
- Private paths, copied prose, private product state, personal data, and unlicensed diagrams remain excluded from public pages.
- No push, merge, deployment, domain purchase, or DNS change is authorized by this record.
