# Evidence and completion: primary-source basis for Chapters 17–20

Date: 2026-08-24
Research boundary: public primary sources only
Private-input boundary: the private study-guide sections for Chapters 17–20 were used only to identify the questions to investigate. This note is an original synthesis and does not reproduce private prose.

## Executive source judgment

The current four-source set is directionally sound if its claims remain narrow.

| Current source | Date check | What it can support | What it cannot support |
|---|---|---|---|
| W3C, *Trace Context* | W3C Recommendation dated **2021-11-23** | Interoperable propagation of trace identifiers across distributed components; trace privacy and security limits | A complete semantic record of an agent run, proof that every event was recorded, or proof that a recorded result is correct |
| NIST, *AI RMF 1.0* | NIST publication page dated **2023-01-26** | Separation of governance, mapping, measurement, and management; use of non-front-line experts or independent assessors in regular assessment | A prescribed maker/checker runtime, a completion ledger, or an agent-specific closure protocol |
| Zheng et al., *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena* | arXiv v1 dated **2023-06-09**; peer-reviewed NeurIPS 2023 proceedings version | Model-judge agreement with human preference in the evaluated chatbot settings, plus position, verbosity, self-enhancement, and reasoning limits | Factual correctness, safety, policy compliance, effect verification, or universal superiority of a different-model checker |
| Temporal, *Building Reliable Applications with Durable Execution* | PDF metadata has `CreationDate` **2024-01-13**; author describes it only as a **2024** work; no first-party publication day was found | Temporal's described mechanism of persisted execution progress, retries, waiting, replay, and recovery | A vendor-neutral durability standard or user-facing semantics for responsibility, cue quality, Acceptance, dismissal, or release |

### Required metadata correction

`2024-01-13` should not be labeled as Temporal's proven `published_at` date. It is the PDF artifact's embedded creation timestamp. If the content schema requires a full date, record the field as artifact-creation-derived in an explicit qualifier; otherwise represent publication as `2024` or unknown and retain `2024-01-13` as document metadata. The retrieval and validation date is independently **2026-08-24**.

NIST also states that AI RMF 1.0 is being revised. Cite the edition explicitly as **AI RMF 1.0**, not as an immutable or exhaustive current standard for agent evaluation.

## Chapter 17 — Observability and trace reconstruction

### Claim 17.1 — A shared trace identity enables cross-component correlation

**Primary basis.** The W3C Trace Context Recommendation defines `traceparent` and `tracestate` so trace data crossing components and tracing vendors can share an identifier and remain correlated.

- Source: W3C Distributed Tracing Working Group, *Trace Context*, W3C Recommendation, 2021-11-23. Inspected 2026-08-24.
  https://www.w3.org/TR/2021/REC-trace-context-1-20211123/
- Corroborating implementation specification: OpenTelemetry, *Tracing API*, current stable tracing API inspected 2026-08-24. It defines spans with identifiers, parents, timestamps, attributes, events, status, and links.
  https://opentelemetry.io/docs/specs/otel/trace/api/

**Limit / falsifier.** A valid trace ID with incomplete or incorrect instrumentation still produces an incomplete or misleading trace. Sampling can omit records. A later W3C Recommendation that replaces these propagation semantics would require a source refresh.

**Public teaching boundary.** Teach W3C Trace Context as correlation plumbing, not as reconstruction by itself. Full reconstruction requires application-defined facts such as attempt identity, effective inputs, capability and policy versions, tool/effect records, verifier decisions, and stopping state.

### Claim 17.2 — Trace content must be privacy-scoped

**Primary basis.** W3C warns that `traceparent` can correlate requests and that `tracestate` can expose vendor or other sensitive information. The OpenTelemetry GenAI attribute registry separately warns that recorded input and output messages are likely to contain sensitive information, including PII.

- Source: W3C, *Trace Context*, Sections 6–7, 2021-11-23. Inspected 2026-08-24.
  https://www.w3.org/TR/2021/REC-trace-context-1-20211123/#privacy-considerations
- Source: OpenTelemetry, *Gen AI attribute registry*, inspected 2026-08-24. The relevant GenAI conventions are marked as evolving/development material, so pin the inspected version before normative use.
  https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/

**Limit / falsifier.** Redaction that removes the only durable link to a causal fact can make an incident irreconstructable; unrestricted payload capture can expose private data and secrets. Neither specification chooses an application's retention, access, or redaction policy.

**Public teaching boundary.** Recommend typed, reference-based records, access-scoped views, retention rules, and explicit redaction markers. Do not recommend storing hidden model reasoning. The defensible target is reconstructing model-visible inputs and externally observable decisions, not capturing private chain-of-thought.

### Claim 17.3 — Provenance supports trust assessment but is not proof of truth

