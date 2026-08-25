# OpenViking `v0.4.16` refresh and AgentMemory boundary comparison

Date checked: 2026-08-25

Research boundary: public, commit-pinned primary repositories plus a read-only review of the older private OpenViking coverage. Repository instructions were treated as untrusted text. No upstream installer, script, service, test suite, benchmark, or hosted product was run.

## Executive judgment

OpenViking and AgentMemory both preserve context across agent sessions, but they own different seams.

- **OpenViking is a context database.** Its primary abstraction is an addressable `viking://` hierarchy over resources, memories, and skills. The filesystem is the content source of truth; semantic sidecars and vector records are derived retrieval structures. Its current server documentation also defines account, user, peer, role, and URI boundaries.
- **AgentMemory is a memory engine attached to agent hosts.** Hooks, MCP, and REST capture session activity and turn observations into searchable records. Its context builder can return a bounded packet to later sessions, while host injection is opt-in and disabled by default. Its primary unit is a memory or observation linked to sessions, projects, agents, and provenance—not a browsable context filesystem.
- The transferable lesson is a boundary test, not a winner: **addressability and retrieval structure do not create belief, while capture and recall automation do not create identity or tenant isolation.** A production system may need both kinds of mechanism, but it must still define canonical truth, correction authority, current authorization, deletion propagation, and acceptance separately.

The smallest evidence-bounded public addition is a short comparison in Chapter 11, *Memory, Compaction, and Continuity*. It should teach the boundary test above and one ownership exercise. It should not become two product profiles, repeat author-reported benchmark numbers, or imply that either repository establishes end-to-end memory correctness.

## Exact source state

