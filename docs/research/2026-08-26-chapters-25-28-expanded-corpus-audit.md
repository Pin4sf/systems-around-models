# Chapters 25–28: expanded clean-room corpus audit

Validated: 2026-08-26 (Asia/Kolkata)

## Purpose and method

This audit expands the source base behind the four released case studies without importing private product material into the public book. Twenty-three high-value Markdown records were inventoried across canonical manuscripts, memory and harness study guides, repository deep-dives, comparative analyses, adoption-boundary notes, and build-readiness audits. Duplicate worktree snapshots, application-specific implementation plans, private links, user data, and proprietary terminology were excluded.

The private corpus was used only to generate questions. Every retained teaching below is restated independently and checked against a public first-party repository, package manifest, release tag, or official documentation. No upstream installer, package script, test suite, hosted deployment, or application was run.

Evidence labels:

- **Verified** — directly rechecked at the immutable public revision linked here.
- **Adopted** — included in the second public revision prepared by this branch.
- **Deferred** — public-safe material intentionally left for a later revision or another chapter.
- **Unverified** — requires a live failure experiment, deployment, or independent benchmark.

## Corpus inventory

| Corpus category | Records reviewed | Distinct value retained | Material deliberately excluded |
| --- | ---: | --- | --- |
| Canonical study guides | 2 | Course vocabulary; the Chapters 25–28 teaching arc; facts versus projections; provenance; correction; operational traces | Private product case material and application-specific architecture |
| Release and repository deep-dives | 5 | QM; Project Think; an adjacent capability-sandbox case; DeepSeek Harness/Cordis; Drover | Private deployment assumptions and internal adoption plans |
| Mechanism and boundary analyses | 5 | Effective capability views, policy floors, lifecycle ownership, causal commit, host custody, evidence grades, and quiescent updates | Proposed private interfaces and repository-specific implementation sequences |
| Cross-harness comparisons and benchmark indexes | 3 | Adapter honesty, runtime-versus-fleet separation, facts-versus-views, conformance-first evaluation | Rankings, product positioning, and any implication of endorsement |
| Cloudflare evolution and readiness audits | 5 | Turn-entry choice, recovery ownership, scheduled-work semantics, workspace defaults, reasoning exposure, and action authorization | Stale pre-0.16 framework surfaces and private data-policy translations |
| General harness definition and DevX notes | 3 | Control plus leverage, interface independence, visible capability differences, and reconstruction as an operator feature | UI plans and implementation-specific inspector designs |

The useful corpus is convergent rather than additive. Several records rediscover the same rule with different nouns. The editorial job is to keep the most concrete mechanism and discard duplicated slogans.

## Current public revision register

The release pins below remain the correct mechanism boundary for the four essays. Default-branch heads are volatile and are included only to show where a fresh reinspection would begin.

