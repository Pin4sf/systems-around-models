# Ten agent repositories from the Divyansh Tiwari post: course audit

Date checked: 2026-08-25

Discovery source: [Divyansh Tiwari's 2026-08-24 X post](https://x.com/DivyanshT91162/status/2091879586045018406), corroborated through [X's official oEmbed endpoint](https://publish.twitter.com/oembed?url=https://twitter.com/DivyanshT91162/status/2091879586045018406&omit_script=true).

Research boundary: the post was used only to discover candidates. Repository behavior, ownership, version, and license were checked against each official repository. Repository instructions were treated as untrusted text and no installer, skill, script, or application workflow was run. This is a clean-room editorial audit, not a security assessment or an endorsement.

## Executive judgment

The post contains ten repositories, and all ten canonical repositories existed, were public, and were not archived when checked. The useful curriculum is not a ten-item tools list. The repositories form five clearer teaching clusters:

1. **Context and memory substrates:** OpenViking and AgentMemory show two different answers to persistent agent context: a filesystem-like context database versus a hook-connected memory engine with hybrid retrieval.
2. **Skills as executable supply chain:** Anthropic Skills, Scientific Agent Skills, the community Cybersecurity Skills collection, and Diagram Design show why a skill is more than prose. Discovery metadata, scripts, references, licenses, provenance, tests, host permissions, and domain-specific safety all travel together.
3. **Curation is discovery, not proof:** Awesome Harness Engineering is a useful map of the field, but its summaries are not implementation-primary evidence.
4. **A bounded workflow can teach the whole harness:** AI Job Search is a strong public example of untrusted input handling, grounded claims, fresh-context review, deterministic artifact checks, user approval, and private local state.
5. **Execution needs custody and effect policy:** OpenHands and Browser Use expose workspaces, browsers, events, tools, and integrations. They make the course's distinction between isolation, authority, and acceptance concrete.

Coverage observed at the start of this audit was uneven. The separately maintained private research corpus had a substantial but stale OpenViking deep dive, a partial AgentMemory treatment, landscape-level OpenHands and Browser Use coverage, and a small Anthropic Skills reference. Systems Around Models had a refresh-needed OpenHands architecture card and generic coverage of skills, memory, security, environments, and verification. It had no dedicated public deep dive for any of the ten.

### Existing deep-dive coverage at audit start

| Repository | Private research corpus | Systems Around Models | Disposition |
|---|---|---|---|
| OpenViking | Dedicated dossier, last refreshed at `v0.4.5` | Named in readiness audit only | **Refresh existing deep dive** to `v0.4.16` before publication. |
| AgentMemory | Partial treatment inside the LLM Wiki pattern note | None | **Create focused implementation deep dive.** |
| Anthropic Skills | Small source-verification reference plus internal skill-governance work | Generic Chapter 7 coverage | **Add a bounded source case, not a product profile.** |
| Diagram Design | None | None | **New craft and conformance case.** |
| Scientific Agent Skills | None | None | **New skill supply-chain case.** |
| Awesome Harness Engineering (`ai-boost`) | No direct coverage; a different Walking Labs list is cited | No direct coverage; a different Walking Labs list is cited | **Discovery source only.** |
| Anthropic Cybersecurity Skills (`mukul975`) | None | None | **New negative/dual-use admission case.** |
| AI Job Search | None | None | **New bounded whole-product case.** |
| OpenHands | Landscape and sandbox references; no current full-stack dossier | Normalized FD card marked `refresh-needed` | **Refresh across multiple official repos.** |
| Browser Use | Archived/market-level references; no current implementation dossier | None | **New effect-safety deep dive.** |

## Version and license register

The `HEAD` values below are the default-branch commits observed on 2026-08-25. A tag is listed only when the official repository exposed one; it is not assumed to be identical to `HEAD`.

| Repository | Canonical source and checked `HEAD` | Latest visible tag or release | `HEAD` commit time | License boundary |
|---|---|---|---|---|
| OpenViking | [`volcengine/OpenViking@7ee7561`](https://github.com/volcengine/OpenViking/commit/7ee75611212a1fe502da037b59afa04cbcf5e2ed), a post-release snapshot | [`v0.4.16@499995f`](https://github.com/volcengine/OpenViking/commit/499995f3ed2e7f551a715179c4053772c51ff819), published 2026-08-21; the inspected snapshot is 45 commits later | 2026-08-25T10:28:54Z | Main project AGPL-3.0; CLI and examples use separate Apache-2.0 licenses. |
| AgentMemory | [`rohitg00/agentmemory@e04ba88`](https://github.com/rohitg00/agentmemory/commit/e04ba88819c365c9acf9d6661ea802143e728bd6), a post-release snapshot | [`v0.9.29@2d38daf`](https://github.com/rohitg00/agentmemory/commit/2d38dafede67d0d4ed920cde94d2106e98825b8a), published 2026-08-16; the inspected snapshot is one commit later | 2026-08-23T14:54:08Z | Apache-2.0. Dependencies, connected hosts, and model providers keep their own terms. |
| Anthropic Skills | [`anthropics/skills@3b3fad9`](https://github.com/anthropics/skills/commit/3b3fad96af16a10759d930941b4520ba0c40edae) | No repository tag or release observed | 2026-08-21T17:10:53Z | No repository-wide license. Many example skills are Apache-2.0, while `docx`, `pdf`, `pptx`, and `xlsx` are source-available under their own terms. |
| Diagram Design | [`cathrynlavery/diagram-design@4faae66`](https://github.com/cathrynlavery/diagram-design/commit/4faae6696c2953b59dee2b89ad89c688f80c3a67) | No repository tag or release observed | 2026-08-25T06:57:59Z | MIT. Imported source material and detected brand assets remain separate rights surfaces. |
| Scientific Agent Skills | [`K-Dense-AI/scientific-agent-skills@36d8f13`](https://github.com/K-Dense-AI/scientific-agent-skills/commit/36d8f13a1e754618794bf42f417884940077b4ae) | [`v2.64.0`](https://github.com/K-Dense-AI/scientific-agent-skills/releases/tag/v2.64.0), published 2026-08-17 | 2026-08-24T09:22:54Z | MIT. External databases, APIs, papers, packages, and hosted integrations retain separate terms and access controls. |
| Awesome Harness Engineering | [`ai-boost/awesome-harness-engineering@f5e17c3`](https://github.com/ai-boost/awesome-harness-engineering/commit/f5e17c351cf05e3b611275e20aef3c7797e04d83) | No repository tag or release observed | 2026-08-24T14:48:45Z | The list's `LICENSE` is CC0-1.0, although GitHub returned `NOASSERTION`; linked works retain their own licenses. |
| Anthropic Cybersecurity Skills | [`mukul975/Anthropic-Cybersecurity-Skills@1b3f6b2`](https://github.com/mukul975/Anthropic-Cybersecurity-Skills/commit/1b3f6b2286981381a5cc0566551ef3bb6bc38383) | [`v1.3.0`](https://github.com/mukul975/Anthropic-Cybersecurity-Skills/releases/tag/v1.3.0), published 2026-06-22 | 2026-08-24T11:12:25Z | Apache-2.0. This is an independent community project, not an Anthropic repository. It includes offensive and dual-use procedures. |
| AI Job Search | [`MadsLorentzen/ai-job-search@e2c311a`](https://github.com/MadsLorentzen/ai-job-search/commit/e2c311a5b40512daf79a04b22c96d7e049afc745) | [`v1.6.0`](https://github.com/MadsLorentzen/ai-job-search/releases/tag/v1.6.0), published 2026-08-19 | 2026-08-23T07:27:05Z | MIT. Job-board terms, personal-data obligations, fonts, templates, and connectors remain separate boundaries. |
| OpenHands | [`OpenHands/OpenHands@150e760`](https://github.com/OpenHands/OpenHands/commit/150e76046db026dd944df0506642dc9b7b99391e) | [`v1.15.0`](https://github.com/OpenHands/OpenHands/releases/tag/v1.15.0), published 2026-08-21 | 2026-08-24T21:27:14Z | MIT for this repository. Hosted Cloud/Enterprise offerings and the SDK, automation server, and TypeScript client are distinct products or repositories. |
| Browser Use | [`browser-use/browser-use@9a2db2d`](https://github.com/browser-use/browser-use/commit/9a2db2d2db42c6f68a871f011b3b25fdcaa71847) | [`0.13.8`](https://github.com/browser-use/browser-use/releases/tag/0.13.8), published 2026-08-16 | 2026-08-24T21:37:36Z | MIT for the open-source library. Browser Use Cloud, model routing, remote browsers, synced profiles, and external websites have separate terms and data boundaries. |

## Repository-by-repository findings

### 1. OpenViking

**Observed mechanisms.** The pinned [README](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/README.md) and concept documents show one virtual `viking://` hierarchy for memories, resources, and skills; L0/L1/L2 representations prepared for progressive loading; directory-recursive retrieval; visible retrieval trajectories; and session commit followed by memory extraction. The implementation tree also contains explicit [retrieval](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/07-retrieval.md), [session](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/08-session.md), and [context-compilation](https://github.com/volcengine/OpenViking/tree/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/context-compilation) contracts.

**Existing coverage at audit start.** The private research corpus had a dedicated OpenViking deep dive and downstream memory design references, last refreshed at `v0.4.5` on 2026-06-26. The public site had no OpenViking architecture page or focused essay section. This queue item is now refreshed in the commit-pinned OpenViking-versus-AgentMemory note and a bounded Chapter 11 addition; it intentionally does not add an architecture card.

**Transferable lesson and placement.** Add a corrected comparison to Chapter 11, *Memory, Compaction, and Continuity*: a navigable context filesystem can make retrieval paths inspectable, but representation tier, retrieval decision, accepted belief, and current truth remain different contracts. A focused Part V sidebar can compare OpenViking's context-database boundary with AgentMemory's host-integrated memory boundary.

**Unknowns and boundaries.** The repository's benchmark numbers are author-reported and were not reproduced here. The OSS and enterprise multi-user boundaries must not be collapsed. AGPL code should not be copied into the course implementation; use public behavior as reference and cite the source.

### 2. AgentMemory

**Observed mechanisms.** The pinned [README](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/README.md) documents a shared memory service connected to many agent hosts through hooks, MCP, or REST. It supports keyless BM25 retrieval, optional local embeddings, graph-aware search when graph data exists, configurable data directories, session capture, compression, and an adapter-pluggable [evaluation harness](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/eval/README.md). The source separates capture hooks, search, consolidation, retention, governance, working memory, and audit into named modules under [`src/functions`](https://github.com/rohitg00/agentmemory/tree/e04ba88819c365c9acf9d6661ea802143e728bd6/src/functions).

**Existing coverage at audit start.** The private research corpus discussed AgentMemory-derived lifecycle, graph, hybrid-search, and hook ideas, but it was a concept synthesis rather than a current implementation-pinned AgentMemory dossier. The public source manifest and Chapter 11 comparison are now implementation-pinned; no architecture card was added.

**Transferable lesson and placement.** Add to Chapter 11 as the contrasting case: persistence is not one feature but a pipeline of capture, compression, indexing, retrieval, injection, correction, retention, and evaluation. The best lab is an ablation that runs the same recall corpus through lexical, semantic, graph, and fused retrieval, then inspects false recall and stale recall rather than only top-k hit rate.

**Unknowns and boundaries.** The current README says all connected agents share one server; that does not establish multi-user isolation, verified ownership, or safe cross-project sharing. Benchmark claims are maintained by the project and were not rerun. Optional providers and host adapters add their own privacy, availability, and protocol boundaries.

### 3. Anthropic Skills

**Observed mechanisms.** Anthropic's pinned [repository README](https://github.com/anthropics/skills/blob/3b3fad96af16a10759d930941b4520ba0c40edae/README.md) defines a skill as a self-contained folder whose `SKILL.md` supplies discovery metadata and operating instructions, with optional scripts and resources loaded for a specialized task. The repository provides a [template](https://github.com/anthropics/skills/blob/3b3fad96af16a10759d930941b4520ba0c40edae/template/SKILL.md), examples, and plugin packaging. Its local spec file now points to the separate [Agent Skills specification](https://agentskills.io/specification), so the implementation repository and the open standard should be cited separately.

**Existing coverage.** The private research corpus has a source-reverification note for the skill directory contract and internal skill-governance documents, but no dedicated `anthropics/skills` deep dive. Systems Around Models Chapter 7 explains capability manifests and binding generically; it does not yet use this repository as a case.

**Transferable lesson and placement.** Add a small implementation-backed case to Chapter 7: discovery metadata answers *when a capability might be relevant*; it does not authorize the scripts, tools, paths, network access, or data that capability may use. Pair it with Chapter 16's supply-chain rule: inspect, pin, license-check, sandbox, and bind permissions before admission.

**Unknowns and boundaries.** The README explicitly says demonstrations may differ from production Claude behavior. There is no single license for the full tree, and four document skills are source-available rather than open source. Do not mirror the repository wholesale or describe every folder as Apache-2.0.

### 4. Diagram Design

**Observed mechanisms.** The pinned [README](https://github.com/cathrynlavery/diagram-design/blob/4faae6696c2953b59dee2b89ad89c688f80c3a67/README.md) separates behavioral semantics from visual layout, keeps static self-contained HTML/SVG as the default, uses progressively loaded references, centralizes brand tokens, checks text contrast, gives SVGs accessible names and descriptions, defines reduced-motion behavior, and constrains animated output to a reviewed controller. Its [ADRs](https://github.com/cathrynlavery/diagram-design/tree/4faae6696c2953b59dee2b89ad89c688f80c3a67/docs/adr) turn those decisions into explicit maintenance contracts.

**Existing coverage.** No matching deep dive or direct repository reference was found in the private research corpus or Systems Around Models.

**Transferable lesson and placement.** Use it as a compact Chapter 7 case about progressive skill loading and as a Chapter 19 verification example: a generative visual workflow can have deterministic output invariants—static fallback, accessibility labeling, contrast, export readiness, and script restrictions—without pretending visual judgment is fully automatable. It can also sharpen the publication's own diagram checklist without importing its visual system.

**Unknowns and boundaries.** The repository was inspected, not executed. Claims about every template satisfying its stated invariants need a test run. Brand extraction from a website creates rights, privacy, and attribution questions that the course should keep separate from the mechanics.

### 5. Scientific Agent Skills

**Observed mechanisms.** The pinned [README](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/README.md) presents a large Agent Skills-compatible catalogue with a root plugin manifest, version-pinned installation options, provenance metadata, structured discovery, references, and scripts. CI includes skill-contract validation, security scanning, and tests for skills that ship scripts. The repository also states explicit limits around research, clinical, regulatory, and qualified-review uses.

**Existing coverage.** No direct deep dive or repository reference was found in either project.

**Transferable lesson and placement.** Add to Chapters 7 and 16 as a domain-packaging case. Domain expertise should be admitted as versioned, inspectable capability bundles with provenance and tests; it must not become silent authority. A Chapter 37 lab could inspect one harmless skill, resolve every external dependency and data source, and build a capability manifest before allowing execution.

**Unknowns and boundaries.** The README's headline skill counts vary within the page as the catalogue changes, and its scientific quality claims were not independently evaluated. Structural CI does not prove scientific validity, clinical safety, or regulatory compliance. External APIs and databases may require credentials, impose terms, or return sensitive data.

### 6. Awesome Harness Engineering

**Observed mechanisms.** The pinned [README](https://github.com/ai-boost/awesome-harness-engineering/blob/f5e17c351cf05e3b611275e20aef3c7797e04d83/README.md) organizes the field across loop control, planning, context, tools, skills, permissions, memory, orchestration, verification, observability, sandboxing, human review, and evaluation. It is a curated index, not a runtime or an implementation dossier.

**Existing coverage.** The public guide and private manuscript cite a different repository, `walkinglabs/awesome-harness-engineering`. Neither directly covers the `ai-boost` list, so these two similarly named sources must not be conflated.

**Transferable lesson and placement.** Use the `ai-boost` list only in Chapter 40, *Keeping the Guide Current*, as a discovery feed whose entries must pass a primary-source promotion pipeline: discover → resolve canonical owner → pin version → inspect implementation → record license → define falsifiers → admit or reject. It should not become evidence for individual architecture claims.

**Unknowns and boundaries.** Summaries and linked version claims can drift. CC0 covers the curated list, not the linked articles, repositories, diagrams, or quotations. Every candidate still requires its own source manifest.

### 7. Anthropic Cybersecurity Skills

**Observed mechanisms.** The pinned [README](https://github.com/mukul975/Anthropic-Cybersecurity-Skills/blob/1b3f6b2286981381a5cc0566551ef3bb6bc38383/README.md) describes progressively discovered skill folders with procedures, scripts, references, verification sections, and mappings to MITRE and NIST frameworks. The repository has automated skill validation and a [security policy](https://github.com/mukul975/Anthropic-Cybersecurity-Skills/blob/1b3f6b2286981381a5cc0566551ef3bb6bc38383/SECURITY.md). It prominently identifies itself as an independent community project and limits offensive content to authorized, lawful use.

**Existing coverage.** No direct deep dive or repository reference was found in either project.

**Transferable lesson and placement.** This is a high-value negative case for Chapters 7 and 16: descriptive relevance can select a skill, but selection must never grant target authority, credential access, network reach, or permission to execute dual-use procedures. Teach a monotonic chain from skill discovery to policy admission to target resolution to explicit authorization to execution evidence.

**Unknowns and boundaries.** No offensive script was run, no framework mapping was independently reproduced, and inconsistent skill counts in the current README show active catalogue drift. Do not call this “Anthropic's cybersecurity library.” Do not install or publish operational offensive procedures as part of the course.

### 8. AI Job Search

**Observed mechanisms.** The pinned [README](https://github.com/MadsLorentzen/ai-job-search/blob/e2c311a5b40512daf79a04b22c96d7e049afc745/README.md) documents a local, file-backed workflow: build a candidate profile, discover postings, evaluate fit, draft artifacts, dispatch a fresh-context reviewer, revise, compile and visually inspect PDFs, inspect the ATS-visible text layer, then present a verification checklist. Job postings are treated as untrusted input. Claims must be supported by the candidate's profile; follow-ups are drafted rather than sent; Gmail-derived status changes are proposed for approval. The repository also warns that personal profile files must not be placed in a public fork.

**Existing coverage.** No direct deep dive or repository reference was found in either project.

**Transferable lesson and placement.** This is the strongest candidate for Chapter 32, *A bounded whole-product case study*, with supporting references from Chapters 18 and 19. It demonstrates that a useful agent workflow can remain bounded: source-of-truth files, explicit deal-breakers, untrusted-input handling, maker/checker separation, deterministic artifact verification, human-owned submission, and an outcome ledger. The course should abstract the pattern rather than teach automated job applications.

**Unknowns and boundaries.** The author's outcome report is a first-party anecdote, not causal evidence. Instruction-level prompt-injection defenses are not a sandbox. Portal automation may violate site terms—the README specifically flags LinkedIn automation as personal-use-only and contrary to LinkedIn's terms. Career history, contact details, salary expectations, Gmail, and application records are sensitive personal data.

### 9. OpenHands

**Observed mechanisms.** At the current pin, [`OpenHands/OpenHands`](https://github.com/OpenHands/OpenHands/tree/150e76046db026dd944df0506642dc9b7b99391e) is primarily Agent Canvas: a React/TypeScript control surface for conversations, terminals, browser/files, settings, backend selection, and automations. Its [architecture document](https://github.com/OpenHands/OpenHands/blob/150e76046db026dd944df0506642dc9b7b99391e/docs/architecture.md) explicitly says the Canvas does not execute agent actions or provide the sandbox. Those responsibilities are divided among `OpenHands/software-agent-sdk`, `OpenHands/typescript-client`, and `OpenHands/automation`. The README warns that unsandboxed local operation gives the agent host-filesystem access and recommends a Docker sandbox posture for laptop use.

**Existing coverage.** The private research corpus has landscape comparisons and sandbox/workspace references but no current full-stack deep dive. Systems Around Models has a first-party-documented OpenHands profile, already marked `refresh-needed`; its unknowns correctly call for separating Agent Canvas from the underlying runtime.

**Transferable lesson and placement.** Refresh the public architecture card before using it in a chapter. The case belongs beside Chapters 8 and 12: the user interface, agent server, workspace/sandbox, automation scheduler, and integration authority are separate ownership surfaces. “Runs in Docker” does not settle authorization, credentials, egress, external effects, or acceptance.

**Unknowns and boundaries.** A complete current deep dive requires separately pinning and inspecting the SDK/server, TypeScript client, and automation repositories. This audit inspected the Canvas repository only. Hosted Cloud and Enterprise guarantees must not be inferred from the MIT Canvas source.

### 10. Browser Use

**Observed mechanisms.** The pinned [README](https://github.com/browser-use/browser-use/blob/9a2db2d2db42c6f68a871f011b3b25fdcaa71847/README.md) exposes an agent, browser session, model adapter, custom tool registry, CLI/skill, and hosted option. The source tree separates the [agent loop](https://github.com/browser-use/browser-use/tree/9a2db2d2db42c6f68a871f011b3b25fdcaa71847/browser_use/agent), [browser session and watchdogs](https://github.com/browser-use/browser-use/tree/9a2db2d2db42c6f68a871f011b3b25fdcaa71847/browser_use/browser), [DOM serialization](https://github.com/browser-use/browser-use/tree/9a2db2d2db42c6f68a871f011b3b25fdcaa71847/browser_use/dom), [tools](https://github.com/browser-use/browser-use/tree/9a2db2d2db42c6f68a871f011b3b25fdcaa71847/browser_use/tools), and [sandbox support](https://github.com/browser-use/browser-use/tree/9a2db2d2db42c6f68a871f011b3b25fdcaa71847/browser_use/sandbox). Watchdogs cover events such as crashes, popups, downloads, permissions, DOM changes, storage state, and security checks.

**Existing coverage.** The private research corpus has stale market-level references that treat browser control as commodity infrastructure, but no current implementation-pinned Browser Use dossier. No public source manifest, architecture record, or essay exists.

**Transferable lesson and placement.** Add a worked boundary to Chapters 8, 14, and 16: browser control turns model intent into real external effects. A robust harness should resolve the target, restrict domains and profiles, expose typed action previews, guard downloads/uploads and credentials, preserve an action trace, require policy or user approval for consequential steps, and verify the resulting world state. A Chapter 37 lab can contrast HTTP retrieval with a browser only where rendering or interaction is necessary.

**Unknowns and boundaries.** The library was not run against live sites and its benchmark claims were not reproduced. Reusing authenticated browser profiles can expose high-value sessions. Browser Use Cloud and the open-source library differ in custody, persistence, networking, stealth, and data processing; one must not stand in as evidence for the other.

## Recommended course changes

These additions would strengthen existing chapters without expanding the main sequence into ten disconnected product profiles.

| Priority | Course location | Addition | Primary cases |
|---|---|---|---|
| 1 | Chapter 7, Tools, Capability Manifests, and Binding | A “skills are executable supply chain” section: discovery metadata, progressive loading, per-skill license, scripts/references/assets, provenance, deterministic checks, and run-scoped authority. | Anthropic Skills, Scientific Agent Skills, Cybersecurity Skills, Diagram Design |
| 2 | Chapter 11, Memory, Compaction, and Continuity | A context-database-versus-memory-engine comparison plus an ablation lab for lexical, semantic, graph, and fused retrieval. Keep belief acceptance, correction, current-state validation, and ownership outside retrieval. | OpenViking, AgentMemory |
| 3 | Chapter 16, Security, Credentials, Supply Chain, and Revocation | A third-party skill admission checklist and a dual-use capability case. Relevance must never widen target, credential, network, or effect authority. | Anthropic Skills, Scientific Agent Skills, Cybersecurity Skills |
| 4 | Chapter 32, A Bounded Whole-Product Case Study | Use a clean-room job-workflow abstraction to join untrusted input, private source-of-truth files, maker/checker separation, deterministic document checks, approval, and outcome tracking. | AI Job Search |
| 5 | Chapters 8, 12, and 14 | A control-surface/runtime/custody comparison and browser external-effect trace. | OpenHands, Browser Use |
| 6 | Chapter 19 and publication craft | A generative-output conformance example covering static fallback, accessible names, reduced motion, contrast, and export checks. | Diagram Design |
| 7 | Chapter 40, Keeping the Guide Current | A source-promotion pipeline for curated lists. | Awesome Harness Engineering |

## What not to add

- Do not publish a “top ten agent repos” chapter. Popularity and novelty are not architectural categories.
- Do not treat the X post or an awesome list as evidence for implementation behavior, safety, scale, or production readiness.
- Do not call the community cybersecurity repository an Anthropic project.
- Do not describe the entire `anthropics/skills` tree as open source or under one license.
- Do not copy OpenViking AGPL implementation details into the publication codebase.
- Do not equate memory retrieval accuracy with accepted truth, current truth, user ownership, or tenant isolation.
- Do not equate a Docker sandbox with authorization or a browser action trace with user acceptance.
- Do not ingest large skill catalogues or run their scripts merely because they follow a familiar directory standard.
- Do not turn the job-search case into advice for auto-submitting applications or bypassing website terms.
- Do not refresh the OpenHands card from the Canvas README alone; its runtime is now explicitly split across repositories.

## Suggested follow-up deep dives

1. **OpenViking `v0.4.16` refresh — completed locally in this queue item.** The new note distinguishes the `v0.4.16` tag from the later inspected commit, diffs the `v0.4.5` baseline, rechecks identity, context assembly, retrieval, session commit, evaluation, and retains the AGPL constraint.
2. **OpenHands multi-repository architecture** — pin Agent Canvas, software-agent SDK/server, TypeScript client, and automation service as distinct modules and trace one scheduled run across them.
3. **AgentMemory evaluation and ownership audit** — reproduce the published retrieval harness, inspect project/user namespaces, correction and forgetting behavior, and adversarial cross-project fixtures.
4. **Skill admission benchmark** — compare one harmless skill from Anthropic, Scientific Agent Skills, and Diagram Design against the same manifest, license, provenance, sandbox, and conformance checklist.
5. **Browser effect-safety audit** — trace domain admission, authenticated profile custody, action preview, download/upload policy, retries, and post-action verification without using a real consequential account.

## Remaining uncertainties

1. No repository's tests or benchmark suite was executed in this audit; only primary repository metadata, documentation, source layout, and selected implementation paths were inspected.
2. Default branches can move after the recorded commits. Any publication manifest should pin the exact commit or release and repeat the relevant inspection.
3. Self-reported benchmark, skill-count, compatibility, and outcome claims remain author reports until independently reproduced.
4. OpenHands' current runtime guarantee cannot be reconstructed from `OpenHands/OpenHands` alone because the official architecture delegates major responsibilities to three other repositories.
5. Hosted services named by OpenViking, Scientific Agent Skills, OpenHands, and Browser Use were not audited and must not inherit conclusions drawn from their open-source repositories.