**Primary basis.** W3C PROV-DM models entities, activities, derivations, agents, responsibility, and provenance bundles. Its stated purpose includes enabling assessments of quality, reliability, or trustworthiness.

- Source: W3C Provenance Working Group, *PROV-DM: The PROV Data Model*, W3C Recommendation, 2013-04-30. Inspected 2026-08-24.
  https://www.w3.org/TR/prov-dm/

**Limit / falsifier.** PROV-DM is domain-agnostic and explicitly leaves domain-specific meaning to extensions. A syntactically valid provenance graph can contain false assertions or omit material activity.

**Public teaching boundary.** Use PROV concepts to teach artifact lineage and responsibility. Do not call provenance itself verification.

## Chapter 18 — Maker/checker separation

### Claim 18.1 — Independent assessment is a recognized risk-control pattern

**Primary basis.** NIST AI RMF 1.0 `MEASURE 1.3` says internal experts who did not serve as front-line developers and/or independent assessors should be involved in regular assessments and updates. `MEASURE 2.1` calls for documenting test sets, metrics, and TEVV tools.

- Source: Elham Tabassi, *Artificial Intelligence Risk Management Framework (AI RMF 1.0)*, NIST AI 100-1, 2023-01-26. Inspected 2026-08-24.
  https://doi.org/10.6028/NIST.AI.100-1
- Current NIST edition page and revision notice, inspected 2026-08-24.
  https://airc.nist.gov/airmf-resources/

**Limit / falsifier.** NIST describes organizational risk management, not an agent runtime protocol. Merely naming a second process or model “independent” does not establish independent evidence, policy, incentives, or authority.

**Public teaching boundary.** Teach independence as a property to design and inspect: separate role, locked criteria, independently obtained evidence, and bounded decision authority. Do not reduce it to “call a second model.”

### Claim 18.2 — An LLM judge is a fallible measurement instrument

**Primary basis.** Zheng et al. report over 80% agreement between GPT-4 judges and humans in their evaluated chatbot-preference settings, while documenting position, verbosity, self-enhancement, and limited-reasoning failure modes. The paper itself recommends a hybrid evaluation framework rather than a universal model judge.

- Source: Lianmin Zheng et al., *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*, NeurIPS 2023 Datasets and Benchmarks. Proceedings inspected 2026-08-24.
  https://papers.nips.cc/paper_files/paper/2023/hash/91f18a1287b398d378ef22505bf41832-Abstract-Datasets_and_Benchmarks.html
- Preprint history, v1 dated 2023-06-09.
  https://arxiv.org/abs/2306.05685

**Limit / falsifier.** The study measures preference agreement for a 2023 model and benchmark population. It does not show that a model judge verifies factual claims, authorization, external-world state, or safety. New evaluations that reverse the reported biases or agreement would require updating the lesson, but would still not prove the wider domains without direct tests.

**Public teaching boundary.** Present model judges as calibrated, versioned evaluators for specified rubrics. Require domain-specific regression sets and preserve uncertainty or disagreement. Prefer deterministic checks for deterministic claims, independent state queries for external effects, and authorized humans for judgment or consequence boundaries.

### Claim 18.3 — Verification criteria must be baselined before checking

**Primary basis.** NASA's Systems Engineering Handbook defines product verification as objective evidence that an end product conforms to requirements or specifications and treats validation against stakeholder expectations as a distinct process.

- Source: NASA, *NASA Systems Engineering Handbook*, NASA/SP-2016-6105 Rev 2, 2016. Inspected 2026-08-24.
  https://science.nasa.gov/wp-content/uploads/2023/04/nasa_systems_engineering_handbook_0.pdf

**Limit / falsifier.** NASA's process is systems-engineering guidance, not a general-purpose AI-agent standard. A baselined criterion may itself be incomplete or wrong.

**Public teaching boundary.** Use the handbook only to justify locked requirements and the difference between conformance and stakeholder fitness. The chapter's proposed checker stack remains an application design, not a NASA-prescribed agent architecture.

## Chapter 19 — Evidence, verification, policy, Acceptance, and closure

### Claim 19.1 — Evidence, verifier appraisal, and relying-party policy are distinct artifacts and decisions

**Primary basis.** The IETF RATS architecture defines an Attester that produces Evidence, a Verifier that appraises Evidence against an appraisal policy and produces Attestation Results, and a Relying Party that applies its own policy to those results before an application-specific action. It also treats freshness as policy-sensitive and warns of race conditions after evidence is generated.

- Source: IETF, *Remote ATtestation procedureS (RATS) Architecture*, RFC 9334, January 2023. Informational RFC, inspected 2026-08-24.
  https://datatracker.ietf.org/doc/html/rfc9334

**Limit / falsifier.** RFC 9334 is an informational architecture for remote attestation, not an Internet Standards Track agent-completion protocol. Its “Evidence” is a specific set of claims about a target environment, not every artifact an agent may produce. Evidence authenticity also does not establish that every claim is semantically true or sufficient for a user's goal.

