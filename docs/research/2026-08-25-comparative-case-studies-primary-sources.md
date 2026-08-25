# Comparative case studies: primary-source register

Validated: 2026-08-25

This note records the source boundary for Harness Engineering Chapters 21–24. It is an editorial audit, not a claim that every upstream product or hosted service was exhaustively reviewed.

## Anthropic long-running harnesses

- Canonical source: [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), published 2025-11-26.
- Evidence used: first-party description of initializer and incremental roles, feature and progress artifacts, clean working state, and verification across fresh sessions.
- Boundary retained: the experiment was optimized for a full-stack web-application setting. It does not establish a universal runtime, product authority model, effect protocol, or acceptance contract.

## Cursor model and harness evaluation

- Canonical source: [Continually improving the agent harness](https://cursor.com/blog/continually-improving-agent-harness), published 2026-04-30.
- Evidence used: first-party description of offline CursorBench evaluation, online A/B signals including Keep Rate, trace-based failure classification, and provider-specific harness adaptation.
- Boundary retained: Keep Rate is a product proxy, not a complete measure of correctness, safety, or user value. Changing model and harness together weakens causal attribution.

## LangGraph durable state and interrupts

- Canonical source: [LangGraph 1.2.9](https://github.com/langchain-ai/langgraph/tree/95af6a00718588e7b7ce17310e8006d267896a77), release commit `95af6a00718588e7b7ce17310e8006d267896a77`, published 2026-07-10.
- Inspected paths: `README.md`, `libs/langgraph/pyproject.toml`, `libs/langgraph/langgraph/types.py`, `libs/langgraph/langgraph/pregel/main.py`, and `libs/langgraph/tests/test_subgraph_persistence_async.py`.
- Evidence used: implementation-pinned graph execution, checkpointer, thread, persistence, and interrupt behavior.
- Boundary retained: the open-source Python library, checkpoint packages, separately versioned SDK, and hosted platform are distinct editions and responsibility surfaces. Checkpoint durability does not establish external-effect idempotency, current authorization, or owner acceptance.

## Hermes integrated runtime

- Canonical source: [Hermes Agent v0.20.5](https://github.com/NousResearch/hermes-agent/tree/fcbd1076a93841fa88855acce810e342a5b78101), release commit `fcbd1076a93841fa88855acce810e342a5b78101`, dated 2026-08-19.
- Inspected paths: `README.md`, `LICENSE`, `pyproject.toml`, `agent/memory_manager.py`, `agent/context_compressor.py`, `gateway/session.py`, `gateway/pairing.py`, `gateway/turn_lease.py`, `cron/jobs.py`, `tools/registry.py`, and `docs/session-lifecycle.md`.
- Evidence used: implementation-pinned context compression, memory, session, pairing, turn-lease, scheduling, and tool-registry seams.
- Boundary retained: repository breadth does not prove production multi-tenant isolation, exactly-once external effects, user-owned consent, acceptance, or closure. Dreaming Mode and a five-tier memory taxonomy are not attributed to native Hermes behavior.

## Publication rule

Each chapter distinguishes the observed mechanism from the publication's transferable lesson. A case-study mechanism may be adopted as a substrate without inheriting claims about authority, governance, safety, or completion that the source does not establish.
