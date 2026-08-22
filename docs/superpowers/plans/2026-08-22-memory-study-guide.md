# Memory Engineering Study Guide — Implementation Plan

**Status:** Approved for local implementation
**Date:** 2026-08-22
**Owner:** Shivansh Fulper
**Spec:** `docs/design/2026-08-21-reading-portal-design.md`

## Goal

Publish one complete, readable Memory Engineering short course beside the existing Harness Engineering guide. A reader should finish it in one sitting and leave with a practical model for designing, correcting, securing, evaluating, and deliberately forgetting agent memory.

## Success criteria

- `/fieldbook/memory-engineering-study-guide` is a complete public article, not a placeholder or framework roundup.
- The guide explains memory as a governed lifecycle rather than a database feature.
- The reader can distinguish semantic, episodic, procedural, and prospective memory; canonical records and projections; capture and belief; retrieval and permission; correction, suppression, invalidation, and purge.
- The guide includes a compact design worksheet, eight build-and-break labs, ordinary public source links, and one correction path.
- The homepage and publication navigation expose both released guides without becoming a marketing card grid or a second giant curriculum page.
- Memory navigation is truthful and does not inherit Harness-only labels such as “Chapter 1 of 40” or “The H0→H9 progression.”
- Metadata, RSS, sitemap, manifests, mobile, print, no-JavaScript, privacy scanning, and the zero-JavaScript budget continue to pass.

## Global constraints

1. **Simple reader:** use the same prose-first, one-sitting study-guide presentation as the Harness guide. No visible evidence badges, source drawers, revision panels, scores, framework rankings, or dashboard UI.
2. **Clean-room publication:** deployment reads only the public repository. Do not include private repository names, local paths, credentials, personal data, health data, private traces, internal discussions, or proprietary implementation detail.
3. **General-purpose:** product-specific material is omitted from the main argument. Any future product case study must be explicitly bounded; this slice adds none.
4. **Evidence backstage:** every source named in frontmatter has a complete source record; every substantive project claim has a canonical claim record; the revision record lists affected claims. Public prose uses ordinary links and calibrated language.
5. **Evidence posture:** peer-reviewed work may support bounded findings; first-party papers and documentation establish what their authors report or expose; preprints are emerging evidence; vendor comparisons and unnormalized leaderboard numbers are omitted.
6. **Memory contract:** retrieved content may inform reasoning but never grants authority. A prospective cue makes work eligible, not authorized. A summary does not erase provenance, conflict, or deletion lineage.
7. **Architecture restraint:** begin with canonical records and deterministic retrieval. Files, vectors, graphs, temporal indexes, and hybrid stacks are choices justified by query and failure shape, not maturity levels.
8. **Static resilience:** the complete lesson, navigation, sources, and correction path remain usable without JavaScript. No new dependency or client component.
9. **Release restraint:** do not push, merge, deploy, buy a domain, or change DNS in this plan. Preserve the existing untracked domain-research note.
10. **TDD seams:** test only public reader behavior, trusted content registration, publication discovery, and generated manifests. Record RED before GREEN for each task.

## Public content outline

The guide should target roughly 20–30 minutes and use one running configuration-change example plus one prospective-intention example. It must contain these H2 sections in this order:

1. `1. Memory is not storage`
2. `2. Choose the memory function before the database`
3. `3. Keep canonical records separate from projections`
4. `4. Capture is not belief`
5. `5. Retrieve for a decision, not merely for similarity`
6. `6. Remember the future without taking control`
7. `7. Correct, forget, and defend the memory surface`
8. `8. Evaluate the whole lifecycle`
9. `A compact memory design worksheet`
10. `Eight build-and-break labs`
11. `Sources and next reading`

Required teaching moves:

- define semantic, episodic, procedural, and prospective memory in plain language;
- show a record changing from an older configuration to a current configuration without destroying history;
- show why current projection, search index, embedding, graph edge, summary, cache, and trigger index are derived representations;
- separate capture, encoding, candidate, validation, authorization, promotion, retrieval, influence, correction, consolidation, suppression, invalidation, and purge;
- separate remembered intention, cue eligibility, authorized attempt, verification, user acceptance, and conscious closure;
- explain authority non-amplification and provenance laundering without exposing private examples;
- evaluate write quality, retrieval, use, prospective timing, correction/deletion, and adversarial safety separately;
- give builders an explicit “start shallow, add structure after a held-out failure” rule;
- avoid universal market-share claims, stale framework comparisons, and benchmark winner language.

Required public source families:

- MemGPT / the memory-as-virtual-context architecture;
- Anthropic’s first-party context-engineering guidance;
- Karpathy’s LLM Wiki artifact for compounding file knowledge;
- peer-reviewed long-conversation evaluation such as LoCoMo and LongMemEval;
- peer-reviewed lifecycle/competency evaluation such as MemoryAgentBench or Memora;
- prospective-memory evaluation, explicitly labeled emerging where venue evidence is incomplete;
- official or peer-reviewed memory security material, with practitioner guidance clearly labeled.

## Task 1: Publish the complete Memory Engineering guide and editorial records

**Files:**

- update `docs/design/2026-08-21-reading-portal-design.md` with a newer amendment that promotes one Memory short guide while retaining the simple-reader contract;
- add `content/essays/memory/memory-engineering-study-guide.mdx`;
- add only the necessary `content/sources/source-memory-*.yaml` records;
- add only substantive `content/claims/claim-memory-*.yaml` records;
- add `content/revisions/revision-memory-engineering-study-guide-001.yaml`;
- add `lib/study-guide/study-guide-registry.ts` as the trusted guide/sequence allowlist;
- update `components/article/article-reader.tsx` to obtain trusted paths and reader-position text from the registry;
- update `components/article/sequence-navigation.tsx` to render truthful sequence-specific labels and ARIA names;
- update `tests/interface/reader.test.tsx` and `tests/content/content-integrity.test.ts` at the public seams.

**RED:**

Add focused tests asserting that the new public route is registered, the exact H2 outline renders, ordinary source links are present, evidence-review UI is absent, the article-level correction path is present, and every visible source family resolves through frontmatter/source records. Run the focused tests and record the expected failure before adding the content.

**GREEN:**

Write the guide, minimum editorial records, and the smallest trusted registry/navigation integration needed to render the route. The prose must be an original public synthesis, not a copy of the private source book. Run the focused tests, `npm run check:public` after staging the new public files, and the full unit suite. Commit with the repository message convention.

## Task 2: Integrate Memory into the reading portal and release plumbing

**Files:**

- update `app/page.tsx` with a quiet released Memory companion entry;
- update `components/publication-shell.tsx` with direct, truthful guide navigation;
- update `tests/interface/homepage.test.tsx`, `tests/publication/metadata.test.ts`, `tests/publication/build-manifest.test.ts`, and `tests/e2e/reader.spec.ts`;
- regenerate `public/publication-manifest.json` and the per-revision manifest through the existing generator.

**RED:**

Add focused tests for homepage discovery, sitemap/RSS inclusion, generated revision/source entries, and mobile/no-JavaScript reading. Record the expected failures before implementation.

**GREEN:**

Implement the smallest discovery and release changes needed. Do not change the generic content schemas, route generator, metadata builder, sitemap implementation, RSS implementation, or visual system unless a recorded failing public-seam test demonstrates the need. Run focused tests, generate manifests, stage every release file so the public scanner covers it, then run `SITE_URL=https://example.invalid npm run verify:release`. Commit with the repository message convention.

## Review and finish

After each task, run one independent task review covering both spec compliance and code quality. Fix Critical/Important findings through the bounded fix loop. After Task 2, run one whole-branch review against this plan, then one release verification. Leave the branch local until Shivansh explicitly requests push or deployment.