**Public teaching boundary.** Use RATS as a precise analogy for keeping evidence, appraisal, appraisal policy, result, and action separate. Do not relabel ordinary screenshots or model summaries as cryptographic attestation.

### Claim 19.2 — Verification and stakeholder validation answer different questions

**Primary basis.** NASA distinguishes verification against requirements from validation against stakeholder expectations and intended operating conditions. It requires documented objective evidence for verification completion and closure of discrepancies or nonconformance reports.

- Source: NASA, *NASA Systems Engineering Handbook*, NASA/SP-2016-6105 Rev 2, 2016, Sections 5.3–5.4. Inspected 2026-08-24.
  https://science.nasa.gov/wp-content/uploads/2023/04/nasa_systems_engineering_handbook_0.pdf

**Limit / falsifier.** Validation is not identical to an individual's Acceptance decision, and NASA's discrepancy closure is not a universal model for release of human responsibility.

**Public teaching boundary.** It is evidence-backed to distinguish requirement conformance from stakeholder fitness. The stronger ladder—execution stopped, effect observed, evidence recorded, verification decided, policy disposed, owner accepted, responsibility closed—should be labeled a proposed harness teaching model rather than an adopted standard.

### Claim 19.3 — Provenance and authenticity do not collapse into correctness

**Primary basis.** W3C PROV gives a model for the origin and responsibility of artifacts; RFC 9334 separates Evidence from the Verifier's appraisal and the Relying Party's later decision. Together they support preserving evidence lineage and distinct decisions.

- Sources: W3C PROV-DM (2013-04-30) and IETF RFC 9334 (January 2023), both inspected 2026-08-24.
  https://www.w3.org/TR/prov-dm/
  https://datatracker.ietf.org/doc/html/rfc9334

**Limit / falsifier.** A signed receipt may prove who issued bytes and when without proving that the represented external state exists, remains fresh, meets policy, or satisfies a person's outcome.

**Public teaching boundary.** Never teach a tool return, signature, receipt, test pass, reviewer approval, or transport success as interchangeable with closure. Name which claim each artifact can actually support.

## Chapter 20 — Open Loops and re-entry

### Claim 20.1 — Durable event history can reconstruct and resume workflow state

**Primary basis.** Temporal's public documentation describes a Workflow Event History as a durably persisted append-only event log used for recovery and debugging. Replay checks generated commands against existing history; after a failure, execution resumes from the last recorded event. The source repository also documents history-size and event-count limits and the determinism constraint.

- Source: Temporal documentation source, *Events and Event History*, current `main` inspected 2026-08-24.
  https://github.com/temporalio/documentation/blob/main/docs/encyclopedia/workflow/workflow-execution/event.mdx
- Source: Temporal documentation source, *Workflow Execution / Replays*, current `main` inspected 2026-08-24.
  https://github.com/temporalio/documentation/blob/main/docs/encyclopedia/workflow/workflow-execution/workflow-execution.mdx
- Source: Loren Sands-Ramshaw, *Building Reliable Applications with Durable Execution*, Temporal technical guide, artifact created 2024-01-13; publication day unverified; inspected 2026-08-24.
  https://assets.temporal.io/durable-execution.pdf
- Author's publication list, which identifies the work only as 2024, inspected 2026-08-24.
  https://lorensr.me/

**Limit / falsifier.** These are Temporal's first-party mechanism and product claims, not a vendor-neutral standard or independent production guarantee. Replay depends on compatible deterministic workflow code and bounded history. A durable engine can faithfully resume an incorrectly modeled responsibility.

**Public teaching boundary.** Teach durable workflow history as substrate for pause, recovery, and exact technical re-entry. Do not present it as the semantics of an Open Loop.

### Claim 20.2 — User-owned Open Loops are a proposed responsibility contract

**Primary-source status.** No inspected standard or primary implementation source defines the full proposed record of owner, outcome, open reason, cue, evidence, blocker, safe next action, and closure authority. Temporal supplies waiting and replay mechanics; it does not define attention cost, useful cues, notification dismissal, conscious release, transfer, or reopening meaning.

**Falsifier.** Discovery of a stable public specification that defines equivalent responsibility and closure semantics would change this from a proposed teaching contract to an adaptation of that specification.

**Public teaching boundary.** Label “Open Loop” and “re-entry quality” as this publication's design vocabulary. State separately which underlying mechanisms are standardized or implemented. Treat notification dismissal as a presentation event unless the application's explicit contract maps it to a canonical responsibility transition.

### Claim 20.3 — Re-entry requires both durable state and an admissible next transition