| System | Released mechanism pin | Default branch observed 2026-08-26 | Package boundary |
| --- | --- | --- | --- |
| QM | [`v0.1.5` at `d931fe963de3ac20b9a7526ea9a4873c0d8ed18e`](https://github.com/yc-software/qm/tree/d931fe963de3ac20b9a7526ea9a4873c0d8ed18e) | [`main` at `c7caba56cf0e6c7bd4fa7c0236ae1250b0f631f5`](https://github.com/yc-software/qm/commit/c7caba56cf0e6c7bd4fa7c0236ae1250b0f631f5) | npm latest is `@yc-software/qm` 0.1.5; current-main CLI manifest says 0.1.6, so 0.1.6 is not a released chapter boundary |
| Cloudflare Agents + Think | [`agents@0.21.0` and `@cloudflare/think@0.16.0` peeled to `d42494503efe836a073fbf911fae1fbd12253198`](https://github.com/cloudflare/agents/tree/d42494503efe836a073fbf911fae1fbd12253198) | [`main` at `f08ee06fd610756de0d8abf539dfe9b746bdd7c5`](https://github.com/cloudflare/agents/commit/f08ee06fd610756de0d8abf539dfe9b746bdd7c5) | npm latest remains `agents` 0.21.0 and `@cloudflare/think` 0.16.0 |
| DeepSeek Harness | [`dsh-v0.1.1-rc.2` at `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e`](https://github.com/deepseek-ai/deepseek-harness/tree/b150a551b8d465e31e418e1b2eaf5e79bbb7d28e) | Default `master` is the same commit | npm latest is `@deepseek-ai/dsh` 0.1.1-rc.2; the inspected tree vendors `@deepseek-ai/cordis` 4.0.1 |
| Standalone Cordis | No repository tag observed; inspect [`8cc9e33fab69e2d0476d126baaf2acb24e6a6ab4`](https://github.com/cordiverse/cordis/tree/8cc9e33fab69e2d0476d126baaf2acb24e6a6ab4) separately | Default `main` is the same commit | npm latest `cordis` is 4.0.0-rc.8; it is related evidence, not the vendored DeepSeek artifact |
| Drover | [`v0.3.7` peeled to `81b344d025a7850d5697a7c19468ca8fd95e909e`](https://github.com/arniesaha/drover/tree/81b344d025a7850d5697a7c19468ca8fd95e909e) | [`main` at `59060976d37f25cadf21dd9090faf15fa1694b2a`](https://github.com/arniesaha/drover/commit/59060976d37f25cadf21dd9090faf15fa1694b2a) | Current project manifest still says 0.3.7; the official GitHub release asset, not the unrelated PyPI name, is the distribution authority |

`git ls-remote` was used to recheck each default branch and tag. Annotated tags are linked by their peeled commit because that is the source tree the chapter describes.

## Chapter 25 · QM

### What the released essay already covers

The current essay correctly teaches:

- typed resource identities and personal/shared scopes;
- one evaluated authority view for an attempt;
- monotonic policy floors;
- leased work with heartbeats, attempts, and a per-session running constraint;
- the distinction between audit evidence and preventive control;
- the declared early, single-organization trust boundary;
- recovery ambiguity for external effects.

Those are the right center of gravity. The essay should not become a tour of every QM surface.

### Adopted teaching: make adapter capability a precondition

**Verified.** QM's release-pinned [`HarnessAdapterProfile`](https://github.com/yc-software/qm/blob/d931fe963de3ac20b9a7526ea9a4873c0d8ed18e/src/harness/harness.ts) records control transport, tool transport, transcript format, and capabilities including abort, steer, images, thinking level, fast mode, and provider sessions. The [`harness router`](https://github.com/yc-software/qm/blob/d931fe963de3ac20b9a7526ea9a4873c0d8ed18e/src/harness/harness-router.ts) resets incompatible provider-session state when a session switches harness.

**Adopted in revision 2.** The chapter now adds one short section after policy composition:

> A tool or provider name is not enough to admit work. The attempt should require a capability profile: how control travels, how tools travel, whether steering and cancellation exist, what transcript format is durable, and whether provider-session continuity survives a switch. If the required capability is missing, reject or record a visible fallback before enqueueing.

This sharpens the existing adapter-parity paragraph. It also makes the study-guide exercise mechanical: intersect adapter capabilities, computer resources, principal grants, task grants, and current policy, then store the resulting view with the attempt.

### Adopted teaching: replay coordinates are bounded evidence

**Verified.** The release-pinned [`tool context`](https://github.com/yc-software/qm/blob/d931fe963de3ac20b9a7526ea9a4873c0d8ed18e/src/tools/primitives.ts) consults a tool ledger by run, attempt, and call index. The [`Postgres run store`](https://github.com/yc-software/qm/blob/d931fe963de3ac20b9a7526ea9a4873c0d8ed18e/src/runs/postgres-run-store.ts) persists leases, attempts, deduplication keys, delivery state, and indexed tool-call outputs.

**Adopted in revision 2.** The lease section now clarifies that a replay coordinate can reuse a recorded result inside its defined attempt semantics, but cannot prove that an unrecorded external effect happened zero or one times.

### Claims that remain unverified

- Adapter profiles have not been independently tested for semantic parity across all supported harnesses.
- Scoped resources have not been independently subjected to cross-scope non-interference tests.
- A worker crash after an external send but before durable result recording has not been reproduced here.
- No public benchmark establishes QM as state of the art in security, durability, agent quality, or fleet operations.

### Revision 2 disposition

Added the capability-profile section and narrow replay qualification. The current release and trust-boundary framing remain; onboarding, memory-product, app-publishing, and deployment-tour material remain excluded because they would blur the central teaching.

## Chapter 26 · Cloudflare Think and Agents

### What the released essay already covers

The current essay correctly separates the Durable Object substrate from the Think harness and covers:

- one Durable Object as a logical coordination home;
- logical sub-agent state versus shared physical placement and alarms;
- fibers, durable submissions, recovery, and cooperative cancellation;
- tree sessions and non-destructive compaction;
- experimental Actions and Channels;
- opt-in Action authorization and explicit idempotency keys;
- the difference between runtime recovery and external-effect correctness.

This is a strong mechanism-level account. The largest omission is not another platform primitive; it is the policy significance of Think's defaults and entry paths.

### Adopted teaching: defaults are product policy

**Verified.** At the 0.16.0 release pin, the [`Think package documentation`](https://github.com/cloudflare/agents/blob/d42494503efe836a073fbf911fae1fbd12253198/packages/think/README.md) says every Think agent receives a SQLite-backed workspace and model-visible workspace tools. The `bash` tool is included by default, implemented through `just-bash`, and starts with network disabled unless configured otherwise. The same release documentation records `sendReasoning = true`, `workspaceBash = true`, and `chatRecovery = true` as defaults.

**Adopted in revision 2.** The new “Treat defaults as admitted capabilities” section establishes that:

- workspace and shell access are capabilities, not conveniences;
- reasoning chunks sent to clients are a disclosure choice, not harmless rendering;
- automatic chat recovery creates an application responsibility to classify external effects before continuation;
- a per-turn override should narrow policy, never silently enlarge it.

The teaching is not “these defaults are unsafe everywhere.” It is “framework defaults are part of the effective policy and must be visible in the attempt manifest.”

### Deferred teaching: choose a turn-entry contract

**Verified.** The release-pinned [Think overview](https://github.com/cloudflare/agents/blob/d42494503efe836a073fbf911fae1fbd12253198/docs/think/index.md) distinguishes direct turns, programmatic submission, schedules, fibers, workflows, and sub-agent RPC. The [durable-execution contract](https://github.com/cloudflare/agents/blob/d42494503efe836a073fbf911fae1fbd12253198/docs/agents/durable-execution.md) makes cancellation cooperative and separates `runFiber` from durable acceptance via `startFiber`. Think's scheduled-task documentation says occurrence delivery is at least once and supplies occurrence/idempotency keys for application deduplication.

**Deferred.** A future revision could add one compact decision table or paragraph:

| Trigger shape | Mechanism to inspect | Application obligation |
| --- | --- | --- |
| Interactive streamed turn | chat/direct turn | client disconnect, partial stream, and recovery UX |
| Webhook or RPC work that must survive disconnect | durable submission | stable submission identity and later status inspection |
| Scheduled occurrence | scheduled durable submission | late-fire/coalescing policy and occurrence-level idempotency |
| Multi-step platform workflow | workflow | step boundaries and external-effect reconciliation |
| Parent-to-child delegated turn | sub-agent RPC | child identity, cancellation, replay, and parent accountability |

This adds engineering judgment without reviving the framework and CLI surfaces removed in Think 0.16.

### Adopted teaching: workspace state is not authority

**Verified.** Think's built-in workspace is a virtual filesystem backed by Durable Object SQLite. Its model tools include read, write, edit, list, find, grep, delete, and optional bash. Network can be kept absent or explicitly granted. This is useful structural containment, but neither a file's presence nor a binding's availability establishes current authorization.

**Adopted in revision 2.** The defaults section now states that context blocks, workspace files, and compacted history are available state with lineage, not policy grants created by recovery.

### Claims that remain unverified

- No live eviction, alarm, reconnect, or durable-submission experiment was run.
- Action ambiguity after an isolate failure was not reproduced against a real external provider.
- Placement, scale, latency, cost, data location, and deletion behavior remain platform and deployment questions.
- Sub-agent colocation does not establish an independent physical failure domain.
- Cloudflare's scale, token, or cost statements remain vendor-reported unless the exact benchmark is independently reproduced.
- No state-of-the-art claim is supported.

### Revision 2 disposition

Added the defaults-as-policy section and ownership-scoped idempotency boundaries. The turn-entry table remains deferred to keep the chapter readable. Code Mode, self-authored extensions, and the adjacent capability-sandbox product remain outside this chapter; earlier preview-era descriptions are not a safe substitute for Think 0.16 behavior.

## Chapter 27 · DeepSeek Harness and Cordis

### What the released essay already covers

The current essay correctly teaches:

- event-derived model requests;
- bounded overlap with model-order commit and exclusive barriers;
- explicit cancellation and structural repair of interrupted tails;
- ambiguity when a started tool has no durable outcome;
- lifecycle-owned registrations and reverse-order disposal within an effect chain;
- the difference between in-process cleanup and external-effect rollback;
- the exact vendored Cordis boundary versus the standalone project.

This is already the most causally precise of the four essays.

### Adopted teaching: configuration is executable architecture

**Verified.** The release-pinned [architecture document](https://github.com/deepseek-ai/deepseek-harness/blob/b150a551b8d465e31e418e1b2eaf5e79bbb7d28e/docs/architecture.md) defines ordered profile/bundle layers. Patches target stable row IDs and replace a row's whole configuration or insert a new row. The effective boot tree can be printed with `--dump-config`.

**Adopted in revision 2.** The chapter now adds this teaching before lifecycle ownership:

> The effective runtime is a compiled artifact. Ordered bundles and whole-row patches produce one inspectable tree of models, tools, persistence, sandbox, approvals, credentials, and telemetry. Freeze that evaluated composition for an admitted request; mutable defaults and hot replacement should affect later requests, not alter the meaning of one already in flight.

The public teaching should emphasize inspectability and safe mutation boundaries, not the internal package count or configuration syntax.

### Adopted teaching: durable facts and live extension points are different

**Verified.** The same architecture document distinguishes durable session events from live capability and waterfall events. It states that anything reaching a model request must be reconstructable from the durable log. The release-pinned [`tool-call scheduler`](https://github.com/deepseek-ai/deepseek-harness/blob/b150a551b8d465e31e418e1b2eaf5e79bbb7d28e/packages/core/agent-loop/src/tool-calls.ts) allows policy preparation and bodies to overlap only within its stated ordering rules, then appends results in model order.

**Adopted in revision 2.** The profile section now names the boundary explicitly:

- a durable event is a reconstructable fact;
- a waterfall hook is a live interception seam;
- policy may rewrite or reject work before it becomes model-visible;
- any rewrite that changes the request must leave enough durable evidence to reproduce that request.

This is more precise than saying “the event log is truth.” It prevents a reader from treating every transient callback as a canonical record.

### Deferred teaching: one effective capability path

**Verified.** Tool schemas enter prompt assembly through the registered tool context, while tool preparation and dispatch flow through the scheduler seam. Later calls are reclassified after earlier ordered commits, so a registry change can form a new barrier without reordering already committed meaning.

**Deferred.** A later revision may connect visibility, preparation, dispatch, result finalization, and policy to the same evaluated registry. The falsifier is a hidden call path that can execute a capability not represented in the model-visible/effective tool view.

### Claims that remain unverified

- No live provider turn was reconstructed independently from the event stream in this audit.
- The cleanup model cannot prove a plugin's inverse is semantically complete.
- Developer-preview source does not establish multi-tenant isolation, hostile-plugin safety, production reliability, or upgrade compatibility.
- The standalone Cordis package is not evidence for the exact vendored `@deepseek-ai/cordis` behavior unless the implementations are compared at the relevant revisions.
- “Everything is a plugin” is a project thesis, not a comparative performance result or SOTA claim.

### Revision 2 disposition

Added “configuration is executable architecture” and the durable-versus-live distinction. The ordered-commit and crash-tail sections remain. Package inventory, product-mode tours, and generalized plugin praise remain excluded because they obscure the small number of testable invariants.

## Chapter 28 · Drover

### What the released essay already covers

The current essay correctly teaches:

- central routing versus host-local process and filesystem custody;
- host truth over stale central projections;
- normalized facts versus replaceable derived views;
- provenance on projections;
- stable event identities under retry;
- side-by-side verified installation;
- quiescence before activation and reconnect-failure rollback;
- the declared trusted single-operator/private-network boundary.

These are the right fleet-level lessons. The best remaining material concerns evidence fidelity, not another control-plane feature.

### Adopted teaching: normalize without inventing fidelity

**Verified.** The release-pinned [`StructuredMessage` driver](https://github.com/arniesaha/drover/blob/81b344d025a7850d5697a7c19468ca8fd95e909e/src/drover/server/harness/structured/driver.py) retains globally generated event IDs and degrades unparseable protocol output to `raw` rather than silently dropping it. The [DeepSeek adapter](https://github.com/arniesaha/drover/blob/81b344d025a7850d5697a7c19468ca8fd95e909e/src/drover/server/harness/structured/deepseek.py) documents that the consumed RPC history lacks a native turn identifier; it therefore uses sequence-position correlation within a controlled polling window.

**Adopted in revision 2.** The new compatibility-layer section establishes that:

- native turn identity is stronger than per-session sequence;
- per-session sequence is stronger than a positional polling window;
- raw fallback is preserved evidence of protocol drift, not parsed truth;
- the UI and downstream projections should retain the grade rather than render all observations as exact causality.

Raw fallback also creates a privacy and secret-retention obligation. Preserving source material is not permission to retain it indefinitely or expose it broadly.

### Adopted teaching: at-least-once delivery now crosses restart

**Verified.** The release-pinned [`EventPusher`](https://github.com/arniesaha/drover/blob/81b344d025a7850d5697a7c19468ca8fd95e909e/src/drover/server/harness/structured/pusher.py) retries batches and relies on central idempotency by event ID. It also reconciles durable host-registry events after an unexpected daemon restart by replaying them to the central receiver. The [context-store contract](https://github.com/arniesaha/drover/blob/81b344d025a7850d5697a7c19468ca8fd95e909e/docs/context-store.md) makes `dedup_key` the canonical logical identity for ingested evidence while retaining physical records for audit.

**Adopted in revision 2.** The delivery account now includes restart reconciliation from durable host events and retains the limit that delivery identity does not prove the native harness performed an external effect once.

### Deferred teaching: optional intelligence should fail softly

**Verified.** Drover's architecture separates append-oriented evidence from summaries, briefs, embeddings, and other rebuildable projections. The host daemon remains authoritative for live processes even when projections lag.

**Deferred.** A later revision may add a compact degraded-mode rule: search, summaries, and briefs can be unavailable or stale without changing underlying execution facts or host lifecycle state.

### Claims that remain unverified

- No live host registration, native session, event-gap replay, or restart reconciliation was run.
- Positional DeepSeek correlation was not compared with provider-native ground truth.
- Multi-host convergence, queue overflow, process recovery, upgrade activation, and reconnect rollback were not independently exercised.
- The single-operator trust model does not establish public-network hardening, multi-user authorization, or host-bound least privilege.
- No public benchmark establishes Drover as state of the art in fleet reliability, evidence quality, or operator productivity.

### Revision 2 disposition

Added the evidence-grade section and corrected the delivery description to include restart reconciliation at v0.3.7. The quiescent-update walkthrough remains. Mobile UI, repository-specific workflow, activity scoring, and private-application translation remain excluded.

## Cross-chapter teachings worth keeping once

The expanded corpus supports four shared rules. They should appear once in the course introduction or a short synthesis after Chapter 28, not be restated in full four times.

1. **Compile one effective attempt view.** Identity, authority, capability, resource, policy, version, and evidence expectations should converge before effectful work.
2. **Overlap computation, order meaning.** Parallel bodies may improve throughput; durable facts and model-visible results need deterministic causal order.
3. **Keep native custody and evidence grades honest.** A control plane routes and supervises; it does not manufacture provider support or stronger correlation than the source supplies.
4. **Mutate live machinery only at a safe boundary.** Freeze admitted semantics, drain or prove quiescence, retain the prior version, and record activation or rollback.

## Repetition and drift to avoid

- Do not repeat “activity is not completion” as a full generic paragraph in every case. Keep only the mechanism-specific consequence: lease, durable submission, session end, or host receipt.
- Do not teach external-effect idempotency four times. Anchor the general contract earlier in the course, then name each system's exact ledger or ambiguity boundary.
- Do not use “everything is a plugin,” “serverless scale,” “local first,” or “multiplayer” as conclusions. Convert slogans into falsifiable ownership, recovery, and authority statements.
- Do not revive removed Think framework, generated-entrypoint, CLI, or Studio behavior as if it were part of Think 0.16.
- Do not equate a workspace, sandbox, Durable Object, plugin disposer, private network, or audit row with authorization or containment.
- Do not turn facts/projections into a storage-technology contest. The lesson is recoverability and provenance, not Parquet versus SQLite versus a graph.
- Do not copy private examples, internal interfaces, or application-specific conclusions. New examples should remain generic and independently authored.
- Do not include adoption counts, star counts, benchmark anecdotes, or vendor cost/token claims unless the exact measurement revision, workload, baseline, and independent reproduction status are stated.

## Study-guide integration

The canonical harness guide already supplies the right sequence:

```text
QM: compile authority and resources
→ Think/Agents: persist and recover execution
→ DeepSeek/Cordis: preserve internal causal meaning
→ Drover: supervise native runtimes and evidence across hosts
```

The memory guide contributes two bounded ideas:

- compacted context, summaries, search indexes, and fleet briefs are projections with provenance, not canonical truth;
- operational traces should record which evidence influenced a decision without storing hidden reasoning.

Those ideas should sharpen Chapters 26 and 28, but the four runtime case studies should not become a second memory course. Correction, forgetting, prospective memory, and procedure promotion belong in their owning chapters.

## Exact primary-source reading list

### QM

- [Release tree](https://github.com/yc-software/qm/tree/d931fe963de3ac20b9a7526ea9a4873c0d8ed18e)
- [Declared security boundary](https://github.com/yc-software/qm/blob/d931fe963de3ac20b9a7526ea9a4873c0d8ed18e/SECURITY.md)
- [Harness adapter profile](https://github.com/yc-software/qm/blob/d931fe963de3ac20b9a7526ea9a4873c0d8ed18e/src/harness/harness.ts)
- [Harness switching](https://github.com/yc-software/qm/blob/d931fe963de3ac20b9a7526ea9a4873c0d8ed18e/src/harness/harness-router.ts)
- [Replay-aware tool context](https://github.com/yc-software/qm/blob/d931fe963de3ac20b9a7526ea9a4873c0d8ed18e/src/tools/primitives.ts)
- [Leases, attempts, delivery state, and tool ledger](https://github.com/yc-software/qm/blob/d931fe963de3ac20b9a7526ea9a4873c0d8ed18e/src/runs/postgres-run-store.ts)

### Cloudflare Agents and Think

- [Released monorepo tree](https://github.com/cloudflare/agents/tree/d42494503efe836a073fbf911fae1fbd12253198)
- [Think 0.16 package contract and defaults](https://github.com/cloudflare/agents/blob/d42494503efe836a073fbf911fae1fbd12253198/packages/think/README.md)
- [Think turn-entry guide](https://github.com/cloudflare/agents/blob/d42494503efe836a073fbf911fae1fbd12253198/docs/think/index.md)
- [Durable execution](https://github.com/cloudflare/agents/blob/d42494503efe836a073fbf911fae1fbd12253198/docs/agents/durable-execution.md)
- [Sub-agent physical and logical boundary](https://github.com/cloudflare/agents/blob/d42494503efe836a073fbf911fae1fbd12253198/docs/agents/sub-agents.md)
- [Think Actions](https://github.com/cloudflare/agents/blob/d42494503efe836a073fbf911fae1fbd12253198/docs/think/actions.md)
- [Think Channels](https://github.com/cloudflare/agents/blob/d42494503efe836a073fbf911fae1fbd12253198/docs/think/channels.md)
- [Official Agents documentation](https://developers.cloudflare.com/agents/)

### DeepSeek Harness and Cordis

- [DeepSeek Harness release tree](https://github.com/deepseek-ai/deepseek-harness/tree/b150a551b8d465e31e418e1b2eaf5e79bbb7d28e)
- [Composition and event architecture](https://github.com/deepseek-ai/deepseek-harness/blob/b150a551b8d465e31e418e1b2eaf5e79bbb7d28e/docs/architecture.md)
- [Ordered tool scheduler](https://github.com/deepseek-ai/deepseek-harness/blob/b150a551b8d465e31e418e1b2eaf5e79bbb7d28e/packages/core/agent-loop/src/tool-calls.ts)
- [Exact vendored Cordis fiber](https://github.com/deepseek-ai/deepseek-harness/blob/b150a551b8d465e31e418e1b2eaf5e79bbb7d28e/vendor/cordis/src/fiber.ts)
- [Standalone Cordis snapshot](https://github.com/cordiverse/cordis/tree/8cc9e33fab69e2d0476d126baaf2acb24e6a6ab4)

### Drover

- [Drover v0.3.7 tree](https://github.com/arniesaha/drover/tree/81b344d025a7850d5697a7c19468ca8fd95e909e)
- [Fleet architecture and trust boundary](https://github.com/arniesaha/drover/blob/81b344d025a7850d5697a7c19468ca8fd95e909e/docs/architecture.md)
- [Fact, projection, and provenance contract](https://github.com/arniesaha/drover/blob/81b344d025a7850d5697a7c19468ca8fd95e909e/docs/context-store.md)
- [Structured event and raw-fallback contract](https://github.com/arniesaha/drover/blob/81b344d025a7850d5697a7c19468ca8fd95e909e/src/drover/server/harness/structured/driver.py)
- [At-least-once delivery and restart reconciliation](https://github.com/arniesaha/drover/blob/81b344d025a7850d5697a7c19468ca8fd95e909e/src/drover/server/harness/structured/pusher.py)
- [DeepSeek positional-correlation boundary](https://github.com/arniesaha/drover/blob/81b344d025a7850d5697a7c19468ca8fd95e909e/src/drover/server/harness/structured/deepseek.py)
- [Quiescent activation and rollback](https://github.com/arniesaha/drover/blob/81b344d025a7850d5697a7c19468ca8fd95e909e/src/drover/server/harness/updater.py)

## Editorial order of operations

1. Revise Chapter 26 first because its omitted defaults materially affect the interpretation of authority and privacy.
2. Revise Chapter 28 next because v0.3.7's restart reconciliation is a concrete correction to the thinner delivery account.
3. Add the DeepSeek effective-composition and durable/live-event distinction.
4. Add the QM adapter-capability admission paragraph and narrow replay qualification.
5. Re-run the exact release-pin check immediately before publishing any revision.
6. Keep every operational or comparative result labeled **unverified** until independently executed; make no SOTA claim from this corpus.