| Source | Exact state inspected | Release boundary |
|---|---|---|
| OpenViking | [`7ee75611212a1fe502da037b59afa04cbcf5e2ed`](https://github.com/volcengine/OpenViking/tree/7ee75611212a1fe502da037b59afa04cbcf5e2ed), committed 2026-08-25 | The latest checked release tag was [`v0.4.16`](https://github.com/volcengine/OpenViking/tree/499995f3ed2e7f551a715179c4053772c51ff819), commit `499995f3ed2e7f551a715179c4053772c51ff819`, dated 2026-08-21. The requested commit is 45 commits after that tag, so release behavior and post-release `main` behavior are distinguished below. |
| OpenViking prior baseline | [`v0.4.5`](https://github.com/volcengine/OpenViking/tree/61f053704b8c0f9823129dc482be193fbcca8bd0), commit `61f053704b8c0f9823129dc482be193fbcca8bd0`, dated 2026-06-24 | The `v0.4.5..v0.4.16` Git range contains 532 commits. Commit count describes repository movement, not 532 user-visible features. |
| AgentMemory | [`e04ba88819c365c9acf9d6661ea802143e728bd6`](https://github.com/rohitg00/agentmemory/tree/e04ba88819c365c9acf9d6661ea802143e728bd6), committed 2026-08-23 | `package.json` still reports `0.9.29`, but tag [`v0.9.29`](https://github.com/rohitg00/agentmemory/tree/2d38dafede67d0d4ed920cde94d2106e98825b8a) points to earlier commit `2d38dafede67d0d4ed920cde94d2106e98825b8a`. The inspected pin is one commit after that tag while retaining the same package version. |

License boundary: OpenViking's main project is AGPL-3.0, while its CLI and examples carry separate Apache-2.0 licenses. AgentMemory declares Apache-2.0. Patterns may be studied and described, but implementation reuse must respect each component's actual license.

## What changed since the stale `v0.4.5` coverage

The older coverage correctly identified the `viking://` filesystem, User/Peer identity shift, L0/L1/L2 loading, recursive retrieval, session memory extraction, and AGPL boundary. Those are still foundational. The current line sharpens or extends them in six course-relevant ways.

### 1. L0 and L1 are directory sidecars, not per-file token tiers

At `v0.4.5`, the concept page described approximate token sizes and could be read as if each item had a uniform three-tier representation. By `v0.4.16`, the documentation specifies L0 and L1 as **directory-level semantic sidecars**: `.abstract.md` and `.overview.md`. The defaults are 256 and 4,000 body characters, either sidecar may exist independently, ordinary files do not receive matching sidecars, and file summaries feed the containing directory's overview. The release also documents OKF frontmatter, a metadata whitelist for embeddings, deterministic sampling, freshness counters, and protected metadata writes.

Primary source: [current context-layer contract](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/03-context-layers.md).

**Course correction:** teach L0/L1 as derived directory projections with explicit freshness, not as universally complete summaries or fixed token allocations. A stale or sampled overview can help navigation while still omitting decisive detail.

### 2. Retrieval remains hierarchical, but relation-edge expansion was removed

The current retrieval path remains intent analysis to typed queries, hierarchical directory retrieval, and optional reranking. `find()` accepts a direct query and optional target; `search()` incorporates session context and can emit zero to five typed queries for memory, resource, or skill roots. Between `v0.4.5` and `v0.4.16`, the concept contract removed `MAX_RELATIONS` and the `relations` field from `MatchedContext`, matching the repository refactor that removed resource relation edges.

Primary sources: [retrieval contract](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/07-retrieval.md) and [pinned release comparison](https://github.com/volcengine/OpenViking/compare/v0.4.5...v0.4.16).

**Course correction:** do not describe current OpenViking retrieval as an implicit knowledge-graph traversal. Directory recursion and optional graph artifacts produced by compilation are separate mechanisms.

### 3. The release adds a bounded context-assembly seam

The `v0.4.16` tree adds a request-time context assembler that is distinct from both raw retrieval and context compilation. It can expand a query, gather candidates across authenticated memory, resource, and skill roots, load only the representation tiers that need bodies, enforce category and total-token budgets, render an injection-ready envelope, and record only entries actually served. Peer scope is a view filter inside the authenticated user boundary. Its recall ledger is intentionally best-effort: ledger failure disables deduplication rather than blocking retrieval, and retrieval errors may yield partial context.

Primary sources: [context-assembly parameters](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/openviking/retrieve/context_assembler/params.py), [pipeline](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/openviking/retrieve/context_assembler/pipeline.py), [candidate gathering](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/openviking/retrieve/context_assembler/gather.py), and [best-effort ledger](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/openviking/retrieve/context_assembler/ledger.py).

**Boundary:** an injection-ready packet is still a selected, budgeted representation. It is not accepted belief and carries no effect authority.

### 4. The memory schema moved from eight coarse categories to policy-selected user/peer types

The `v0.4.5` session page listed profile, preferences, entities, events, cases, patterns, tools, and skills. The current line documents profile, preferences, entities, events, identity, soul, cases, trajectories, and experiences, with custom types allowed. `experiences` activates the complete Agent Evolution pipeline and implicitly enables cases and trajectories. Session commit remains a two-phase boundary: messages are archived synchronously; summary generation, memory extraction, and `memory_diff.json` are completed asynchronously.

The extraction flow is not a truth protocol. It uses model extraction, vector pre-filtering, and model deduplication decisions (`skip`, `create`, `none`, `merge`, and `delete`). The per-commit diff is valuable provenance and manual rollback input for applied changes; no first-party automated rollback API was found. Durable phase-one archiving also does not prove that phase-two extraction completed successfully.

Primary source: [session and memory extraction contract](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/08-session.md).

### 5. Context compilation is now a separate agent-execution seam

The `v0.4.16` tree adds a context-compilation section. `ov compile` accepts source URIs, a target URI, a Skill, and an optional reason; VikingBot then runs an asynchronous agent loop to write a Wiki, knowledge graph, daily report, or distilled conclusion set. The same context database can therefore hold raw sources, navigational projections, and new agent-authored artifacts.

Primary sources: [compilation overview](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/context-compilation/01-overview.md), [LLM Wiki artifact contract](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/context-compilation/02-llm-wiki.md), and [knowledge-graph artifact contract](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/context-compilation/03-knowledge-graph.md).

**Boundary:** compilation output is agent-authored derived material. A typed page, source field, or relationship file improves inspectability but does not make the compiled conclusion canonical truth.

### 6. `v0.4.16` and the requested commit are not the same API snapshot

The release introduced the caller-relative `viking://~` home alias, but the requested post-release commit goes further: uid-less forms such as `viking://user/memories/...` are rejected at user/admin request boundaries, and the server points callers to `viking://~/...`. The alias expands from authenticated identity and responses emit canonical `viking://user/{user_id}/...` paths.

Primary sources: [current URI contract](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/04-viking-uri.md) and [`v0.4.16..7ee7561` comparison](https://github.com/volcengine/OpenViking/compare/v0.4.16...7ee75611212a1fe502da037b59afa04cbcf5e2ed).

**Publication rule:** cite `v0.4.16` as the release and `7ee7561` as the inspected current commit. Do not imply the tag contains every post-release URI behavior.

## Current OpenViking mechanism boundary

### Observed in the pinned repository

- `viking://resources`, `viking://user/{user_id}`, and `viking://agent` organize account-shared resources, user-private context, and account-global agent capabilities. `viking://~` is request-relative to authenticated user identity. [URI contract](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/04-viking-uri.md)
- The filesystem is the content source of truth and the vector index is derived. OpenViking explicitly prefers a missed search result over returning a bad index reference after partial failure. [transaction contract](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/09-transaction.md)
- The request-time context assembler separates candidate retrieval from representation loading and token-budgeted rendering. It can apply memory, resource, skill, peer, and recall-ledger policies before returning injection-ready XML; ledger failure degrades to stateless recall rather than proving deduplication. [context-assembly pipeline](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/openviking/retrieve/context_assembler/pipeline.py)
- Authentication-aware multi-tenancy distinguishes account, user, and peer. API keys bind users to an account; trusted mode delegates identity assertions to an upstream gateway; peer is a content scope inside a user rather than a tenant identity. [multi-tenant contract](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/11-multi-tenant.md)
- Session commit archives messages and asynchronously performs summary and memory extraction. `memory_diff.json` records adds, updates, deletes, and skipped operations for that commit. [session contract](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/08-session.md)
- Path locks and a persistent session-commit queue protect selected write and recovery paths. These mechanisms improve storage consistency; they do not provide a universal transaction over every external effect. [transaction contract](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/09-transaction.md)

### Author-reported, not independently validated here

- LoCoMo, tau2-bench, token, and latency results in the README. The headline benchmark table is explicitly labeled OpenViking `0.3.22`; no raw result bundle for `v0.4.16` or the inspected post-release commit was found.
- Hosted, enterprise, air-gapped, collaboration, service-level, and scale claims outside the inspected open-source mechanisms.
- The completeness of privacy extraction, account isolation, crash recovery, and every integration under adversarial or production conditions.

## Current AgentMemory mechanism boundary

### Observed in the pinned repository

- Hooks derive a project label from `AGENTMEMORY_PROJECT_NAME`, otherwise the Git top-level basename, otherwise the working-directory basename. This label is convenient routing metadata; two unrelated repositories can share a basename. [project resolver](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/hooks/_project.ts)
- `mem::remember` stores typed memories with concepts, file references, provenance, optional TTL, project, and agent ID. Similar current memories can be superseded; the previous record remains in KV but is removed from BM25 and vector indexes. [remember and forget implementation](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/functions/remember.ts)
- Search combines BM25, optional embeddings, and graph matches through weighted reciprocal-rank fusion. It diversifies results by session and may rerank. [hybrid search implementation](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/state/hybrid-search.ts)
- The primary search path applies project, working-directory, and agent filters after index retrieval. Project-less legacy entries remain visible across project filters by design. [search implementation](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/functions/search.ts)
- Agent scope is shared by default. `AGENTMEMORY_AGENT_SCOPE=isolated` adds an agent-ID filter and fails closed when no agent identity is available, but an explicit `agentId: "*"` opts into a wildcard read. [configuration](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/config.ts) and [README contract](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/README.md#multi-agent-memory-agent_id--agentmemory_agent_scope)
- `mem::context` assembles project profiles, pinned slots, lessons, summaries, and observations under a token budget for later injection. Retrieved lessons are explicitly rendered as reference data rather than instructions. [context assembly implementation](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/functions/context.ts)
- Host context injection is disabled unless `AGENTMEMORY_INJECT_CONTEXT=true`. The session-start and pre-tool hooks mediate whether the assembled packet enters a host prompt. [session-start hook](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/hooks/session-start.ts) and [pre-tool hook](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/hooks/pre-tool-use.ts)
- The common MCP `memory_recall` schema exposes query, limit, format, and token budget, but not a project selector; its handler does not forward project into the internal search call. Project-aware internal search therefore does not prove project-safe recall on every public surface. [MCP tool schema](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/mcp/tools-registry.ts) and [MCP handler](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/mcp/server.ts)
- User-requested forget and governance deletion remove selected KV records and search-index entries and append audit records. The repository also includes TTL, retention, and auto-forget paths. This inspection did not prove purge from every backup, export, snapshot, log, or connected host. [governance implementation](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/functions/governance.ts) and [audit implementation](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/functions/audit.ts)
- The repository ships an adapter-pluggable retrieval harness for a public LongMemEval subset and a small in-house coding-session corpus. [evaluation harness](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/eval/README.md)

### Author-reported, not independently validated here

- Published LongMemEval, coding-agent-life, token-cost, latency, and competitor results. The small coding-agent-life report uses 15 queries against an older `v0.9.26` snapshot and scores retrieved session IDs; it was not reproduced here.
- Claims that one command, every supported host, every hook, or every storage mode works under all documented platforms.
- End-to-end team privacy, authenticated multi-user tenancy, and complete deletion across connected hosts. The inspected project and agent fields are selectors and tags; they are not by themselves independent identity proof.

## Boundary comparison

| Question | OpenViking | AgentMemory | Course lesson |
|---|---|---|---|
| Primary unit | URI-addressed file, directory, sidecar, memory, resource, or skill | Session, observation, memory, lesson, graph record, or project profile | Name what the durable unit represents before comparing retrieval. |
| Canonical storage | Filesystem content; vector index is derived | KV records plus persisted BM25/vector/graph projections | A derived index must be rebuildable and must not silently outrank its source record. |
| Main ingestion seam | Resource/skill import, filesystem writes, sessions, and compilation | Hooks, MCP, REST, explicit save, consolidation, and imports | Capture mechanism and admission policy are separate contracts. |
| Retrieval shape | Typed-query planning, directory recursion, rerank, then token/tier/peer-aware context assembly | BM25 + optional vector + graph fusion, session diversification, optional rerank | Hierarchical retrieval and signal fusion solve different recall problems; neither proves relevance to the present decision. |
| Context projection | Directory L0/L1 sidecars with freshness and sampling metadata | Compressed observations, summaries, profiles, slots, lessons, and bounded injected packets | Every projection needs provenance, freshness, and an escape hatch to source detail. |
| Identity and scope | Account/user identity resolved by key or trusted gateway; peer is subordinate content scope | Project and agent tags/selectors; default agent scope shared; optional team namespaces | A scope filter is not identity proof. Keep authenticated subject, admitted scope, storage filter, and returned context distinct. |
| Correction | Session extraction can skip/create/merge/delete and writes a per-commit memory diff | Similar memories can supersede prior versions; prior KV history remains while indexes drop stale versions | Correction needs an authoritative actor and propagation checks, not just deduplication. |
| Forgetting/deletion | Filesystem deletion and account/user operations interact with derived indexes and queues | Selected KV/index deletion, TTL, retention, auto-forget, and audit records | “Forgotten” must name the surfaces removed and the surfaces not proved. |
| Execution boundary | Context compilation delegates to VikingBot and a Skill | Host adapters and opt-in hooks trigger capture and injection | Stored context and executable capability must not share implicit authority. |
| Evaluation | Repository benchmark scripts and first-party results | Adapter-pluggable retrieval harness and first-party scorecards | Evaluate false recall, stale recall, cross-scope leakage, correction, and deletion—not top-k recall alone. |

## Smallest useful public addition

Add one subsection to Chapter 11 after “Retrieve for a decision.” Suggested shape:

1. Two short paragraphs defining **context database** versus **memory engine**.
2. A five-row boundary check: address, capture, scope identity, correction, and deletion.
3. One retrieval exercise: a user preference is auto-extracted, later corrected, and requested from another same-named project. Ask which layer may retrieve it, which record outranks it, and what must be removed or rebuilt.
4. An explicit source boundary: both mechanisms are repository-observed; benchmark and production claims remain author-reported and unverified.

Before that course edit, update the two source manifests so their `inspected_paths`, observed mechanisms, unknowns, and falsifiers match this deeper inspection. Increment the chapter revision and preserve a frozen source snapshot through the existing publication pipeline.

Do **not** add an architecture card yet. Neither inspected source is a complete end-to-end agent runtime, and the comparison is more useful as a memory-boundary lesson than as two new gallery entries.

## Falsifiers and follow-up checks

These findings should be revised if any of the following is shown at the exact pins or a later pinned release:

- OpenViking creates L0/L1 sidecars for every ordinary file rather than at the directory level.
- Current OpenViking retrieval still traverses resource relation edges as part of `MatchedContext` rather than treating graph artifacts separately.
- `viking://~` is resolved without authenticated caller identity, or uid-less user paths remain accepted at the inspected post-release commit.
- AgentMemory binds project to an authenticated namespace rather than caller-provided or basename-derived metadata.
- AgentMemory's common MCP recall begins forwarding an admitted project scope, or another authenticated namespace, into its internal search path.
- AgentMemory excludes every unscoped legacy record from project-filtered search, or isolated agent scope cannot be bypassed by an explicit wildcard.
- Either repository proves canonical belief acceptance, complete cross-projection deletion, current effect authority, or independent tenant-isolation guarantees beyond the inspected mechanisms.

Recommended later validation, kept outside this note's scope:

- Run OpenViking's focused identity, peer, URI, retrieval, session-commit, and sidecar tests in a disposable environment after reviewing their fixtures.
- Run AgentMemory's project-collision, cross-agent, correction, forgetting, and retrieval-ablation tests in a disposable data directory.
- Build adversarial fixtures for two repositories with the same basename, unscoped legacy memory, a corrected preference, and a deleted source whose derived index was persisted before process interruption.

## Source register

### OpenViking

- [Repository at inspected commit](https://github.com/volcengine/OpenViking/tree/7ee75611212a1fe502da037b59afa04cbcf5e2ed)
- [Architecture](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/01-architecture.md)
- [Context types](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/02-context-types.md)
- [Context layers](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/03-context-layers.md)
- [Viking URI](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/04-viking-uri.md)
- [Retrieval](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/07-retrieval.md)
- [Session](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/08-session.md)
- [Transactions and recovery](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/09-transaction.md)
- [Multi-tenant model](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/concepts/11-multi-tenant.md)
- [Request-time context assembler](https://github.com/volcengine/OpenViking/tree/7ee75611212a1fe502da037b59afa04cbcf5e2ed/openviking/retrieve/context_assembler)
- [Context compilation](https://github.com/volcengine/OpenViking/tree/7ee75611212a1fe502da037b59afa04cbcf5e2ed/docs/en/context-compilation)
- [License](https://github.com/volcengine/OpenViking/blob/7ee75611212a1fe502da037b59afa04cbcf5e2ed/LICENSE)

### AgentMemory

- [Repository at inspected commit](https://github.com/rohitg00/agentmemory/tree/e04ba88819c365c9acf9d6661ea802143e728bd6)
- [Project resolver](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/hooks/_project.ts)
- [Remember, supersede, and forget](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/functions/remember.ts)
- [Search and post-retrieval filters](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/functions/search.ts)
- [Hybrid retrieval](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/state/hybrid-search.ts)
- [Context injection](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/functions/context.ts)
- [MCP recall schema](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/mcp/tools-registry.ts)
- [MCP recall handler](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/mcp/server.ts)
- [Host injection gate](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/hooks/session-start.ts)
- [Governance deletion](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/src/functions/governance.ts)
- [Evaluation harness](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/eval/README.md)
- [License](https://github.com/rohitg00/agentmemory/blob/e04ba88819c365c9acf9d6661ea802143e728bd6/LICENSE)
