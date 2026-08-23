const progression = [
  ["H0", "Response"], ["H1", "Context"], ["H2", "Tools"], ["H3", "Environment"], ["H4", "Durable state"],
  ["H5", "Orchestration"], ["H6", "Memory"], ["H7", "Reliable effects"], ["H8", "Evidence"], ["H9", "Evaluation"],
] as const;

function Diagram({ name, children }: { name: string; children: ReactNode }) {
  return <figure className="learning-diagram" aria-label={name}>{children}</figure>;
}

export function HarnessProgression() {
  return <Diagram name="Harness progression from H0 to H9"><ol className="learning-diagram__progression">{progression.map(([level, label]) => <li key={level}><strong>{level}</strong><span>{label}</span></li>)}</ol><figcaption>Each level adds a responsibility only when the preceding boundary cannot explain or contain the failure.</figcaption></Diagram>;
}

export function FailureChain() {
  return <Diagram name="Failure chain from request to false closure"><div className="learning-diagram__chain"><span>Bad input</span><span>Wrong capability</span><span>Lost state</span><span>Ambiguous effect</span><strong>False closure</strong></div><figcaption>A visible model error can be the last link in a chain owned by the surrounding system.</figcaption></Diagram>;
}

export function SurfaceMap() {
  return <Diagram name="Four authority surfaces"><dl className="learning-diagram__surfaces"><div><dt>Locked</dt><dd>Runtime invariants</dd></div><div><dt>Editable</dt><dd>Working hypotheses</dd></div><div><dt>Append-only</dt><dd>Events and evidence</dd></div><div><dt>Human-controlled</dt><dd>Acceptance and authority</dd></div></dl><figcaption>Classify a surface by who may change it and what history must survive.</figcaption></Diagram>;
}

export function HarnessHandoff() {
  return <Diagram name="From development evidence to product admission"><div className="learning-diagram__handoff"><div><strong>Developer harness</strong><span>code · tests · traces · artifact</span></div><span aria-hidden="true">→ typed handoff →</span><div><strong>Product runtime</strong><span>admission · authority · effects · recovery</span></div></div><figcaption>A merged artifact is evidence for admission; it is not proof that a product capability is safe or complete.</figcaption></Diagram>;
}

export function ContextAssembly() {
  return <Diagram name="Context assembly as a compiled artifact"><div className="learning-diagram__chain"><span>Locked policy</span><span>Task</span><span>Current state</span><span>Retrieved context</span><strong>Run input</strong></div><figcaption>Context is selected, ordered, bounded, and attributed for this run; it is not a transcript dump.</figcaption></Diagram>;
}

export function CapabilityBinding() {
  return <Diagram name="Capability binding across four states"><dl className="learning-diagram__surfaces"><div><dt>Unavailable</dt><dd>No adapter</dd></div><div><dt>Discoverable</dt><dd>Known, not granted</dd></div><div><dt>Bound</dt><dd>Granted for this run</dd></div><div><dt>Invoked</dt><dd>Attempt recorded</dd></div></dl><figcaption>A tool name in a prompt does not prove that the capability exists, is authorized, or was successfully used.</figcaption></Diagram>;
}

export function CustodyBoundary() {
  return <Diagram name="Environment custody boundary"><div className="learning-diagram__handoff"><div><strong>Harness policy</strong><span>identity · scope · budget · approval</span></div><span aria-hidden="true">→ bounded execution →</span><div><strong>Environment</strong><span>files · network · credentials · effects</span></div></div><figcaption>Isolation limits reach; custody determines whose resources may be changed and who remains accountable.</figcaption></Diagram>;
}

export function StateLayers() {
  return <Diagram name="Facts, snapshots, and derived views"><dl className="learning-diagram__surfaces"><div><dt>Facts</dt><dd>Append-only events</dd></div><div><dt>Snapshots</dt><dd>Recovery accelerators</dd></div><div><dt>Views</dt><dd>Rebuildable projections</dd></div><div><dt>Receipts</dt><dd>External observations</dd></div></dl><figcaption>Replay begins from durable facts; snapshots and views are useful only while their provenance remains intact.</figcaption></Diagram>;
}

export function ControlStructures() {
  return <Diagram name="Control structures and stop policies"><dl className="learning-diagram__surfaces"><div><dt>Loop</dt><dd>Repeat until stop</dd></div><div><dt>Workflow</dt><dd>Known stages</dd></div><div><dt>Graph</dt><dd>Conditional transitions</dd></div><div><dt>Delegation</dt><dd>Typed child contract</dd></div></dl><figcaption>Choose the smallest structure that can express the work, its recovery boundary, and its stop condition.</figcaption></Diagram>;
}

export function MemoryLifecycle() {
  return <Diagram name="Memory lifecycle through continuity"><div className="learning-diagram__chain"><span>Capture</span><span>Qualify</span><span>Store</span><span>Retrieve</span><strong>Correct or forget</strong></div><figcaption>Compaction produces a bounded continuity input; it does not turn remembered material into authority.</figcaption></Diagram>;
}

export function AdmissionBoundary() {
  return <Diagram name="Admission binds identity, authority, and proof"><dl className="learning-diagram__surfaces"><div><dt>Identity</dt><dd>Principal and actor</dd></div><div><dt>Scope</dt><dd>Resource boundary</dd></div><div><dt>Grants</dt><dd>Run-scoped capabilities</dd></div><div><dt>Proof</dt><dd>Completion contract</dd></div></dl><figcaption>Admission turns a request into a bounded run only after identity, authority, scope, and required evidence are explicit.</figcaption></Diagram>;
}

export function LeaseFencing() {
  return <Diagram name="Lease handoff with fencing token"><div className="learning-diagram__chain"><span>Worker A · token 17</span><span>Lease expires</span><span>Worker B · token 18</span><strong>Stale commit rejected</strong></div><figcaption>A lease limits how long a worker may act; the increasing fencing token prevents an expired worker from committing late.</figcaption></Diagram>;
}

export function EffectOutbox() {
  return <Diagram name="Transactional outbox effect lifecycle"><div className="learning-diagram__chain"><span>Authorize</span><span>Persist intent</span><span>Dispatch</span><span>Observe</span><strong>Verify or reconcile</strong></div><figcaption>The durable effect intent and local state transition are recorded together before an external dispatcher acts.</figcaption></Diagram>;
}

export function AmbiguityRecovery() {
  return <Diagram name="Ambiguous effect reconciliation"><div className="learning-diagram__chain"><span>Unknown result</span><span>Look up stable key</span><span>Compare the world</span><strong>Accept · retry · escalate</strong></div><figcaption>Recovery begins by learning what happened, not by assuming that a timeout means the effect did not occur.</figcaption></Diagram>;
}

export function RevocationPropagation() {
  return <Diagram name="Revocation propagation across active surfaces"><dl className="learning-diagram__surfaces"><div><dt>Sessions</dt><dd>Reject new privileged turns</dd></div><div><dt>Queued effects</dt><dd>Re-authorize before dispatch</dd></div><div><dt>Delegates</dt><dd>Invalidate inherited grants</dd></div><div><dt>Credentials</dt><dd>Expire cached material</dd></div></dl><figcaption>Revocation is complete only when every active or deferred authority surface stops accepting the old grant.</figcaption></Diagram>;
}
import type { ReactNode } from "react";
