# Chapters 29–40: clean-room corpus and primary-source audit

Validated: 2026-08-26 (Asia/Kolkata)

## Purpose and method

This note prepares the remaining Harness Engineering sequence from accumulated study guides, repository deep-dives, comparative dossiers, evaluation notes, and learning-loop records without publishing the private research corpus. The private material was used only to find questions, mechanisms, conflicts, and likely omissions. Every public claim retained below was independently rechecked against a first-party repository, release, official documentation page, standard, or paper.

No private product architecture, user information, internal repository path, credential, trace, prompt, or proprietary phrasing is reproduced here. No upstream application, hosted product, benchmark, installer, or third-party script was run. Repository evidence is limited to the immutable revisions and paths linked below. Product documentation establishes exposed behavior, not hidden implementation or production reliability.

Evidence labels used in this audit:

- **Verified** — directly supported by the linked primary source at the named revision or retrieval date.
- **Reported** — a first-party performance or product claim that was not independently reproduced.
- **Teaching synthesis** — an original, falsifiable lesson assembled from several sources; not an industry standard.
- **Unknown** — requires implementation inspection, a controlled experiment, operational evidence, or an authoritative clarification.
- **Rejected** — unsuitable for public use because its evidence, privacy boundary, licensing boundary, or attribution is inadequate.

No state-of-the-art claim is supported by this audit.

## Sequence reconciliation

The current public sequence already ends at position 29 with *Drover: Fleet Custody and Evidence*. The detailed private manuscript numbers that case as Chapter 28 because it does not count the public overview as a sequence position. Consequently, manuscript Chapter 29 is public sequence position 30.

The clean public mapping should be:

| Public position | Public chapter | Manuscript origin | Disposition |
| ---: | --- | ---: | --- |
| 29 | Drover: Fleet Custody and Evidence | 28 | Released at revision 3; do not duplicate it. |
| 30 | Provider-Native Custody and Permissioned Context | 29 | Publish from current Xirp and Portal documentation with a strict proprietary-system boundary. |
| 31 | Validation Contracts and Repository Delivery | 30 | Publish as a Factory Missions and GitHub comparison, not a winner table. |
| 32 | The Verification Plane | 31 | Publish as a mechanism comparison across executor evidence, runtime validation, policy checks, and review. |
| 33 | A Bounded Whole-Product Workflow | 32 | Replace the private product case with a public, clean-room workflow case. |
| 34 | Model × Harness Evaluation | 33 | Publish as evaluation design, with all example numbers visibly synthetic unless reproduced. |
| 35 | Outcome, Trajectory, and Conformance | 34 | Publish as an original three-lens evaluation framework. |
| 36 | Failure Injection and Recovery Evaluation | 35 | Publish as predeclared state-transition testing, not a list of alleged incidents. |
| 37 | Harness Learning, Promotion, and Retirement | 36 | Publish with locked-evaluator and held-out-promotion boundaries. |
| 38 | Twelve Labs | 37 | Publish the cumulative curriculum; label pedagogical effectiveness unverified. |
| 39 | Capstone | 38 | Publish a generic unreliable-provider exercise with executable acceptance criteria. |
| 40 | Review Questions and Design Worksheet | 39 | Publish as a review instrument. |
| 41 | Keeping the Guide Current | 40 | Publish the source-maintenance chapter as the final course chapter; position 41 includes the short guide at position 1 plus forty detailed chapters. |

The sequence-position offset is intentional: the short course occupies position 1, so manuscript Chapter 40 occupies public sequence position 41 without changing the forty-chapter promise.

## Corpus inventory and clean-room boundary

The high-value private corpus converged into six public-safe teaching families:

| Corpus family | Distinct value retained | Excluded from public output |
| --- | --- | --- |
| Harness and memory study guides | The remaining sequence; proof levels; candidate-first promotion; prospective re-entry; authority non-amplification; correction and deletion lineage | Private case details, internal contracts, and product-readiness claims |
| Product comparisons | Native custody versus normalized control; mission validation versus repository delivery; executor versus verifier versus policy | Competitive recommendations, hidden architecture inference, private adoption plans |
| Repository deep-dives | Locked evaluators; experiment ledgers; playbooks; protected surfaces; rollback and retirement; skill supply-chain questions | Unpinned mechanism claims, implementation recipes tied to private systems, copied language |
| Evaluation and learning notes | Construct versus operationalization; system-configuration attribution; failed-trial retention; judge and benchmark failure modes | Leaderboards, invented aggregate scores, and author-reported gains treated as reproduced fact |
| Memory engineering material | Candidate status, source authority, lifecycle state, procedure promotion, prospective cues, human closure, purge lineage | Memory-product rankings and any implication that retrieval grants authority |
| Publication and source-maintenance material | Canonical-owner resolution, exact revision pins, inspected paths, evidence grades, falsifiers, immutable history, typed errata | Private links, internal evidence, legal conclusions, or retrospective rewriting of old revisions |