**Primary basis.** Temporal shows that durable history can restore technical state. RFC 9334 shows that evidence/results can require freshness appraisal and policy before a relying party acts. Combining them supports a bounded design inference: recovered state alone does not authorize the next effect.

- Sources: Temporal Event History documentation and RFC 9334, inspected 2026-08-24.
  https://github.com/temporalio/documentation/blob/main/docs/encyclopedia/workflow/workflow-execution/event.mdx
  https://datatracker.ietf.org/doc/html/rfc9334

**Limit / falsifier.** This is an inference across two domains, not a quoted requirement from either source. A system may deliberately define different re-entry semantics for low-risk work.

**Public teaching boundary.** Mark the synthesis as an engineering recommendation: on re-entry, restore the exact state and evidence, then re-check freshness, policy, authority, and the safe next action before resuming consequential effects.

## Blocked or unverified claims

1. **Temporal publication day:** unverified. `2024-01-13` is PDF creation metadata, not a first-party publication statement.
2. **Universal completion taxonomy:** unverified. No inspected standard defines the publication's entire evidence → verification → policy → Acceptance → closure ladder for agent systems.
3. **Universal Open Loop schema:** unverified and should remain labeled proposed design vocabulary.
4. **Notification dismissal semantics:** application-specific. No primary source inspected establishes that dismissing UI changes, or must not change, canonical responsibility.
5. **Different-model superiority:** unsupported as a general claim. Zheng et al. support bounded judge usefulness and documented bias, not automatic independence or correctness.
6. **Trace completeness:** unsupported by W3C Trace Context alone. It standardizes propagation, not instrumentation coverage, artifact integrity, semantic correctness, or retention.
7. **Hidden reasoning capture:** unsupported and unnecessary for the reconstruction claim. The public boundary should be model-visible inputs, typed causal facts, externally observable rationale, and outcomes—not private reasoning traces.

## Recommended chapter-level source posture

- **Chapter 17:** retain W3C Trace Context as the anchor; add W3C PROV-DM for lineage and cite OpenTelemetry only for concrete span/event mechanics and PII cautions. Explicitly state that trace IDs are necessary plumbing, not sufficient reconstruction.
- **Chapter 18:** retain NIST AI RMF 1.0 and Zheng et al. Cite `MEASURE 1.3` directly. Avoid any independence ranking that implies “different model” is categorically stronger without task-specific evidence.
- **Chapter 19:** add RFC 9334 and NASA's verification/validation distinction. Label Acceptance and closure as application ownership semantics, not standardized terms.
- **Chapter 20:** retain Temporal for durable execution and replay, but correct its date provenance. Label Open Loops, useful re-entry, dismissal, release, and reopening as proposed product/harness contracts.

## Source register

All sources below were inspected on 2026-08-24.

1. W3C, *Trace Context*, Recommendation 2021-11-23: https://www.w3.org/TR/2021/REC-trace-context-1-20211123/
2. OpenTelemetry, *Tracing API*, stable API, current page: https://opentelemetry.io/docs/specs/otel/trace/api/
3. OpenTelemetry, *Gen AI attribute registry*, evolving current page: https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/
4. W3C, *PROV-DM*, Recommendation 2013-04-30: https://www.w3.org/TR/prov-dm/
5. NIST, *AI RMF 1.0*, NIST AI 100-1, 2023-01-26: https://doi.org/10.6028/NIST.AI.100-1
6. NIST AI Resource Center, AI RMF resources and revision notice: https://airc.nist.gov/airmf-resources/
7. Zheng et al., *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*, NeurIPS 2023: https://papers.nips.cc/paper_files/paper/2023/hash/91f18a1287b398d378ef22505bf41832-Abstract-Datasets_and_Benchmarks.html
8. Zheng et al., arXiv preprint history, v1 2023-06-09: https://arxiv.org/abs/2306.05685
9. IETF, *RATS Architecture*, RFC 9334, January 2023, Informational: https://datatracker.ietf.org/doc/html/rfc9334
10. NASA, *NASA Systems Engineering Handbook*, NASA/SP-2016-6105 Rev 2, 2016: https://science.nasa.gov/wp-content/uploads/2023/04/nasa_systems_engineering_handbook_0.pdf
11. Temporal, *Events and Event History*, current documentation source: https://github.com/temporalio/documentation/blob/main/docs/encyclopedia/workflow/workflow-execution/event.mdx
12. Temporal, *Workflow Execution / Replays*, current documentation source: https://github.com/temporalio/documentation/blob/main/docs/encyclopedia/workflow/workflow-execution/workflow-execution.mdx
13. Sands-Ramshaw, *Building Reliable Applications with Durable Execution*, Temporal technical guide, 2024 artifact; exact publication day unverified: https://assets.temporal.io/durable-execution.pdf
14. Loren Sands-Ramshaw, author publication list identifying the guide as 2024: https://lorensr.me/
