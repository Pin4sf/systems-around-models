const progression = [
  ["H0", "Response"], ["H1", "Context"], ["H2", "Tools"], ["H3", "Environment"], ["H4", "Durable state"],
  ["H5", "Orchestration"], ["H6", "Memory"], ["H7", "Reliable effects"], ["H8", "Evidence"], ["H9", "Evaluation"],
] as const;

function Diagram({ name, children }: { name: string; children: ReactNode }) {
  return <figure className="learning-diagram" role="img" aria-label={name}>{children}</figure>;
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
import type { ReactNode } from "react";