The corpus is useful because several independent records converge on the same mechanism. Repetition is not additional evidence. The public chapters should keep the smallest concrete contract and omit duplicate slogans.

## Current primary-source register

Default branches are volatile. A release pin defines a reproducible product or source boundary; a current head is recorded only to show where a later refresh begins.

| Source | Exact boundary rechecked on 2026-08-26 | Public evidence limit |
| --- | --- | --- |
| Spotify Xirp | Official changelog documents beta [`0.19.1`, dated 2026-08-26](https://backstage.spotify.com/docs/xirp/changelog) | First-party product behavior only; no public source revision or production guarantee. |
| Spotify Portal / Backstage | Current Portal docs retrieved 2026-08-26; Backstage OSS [`v1.54.5` at `29330a97934f04b5ea4ce8f8219903f1f22402ff`](https://github.com/backstage/backstage/tree/29330a97934f04b5ea4ce8f8219903f1f22402ff); current `master` was `d07e99e3a0333f72f008e79878eb2ad8c9850f3d` | Backstage source does not prove Spotify Portal's deployed proprietary implementation. |
| Factory Missions | Official [overview](https://docs.factory.ai/missions/overview) and [planning and validation guide](https://docs.factory.ai/missions/planning), retrieved 2026-08-26 | Exposed orchestration contract; scheduler internals and outcome claims remain unknown. |
| GitHub coding agents | Current official [agent workflow](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents) and [third-party agent boundary](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents), retrieved 2026-08-26 | Repository-delivery behavior and policy surface, not universal completion. Preview behavior may change. |
| Devin | Current [testing and recordings](https://docs.devin.ai/work-with-devin/testing-and-recordings) and [Session Insights](https://docs.devin.ai/product-guides/session-insights), retrieved 2026-08-26 | Vendor-documented behavior; no independent proof of review accuracy or completion. |
| Greptile TREX | [Launch post dated 2026-06-15](https://www.greptile.com/blog/trex) and [engineering post dated 2026-06-17](https://www.greptile.com/blog/trex-code-execution) | Artifact mechanism is documented; the reported bug-detection gain was not reproduced. |
| CodeRabbit | Current [pre-merge check contract](https://docs.coderabbit.ai/pr-reviews/pre-merge-checks), retrieved 2026-08-26 | Product states and override behavior, not proof that a model-defined check is correct. |
| Qodo | Current Qodo 2 [review documentation](https://docs.qodo.ai/code-review), which identifies the v2 experience as released 2026-02-04; current release notes describe Qodo 2.3 | Commercial product behavior only. |
| PR-Agent | [`v0.43.0` at `4ebd5c5333c6ef21509e7304d27969eb825e6f22`](https://github.com/The-PR-Agent/pr-agent/tree/4ebd5c5333c6ef21509e7304d27969eb825e6f22); current `main` was `02c885cae40acc5617fa9cf32fab447e5212f2ba` | Separate legacy/community OSS line; it cannot establish Qodo 2 internals. |
| Public bounded workflow case | [`ai-job-search` v1.6.0 at `ab91c60cc47147d9416f0af758fb5e2d109956ce`](https://github.com/MadsLorentzen/ai-job-search/tree/ab91c60cc47147d9416f0af758fb5e2d109956ce); current `master` was `75c15eeeccf8b65dbbdc5028ea543f015d364afb` | Workflow mechanics only. Personal outcome claims are author reports, and personal source data must never enter fixtures. |
| Cursor harness evaluation | [First-party article dated 2026-04-30](https://cursor.com/blog/continually-improving-agent-harness) | Described evaluation practice; internal datasets, causal attribution, and generality are not independently reproduced. |
| NIST agent evaluation | [Evaluation-cheating guidance updated 2025-12-02](https://www.nist.gov/caisi/cheating-ai-agent-evaluations) and [evaluation-probes project updated 2026-05-05](https://www.nist.gov/programs-projects/building-evaluation-probes-agentic-ai) | Public evaluation guidance and experimental project, not a complete harness conformance standard. |
| Temporal durability documentation | Current docs `main` at [`991215d86325c2b62126afa4d3339be5f5ea0169`](https://github.com/temporalio/documentation/tree/991215d86325c2b62126afa4d3339be5f5ea0169); inspected current event-history and workflow-execution pages | Workflow replay semantics; external-effect idempotency, user acceptance, and closure remain application responsibilities. |
| AutoResearch | Current `master` at [`228791fb499afffb54b46200aca536f79142f117`](https://github.com/karpathy/autoresearch/tree/228791fb499afffb54b46200aca536f79142f117), committed 2026-03-26; no GitHub release observed | A bounded one-metric experiment ratchet, not a general self-improvement safety system. |
| AutoContext | Current `main` at [`c14d93560e679bddc4320e4174b8effda0804ff3`](https://github.com/greyhaven-ai/autocontext/tree/c14d93560e679bddc4320e4174b8effda0804ff3); Python and npm latest were `0.17.0`, while the tree's TypeScript package and changelog identify `0.17.1` | Fast-moving implementation evidence; accelerator, transfer, and performance claims remain project-reported unless reproduced. |
| Agentic Harness Engineering | [arXiv:2604.25850v4](https://arxiv.org/abs/2604.25850v4), submitted 2026-04-28 and revised 2026-05-18 | Paper-reported experiments only. |
| Harness Updating Is Not Harness Benefit | [arXiv:2605.30621v1](https://arxiv.org/abs/2605.30621v1), submitted 2026-05-28 | Paper-reported counterevidence; the distinction is useful, but its empirical results were not reproduced here. |

## Chapter 29 · Drover: released boundary

The current revision-2 chapter already supplies the correct bridge from individual runtimes to fleet supervision: host custody is distinct from harness execution; event IDs and evidence grades must preserve what the adapter actually knows; restart recovery is at-least-once; and a positional polling window is weaker than native turn identity.

**Disposition:** keep the existing release pin and revision-2 teaching. Do not create a second Chapter 29. The next case is public position 30.

**Unknown:** no live multi-host restart, hostile adapter, or external-effect recovery test was run in this audit. Nothing here upgrades Drover to an operational or comparative claim.

## Chapter 29 · Provider-native custody and permissioned context

### Verified mechanisms

Current [Xirp overview documentation](https://backstage.spotify.com/docs/xirp) describes a macOS beta that runs Claude Code, Codex, or Gemini in persistent native terminal sessions, organizes local projects and Git worktrees, and leaves agent authentication and configuration with each native CLI. The [session contract](https://backstage.spotify.com/docs/xirp/sessions) distinguishes working, idle, waiting, finished, and failed process states; it also warns that native bypass or autonomous modes retain their own file, shell, network, sandbox, and permission implications.

[Xirp and Portal](https://backstage.spotify.com/docs/xirp/xirp-and-portal) keeps local execution optional and separate from shared organizational context. A Portal-launched session may resolve a repository, request selected Workspace material through MCP, and later upload an eligible transcript. The [launch and upload guide](https://backstage.spotify.com/docs/xirp/workspaces/launching-sessions) states that upload is manual, that the transcript is not scrubbed or redacted, and that Workspace context does not override the coding agent's native permission, sandbox, model, or credential contract.

The current `0.19.1` changelog adds two instructive drift points. Version `0.18.1` introduced workflow labels such as backlog, in progress, in review, or done while separately fixing sessions that remained visually “Working” and Codex resume paths whose tool-call records had lost evidence. These are product fixes, not proof of correctness, but they expose the exact lesson: projected workflow state and native execution evidence can disagree.

### Public-safe teaching synthesis

Use a capability-difference matrix before offering common controls. A normalized state should retain:

- provider and version;
- native process or session state;
- supported interrupt, approval, steer, resume, and fork actions;
- durable transcript and recovery semantics;
- the fallback classification when the provider lacks a requested action.

Treat shared context as an optional adapter with its own identity, purpose, membership, provenance, retention, and upload rules. A common surface can make heterogeneous sessions easier to supervise; it cannot manufacture semantic parity. Git worktrees separate checkouts, not processes, credentials, ports, networks, or remote effects.

### Rejected or unknown

- Reject any hidden-implementation claim, competitive benchmark, reverse-engineered behavior, or claim that one beta UI proves provider-neutral execution.
- Backstage OSS is adjacent evidence, not a source for deployed Portal internals.
- Product status does not prove task completion, verification, merge, deployment, or user acceptance.
- Current docs do not establish complete redaction, deletion, telemetry, durability, or service-level guarantees.

## Chapter 30 · Validation contracts and repository delivery

### Verified mechanisms

Factory's current [Missions overview](https://docs.factory.ai/missions/overview) presents a bounded, multi-feature workflow with an approved plan, features, milestones, skills, an orchestration surface, steering, and validation. The [planning guide](https://docs.factory.ai/missions/planning) says milestones determine validation frequency and that useful validation depends on a reproducible way to start, drive, and observe the application.

GitHub's current agent documentation presents a different contract: task intake through an issue or prompt, work on a branch, a pull request, logs and review, comments for iteration, repository policy, security checks, and human-controlled delivery. GitHub's [third-party coding-agent page](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents) also makes the provider a selectable executor inside GitHub's repository workflow, rather than evidence that every provider shares one runtime.

### Public-safe teaching synthesis

Model at least three independent state machines for one software change:

1. **work contract** — objective, constraints, milestones, and validator disposition;
2. **repository delivery** — branch, checks, review, merge authority, and provenance;
3. **external responsibility** — deployment, migration, remediation, communication, or other outcome outside the pull request.

A validator can confirm the admitted mission while review still requests changes. A merge can succeed while the external remediation remains open. Preserve the evidence for each state and name which actor may waive, retry, reopen, or accept each gate.

### Rejected or unknown

- `confirmed`, green CI, reviewer approval, and merged are not synonyms.
- The public sources do not expose proprietary scheduler, memory, recovery, or effect-replay internals.
- Factory's recommendation about repository readiness is product guidance, not an independently validated universal threshold.
- Repository delivery is an unusually strong software-work boundary; it should not be imposed unchanged on research, communication, or physical-world work.

## Chapter 31 · The verification plane

### Verified mechanisms

Devin's [testing workflow](https://docs.devin.ai/work-with-devin/testing-and-recordings) separates environment setup, a focused test plan, execution, and a reviewable video artifact. The same page explicitly positions the recording as a focused sanity check rather than exhaustive coverage. [Session Insights](https://docs.devin.ai/product-guides/session-insights) analyzes completed sessions and may propose improvements, but it is an on-demand product analysis rather than an independent outcome oracle.

Greptile's TREX documentation adds runtime evidence—logs, screenshots, traces, scripts, API output, and video—to a pull-request finding. Greptile reports that this catches more bugs than review alone; that number remains **Reported** because the benchmark was not rerun.

CodeRabbit's current pre-merge contract exposes `passed`, `warning`, `error`, and `inconclusive`; an error can block when the request-changes workflow is enabled. A reviewer may explicitly ignore a failure, which marks the result ignored, scopes the override to the pull request, and can record who exercised it. Qodo's current Qodo 2 documentation describes multiple specialized review agents and organizational context. The public PR-Agent repository remains a separate legacy/community line and cannot prove those commercial internals.

### Public-safe teaching synthesis

Separate five roles:

- executor produces the candidate change;
- evidence producer observes static or runtime facts;
- verifier compares evidence with a versioned contract;
- policy determines whether promotion is allowed;
- authorized reviewer accepts, overrides with a receipt, requests repair, or leaves the result unresolved.

Preserve disagreement instead of forcing one score. `confirmed`, `refuted`, `inconclusive`, `blocked`, and `overridden` should retain evidence and evaluator identity. Measure false positives, missed defects, human correction, time-to-understanding, and evidence completeness—not comment volume.

### Rejected or unknown

- A video demonstrates a path; it does not prove absence of defects.
- A static repository graph may be stale, and several model reviewers may share blind spots.
- A policy check written in natural language can be incomplete or wrong even when its enforcement mechanism works.
- Do not transfer PR-Agent source behavior to Qodo 2, and do not describe any vendor as best or state of the art.

## Chapter 32 · A bounded whole-product workflow

### Required clean-room correction

The private manuscript's whole-product case cannot become a public chapter. Replace it with a public workflow whose sources, limits, and artifacts can be inspected without exposing private design or user information.

The strongest already-manifested candidate is the MIT-licensed [`ai-job-search` v1.6.0 release](https://github.com/MadsLorentzen/ai-job-search/tree/ab91c60cc47147d9416f0af758fb5e2d109956ce). Its public README documents a source-of-truth profile, untrusted job-posting input, a drafter/reviewer split, compiled document inspection, PDF text-layer checks, approval before tracker changes inferred from email, draft-only follow-up, and explicit application outcomes. It also warns that personal profile material must not be committed to a public fork and that instruction-level prompt-injection defenses are not a sandbox.

### Public-safe teaching synthesis

Abstract the case into a **bounded document-submission workflow**:

```text
private source-of-truth records
→ untrusted opportunity input
→ eligibility and claim check
→ draft artifact
→ fresh review
→ deterministic render and text-layer checks
→ human submission authority
→ external response evidence
→ accepted outcome, follow-up, rejection, or conscious release
```

The useful lesson is not how to automate applications. It is that one product flow can join privacy, untrusted input, maker/checker review, deterministic artifact verification, human-controlled external action, and a durable outcome ledger without treating draft completion as real-world success.

### Rejected or unknown

- Do not include real résumés, identities, emails, salary data, application records, or personal outcome history in examples or tests.
- Do not present the author's outcome narrative as causal evidence.
- Do not teach automatic submission, terms-of-service bypass, or high-volume portal automation.
- A fresh model reviewer is not automatically independent if it receives only the drafter's framing.
- The workflow is not a complete general agent runtime; its public value is the bounded cross-surface contract.

## Chapter 33 · Model × harness evaluation

### Verified mechanisms

Cursor's [2026-04-30 engineering article](https://cursor.com/blog/continually-improving-agent-harness) explicitly treats model and harness together. It describes offline evaluation, online experiments, keep rate, user-response signals, per-tool and per-model error classification, and provider-shaped tools and prompts. Cursor's operational results and internal datasets are first-party reports, not independently reproduced evidence.

NIST's [evaluation-cheating guidance](https://www.nist.gov/caisi/cheating-ai-agent-evaluations) documents two validity failures: solution contamination and grader gaming. It recommends transcript review, closing task loopholes, and standardizing the affordances and restrictions under which agents are compared.

### Public-safe teaching synthesis

The evaluated unit is a configuration:

```text
model revision
× harness commit
× instruction bundle
× tool and capability manifest
× environment image
× task-set version
× evaluator and rubric revision
× retry, budget, and sampling policy
```

Use factorial comparisons where affordable, then ablate the candidate mechanism. Pre-register exclusions and promotion thresholds. Report task success, invalid effects, retries, recovery, cost, latency, evidence quality, policy violations, and human review burden. Retain crashes and discarded trials.

Distinguish the construct—such as safe task completion—from its operationalization—such as tests, keep rate, or model-judged satisfaction. An improved metric can reflect a changed retry budget, leaked solution, weakened fixture, or edited judge rather than a better harness.

### Rejected or unknown

- Keep any numeric example explicitly synthetic unless linked to a released fixture and result ledger.
- Do not compare model names without exact revisions and harness configurations.
- Do not generalize an interaction observed for one provider, task distribution, or evaluator.
- Model-judge agreement does not establish correctness for consequential effects.

## Chapter 34 · Outcome, trajectory, and conformance

### Verified mechanisms

NIST's ongoing [evaluation-probes project](https://www.nist.gov/programs-projects/building-evaluation-probes-agentic-ai) separates source-grounding checks into structured rubrics and machine-readable audit trails. Its demonstration checks faithfulness, completeness, and sufficiency against trusted documents. W3C [Trace Context](https://www.w3.org/TR/2021/REC-trace-context-1-20211123/) standardizes cross-component trace correlation but does not define the application events needed to prove an agent outcome.

### Teaching synthesis

Use three complementary lenses:

- **outcome** — did the intended state exist?
- **trajectory** — did the system stay within permitted methods and authority?
- **conformance** — did named runtime contracts hold regardless of task quality?

Treat proof levels as typed claims: architecture specified, contract defined, module implemented, adapter conformance passed, cross-surface acceptance passed, and operationally observed. This ladder is an original course instrument, not a published standard.

Conformance rules should target invariants and forbidden transitions rather than one reference chain-of-thought. Examples include intent preceding dispatch, a stale fence being rejected, effective tools matching admitted grants, evidence references resolving, and an evaluator using the locked contract. A novel but valid trajectory should pass.

### Rejected or unknown

- A trace identifier is correlation, not evidence that every meaningful action was recorded.
- A conformance suite can be green while the contract omits the real risk.
- A unit test cannot be promoted into production reliability, and a screenshot cannot prove durable recovery.
- Outcome correctness does not excuse an unauthorized trajectory.

## Chapter 35 · Failure injection and recovery evaluation

### Verified mechanisms

At current Temporal documentation commit [`991215d`](https://github.com/temporalio/documentation/blob/991215d86325c2b62126afa4d3339be5f5ea0169/docs/encyclopedia/workflow/workflow-execution/event.mdx), Workflow Event History remains a durable append-only event log. The matching [workflow-execution page](https://github.com/temporalio/documentation/blob/991215d86325c2b62126afa4d3339be5f5ea0169/docs/encyclopedia/workflow/workflow-execution/workflow-execution.mdx) states that workers replay recorded history after failures. This establishes reconstructable workflow state, not arbitrary external-effect exactly-once behavior.

AWS's [idempotent API guidance](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) and [transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html) support stable business-request identity and atomic local state-plus-intent. They also leave provider lookup, semantic equivalence, late arrival, and external reconciliation to the application contract.

### Public-safe teaching synthesis

Predeclare the expected canonical state, forbidden action, evidence source, recovery owner, and maximum uncertainty for every fault. Test at least:

- crash before and after admission;
- crash after durable intent but before I/O;
- lost response after a provider commit;
- stale owner after lease takeover;
- duplicate event or callback delivery;
- corrupted or older checkpoint;
- revocation during queued or active work;
- cancellation while an effect remains ambiguous;
- checker outage or disagreement;
- missing evidence artifact;
- poisoned retained procedure or memory;
- cross-principal retrieval attempt;
- a projection that labels an inconclusive result complete.

Recovery may end in `correlation_probable`, `artifact_missing`, `manual_reconciliation_required`, or another explicit degraded state. Honest uncertainty is a passing behavior when the source system cannot prove more.

### Rejected or unknown

- The matrix is a proposed test suite, not a set of documented production incidents.
- “No exception” is not a recovery assertion.
- A replayable local workflow does not make a non-idempotent provider call safe.
- Fault injection against real consequential systems requires synthetic accounts, bounded environments, and explicit authority; none was performed here.

## Chapter 36 · Harness learning, promotion, and retirement

### Verified mechanisms

At [`228791f`](https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md), AutoResearch fixes its evaluation function and five-minute training budget, records experiments, advances improvements, and resets worse or failed changes. The project itself warns that results depend on local compute and uses one validation metric. This is a clear experiment ratchet with a deliberately narrow objective.

Current AutoContext source at [`c14d935`](https://github.com/greyhaven-ai/autocontext/tree/c14d93560e679bddc4320e4174b8effda0804ff3) publicly describes trace, report, playbook, dataset, candidate, promotion, active-context, durable-operation, and capability-scoped execution artifacts. The exact current packaging boundary is split: PyPI `autocontext` and npm `autoctx` latest were `0.17.0`, while the inspected source tree identifies the TypeScript package as `0.17.1`. Claims about transfer, accelerator results, or causal attribution remain project reports until reproduced.

The AHE paper reports component, experience, and decision observability with falsifiable edit predictions. The newer [Harness Updating Is Not Harness Benefit](https://arxiv.org/abs/2605.30621v1) paper supplies an important counterpressure: producing a persistent harness update and benefiting from that update are separate capabilities. Both empirical result sets remain author-reported here.

### Public-safe teaching synthesis

Harness improvement is a second, higher-authority loop:

```text
failure evidence
→ bounded hypothesis
→ candidate change
→ locked evaluation
→ held-out confirmation and ablation
→ review
→ scoped promotion
→ monitoring
→ expansion, rollback, or retirement
```

Keep candidate surfaces editable and evaluator, safety floor, incident corpus, authority rules, and release policy protected. Record the predicted mechanism before the result. Preserve negative experiments. Promote through a bounded cohort with an explicit prior version and rollback target. Freeze admitted semantics for in-flight work unless a safety revocation requires cancellation.

Retirement is first-class. A planning scaffold or repair wrapper may help an older model and later add cost or error. Governance-bearing controls—authority, revocation, evidence, and external-effect reconciliation—do not become unnecessary merely because a model reasons better.

### Rejected or unknown

- Strict improvement on one metric or held-out set can still overfit the instrument or omit critical harms.
- The optimizer must not edit its judge, exclusions, safety floor, or evidence retention during the same run.
- AutoResearch's indefinite loop and destructive reset are domain-specific instructions, not a general agent operating policy.
- No paper or repository in this audit establishes universally self-improving, safe, or state-of-the-art harness evolution.

## Chapter 37 · Twelve labs

### Teaching synthesis

Keep the cumulative sequence already established by the public guide: context, capability, environment, durable state, bounded control, identity, idempotent effects, journal and outbox, maker/checker verification, graph conversion, model × harness ablation, and an evidence inspector.

Each lab should include:

- one known-good and one known-bad fixture;
- expected canonical facts and forbidden transitions;
- a locked evaluator outside the learner-editable surface;
- a failure injection after the new responsibility is introduced;
- a privacy-minimized evidence bundle;
- a reflection that separates model, retrieval, policy, environment, and evaluator failure.

Two accumulated lessons improve the course without adding product tours:

1. **Skill admission:** inspect one harmless third-party skill as executable supply chain. Resolve owner, exact revision, license, scripts, references, network and file authority, deterministic checks, and revocation before use.
2. **Retrieval versus browser execution:** fetch over HTTP when interaction is unnecessary; use a browser only for rendering or interaction that the task requires. Browser profiles, uploads, downloads, credentials, and consequential clicks need explicit custody and postcondition checks.

### Unknown

The twelve-lab order is a proposed pedagogy. No learner study has established that it is optimal, that twelve is the right count, or that success transfers across domains. Treat lab results as evidence for the exercised configuration only.

## Chapter 38 · Capstone

### Teaching synthesis

Use a fully generic unreliable provider. It must support stable request keys, commit with lost response, explicit rejection, conflicting duplicate key, delayed callback, lookup outage, and eventual state query. The learner may choose a repository pull request, reservation, or another reversible synthetic domain, but the evaluator—not the prose—defines the behavior.

Required path:

```text
admitted objective and authority
→ durable work and effect intent
→ bounded agent proposal
→ provider accepts while response is lost
→ explicit ambiguous state
→ process crash
→ fresh-process replay
→ provider lookup by stable request key
→ evidence bundle
→ independent locked verifier
→ policy disposition
→ owner acceptance, rejection, deferral, or open follow-up
```

The capstone should fail on cross-principal access, an unrecorded external write, blind retry after ambiguity, stale-owner commit, evaluator self-modification, or false closure even if its aggregate score is high.

### Unknown

This chapter remains a design until the repository ships an executable provider simulator, fixtures, evaluator, reference trace, and reproducible result. A diagram and prose walkthrough do not establish capstone completion.

## Chapter 39 · Review questions and design worksheet

### Teaching synthesis

End the public sequence with a scenario-led review rather than a component inventory. Start with one concrete responsibility and walk:

1. objective and principal;
2. source and authority of context;
3. effective capabilities and denied paths;
4. first consequential effect;
5. lost response after possible commit;
6. crash, replay, stale owner, and revocation;
7. evidence available to an independent verifier;
8. policy disposition and override authority;
9. user acceptance, transfer, deferral, release, or re-entry;
10. current proof level and the next falsifying fixture.

Extend the existing worksheet with memory and learning fields:

```yaml
memory_sources: []
memory_authority_ceiling:
valid_time_and_record_time:
candidate_promotion_rule:
correction_and_invalidation_path:
deletion_and_derived_copy_path:
procedure_evaluator:
promotion_and_rollback_owner:
```

This worksheet is an original design instrument. It should permit several valid implementations and should never require disclosure of hidden reasoning. Review the observable facts, artifacts, actions, state transitions, evidence, and authority decisions.

## Chapter 40 · Source maintenance as the publication harness

The final manuscript chapter turns source maintenance into both a public lesson and repository operating policy.

Use this promotion path:

```text
discovery feed
→ canonical owner
→ exact release or commit
→ inspected paths
→ license and use boundary
→ observations, reports, inferences, and unknowns
→ falsifiers
→ public source record
→ independent claim review
→ immutable revision manifest
```

Curated lists, social posts, and private dossiers are discovery inputs. They are not evidence for implementation behavior. When upstream changes, append a new source snapshot and revision; do not silently rewrite what an earlier immutable revision claimed. Keep corrections typed and visible. Every strong product or architecture claim should resolve to the source that owns it.

A release gate for these chapters should confirm:

- exact source boundaries and retrieval dates;
- public-safe original prose and diagrams;
- vendor numbers labeled **Reported** unless reproduced;
- no private repository paths, product internals, user data, or personal examples;
- no legacy OSS claim transferred to a current proprietary product;
- licenses reviewed per artifact rather than per organization;
- proposed, implemented, conformance-passed, accepted, and operational claims kept distinct;
- historical manifests remain byte-stable;
- links, no-JavaScript rendering, accessibility, print output, metadata, RSS, and sitemap pass the normal release gate.

## Manuscript corrections to apply before drafting

1. Do not recreate Drover; it is manuscript Chapter 28 at public sequence position 29.
2. Map manuscript Chapters 29–40 to public sequence positions 30–41 because the short guide occupies position 1.
3. Publish source maintenance as Chapter 40 and apply the same rules to study-guide and repository operations.
4. Replace the private whole-product case with the public bounded workflow abstraction.
5. Update Xirp to documented beta `0.19.1` and include the workflow-status versus evidence-repair lesson.
6. Keep Factory validation, repository delivery, external remediation, and acceptance as separate state machines.
7. Keep PR-Agent `v0.43.0` separate from Qodo 2; never infer one from the other.
8. Replace generic “independent reviewer” language with evidence, evaluator input, authority, disagreement, and override contracts.
9. Add NIST's evaluation-cheating boundary to model × harness evaluation.
10. Label the proof ladder, three-lens evaluation, labs, capstone, and worksheet as teaching syntheses rather than standards.
11. Add the distinction between harness-update capability and harness-benefit capability to the learning chapter.
12. Remove or mark every numeric example as synthetic unless a released fixture, configuration, and result ledger supports it.
13. Carry memory engineering into the later chapters only through authority, candidate promotion, correction, deletion, prospective re-entry, and operational evaluation—not as a second framework catalogue.
14. Make no SOTA, best, production-ready, or general-superiority claim from this corpus.

## Exact public primary-source reading list

### Provider-native custody

- [Xirp overview](https://backstage.spotify.com/docs/xirp)
- [Xirp sessions](https://backstage.spotify.com/docs/xirp/sessions)
- [Xirp and Portal](https://backstage.spotify.com/docs/xirp/xirp-and-portal)
- [Launch and share sessions](https://backstage.spotify.com/docs/xirp/workspaces/launching-sessions)
- [Xirp changelog](https://backstage.spotify.com/docs/xirp/changelog)
- [Backstage OSS v1.54.5](https://github.com/backstage/backstage/tree/29330a97934f04b5ea4ce8f8219903f1f22402ff)

### Validation, delivery, and verification

- [Factory Missions](https://docs.factory.ai/missions/overview)
- [Factory planning and validation](https://docs.factory.ai/missions/planning)
- [Use Copilot agents](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents)
- [GitHub third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents)
- [Devin testing and recordings](https://docs.devin.ai/work-with-devin/testing-and-recordings)
- [Devin Session Insights](https://docs.devin.ai/product-guides/session-insights)
- [Introducing TREX](https://www.greptile.com/blog/trex)
- [Building TREX](https://www.greptile.com/blog/trex-code-execution)
- [CodeRabbit pre-merge checks](https://docs.coderabbit.ai/pr-reviews/pre-merge-checks)
- [Qodo 2 code review](https://docs.qodo.ai/code-review)
- [PR-Agent v0.43.0](https://github.com/qodo-ai/pr-agent/tree/4ebd5c5333c6ef21509e7304d27969eb825e6f22)

### Whole-product workflow

- [`ai-job-search` v1.6.0](https://github.com/MadsLorentzen/ai-job-search/tree/ab91c60cc47147d9416f0af758fb5e2d109956ce)
- [Security boundary at v1.6.0](https://github.com/MadsLorentzen/ai-job-search/blob/ab91c60cc47147d9416f0af758fb5e2d109956ce/SECURITY.md)

### Evaluation, recovery, and learning

- [Cursor: Continually improving our agent harness](https://cursor.com/blog/continually-improving-agent-harness)
- [NIST: Cheating on AI Agent Evaluations](https://www.nist.gov/caisi/cheating-ai-agent-evaluations)
- [NIST: Building Evaluation Probes into Agentic AI](https://www.nist.gov/programs-projects/building-evaluation-probes-agentic-ai)
- [NIST AI RMF 1.0](https://doi.org/10.6028/NIST.AI.100-1)
- [W3C Trace Context](https://www.w3.org/TR/2021/REC-trace-context-1-20211123/)
- [Temporal current Event History documentation](https://github.com/temporalio/documentation/blob/991215d86325c2b62126afa4d3339be5f5ea0169/docs/encyclopedia/workflow/workflow-execution/event.mdx)
- [Temporal current Workflow Execution documentation](https://github.com/temporalio/documentation/blob/991215d86325c2b62126afa4d3339be5f5ea0169/docs/encyclopedia/workflow/workflow-execution/workflow-execution.mdx)
- [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
- [AWS: Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [AutoResearch at `228791f`](https://github.com/karpathy/autoresearch/tree/228791fb499afffb54b46200aca536f79142f117)
- [AutoContext at `c14d935`](https://github.com/greyhaven-ai/autocontext/tree/c14d93560e679bddc4320e4174b8effda0804ff3)
- [Agentic Harness Engineering](https://arxiv.org/abs/2604.25850v4)
- [Harness Updating Is Not Harness Benefit](https://arxiv.org/abs/2605.30621v1)

## Remaining unknowns

- Proprietary product documentation does not expose complete durability, recovery, sandbox, telemetry, deletion, or evaluation internals.
- No vendor benchmark or paper result in this audit was rerun under one common protocol.
- No live external-effect ambiguity, stale-owner, revoked-credential, corrupt-checkpoint, or cross-principal fixture was executed.
- The bounded workflow case was source-inspected but not run with synthetic personal data.
- The twelve-lab order and capstone rubric have not been validated with learners.
- Current default branches can move after the recorded commits; future publication must retain immutable release pins and repeat the relevant path inspection.
- The proposed public sequence mapping needs to be enforced consistently in article frontmatter, navigation, metadata, RSS, sitemap, revision records, tests, and the public study guide.

## Audit disposition

The remaining sequence is ready for clean-room drafting after the numbering correction. Chapters 29–32 are the case-study batch; Chapters 33–36 cover evaluation and evolution; Chapters 37–40 cover course practice and publication maintenance. Strong claims remain bounded to the linked revisions, reported performance remains reported, and no SOTA claim should be made.
