import type { ArchitectureRecord } from "@/lib/content/schema";

const ownershipLabels = {
  owned: "owned",
  delegated: "delegated",
  external: "external",
  "not-established": "not established",
} as const;

export function NormalizedTopology({ record }: { record: ArchitectureRecord }) {
  return (
    <figure className="normalized-topology" aria-labelledby={`topology-${record.slug}`}>
      <figcaption id={`topology-${record.slug}`}>Normalized responsibility topology</figcaption>
      <ol>
        {record.topologySteps.map((step) => (
          <li className={`topology-step topology-step--${step.ownership}`} key={step.stage}>
            <strong>{step.label}</strong>
            <span className="topology-step__owner">{ownershipLabels[step.ownership]}</span>
            <span>{step.description}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
