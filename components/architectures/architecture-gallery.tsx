import type { ArchitectureRecord, SourceRecord } from "@/lib/content/schema";
import { NormalizedTopology } from "@/components/architectures/normalized-topology";

const classLabels: Record<ArchitectureRecord["productClass"], string> = {
  "frontier-coding-harness": "Frontier coding harness",
  "general-agent-runtime": "Stateful agent runtime",
  "memory-framework": "Memory framework",
};

export function ArchitectureGallery({
  records,
  sources,
  studySlugs,
}: {
  records: ArchitectureRecord[];
  sources: Map<string, SourceRecord>;
  studySlugs?: Set<string>;
}) {
  return (
    <div className="architecture-gallery">
      {records.map((record, index) => (
        <article className="architecture-band" id={`system-${record.slug}`} key={record.id}>
          <header className="architecture-band__identity">
            <p className="architecture-band__number trace-text">{String(index + 1).padStart(2, "0")}</p>
            <p className="eyebrow interface-text">{classLabels[record.productClass]}</p>
            <h3>{record.name}</h3>
            <p>{record.primaryJob}</p>
            <p className="architecture-band__version interface-text">
              Inspected {record.inspectedVersion.slice(0, 12)} · {record.evidenceGrade} · {record.dossierStatus.replaceAll("-", " ")}
            </p>
          </header>

          <NormalizedTopology record={record} />

          <div className="architecture-band__contract">
            <dl>
              <div><dt>Control</dt><dd>{record.controlOwner}</dd></div>
              <div><dt>State</dt><dd>{record.stateModel}</dd></div>
              <div><dt>Authority</dt><dd>{record.authorityBoundary}</dd></div>
              <div><dt>Recovery</dt><dd>{record.recoveryModel}</dd></div>
              <div><dt>Verification</dt><dd>{record.verificationModel}</dd></div>
            </dl>
          </div>

          <footer className="architecture-band__lesson">
            <p><strong>Transferable lesson</strong> {record.transferableLesson}</p>
            {studySlugs?.has(record.slug) ? <p><a className="architecture-band__study-link interface-text" href={`/architectures/${record.slug}`}>Read the architecture study</a></p> : null}
            <div>
              <strong>Deliberately leaves out</strong>
              <ul>{record.deliberateOmissions.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <details>
              <summary>Trace, sources, and current unknowns</summary>
              <ol className="architecture-band__trace">
                {record.lifecycleTrace.map((step) => (
                  <li key={step.order}>
                    <strong>{step.label}</strong> <span>{step.owner}</span>
                    <p>{step.outcome}</p>
                  </li>
                ))}
              </ol>
              <ul>
                {record.sourceIds.map((sourceId) => {
                  const source = sources.get(sourceId);
                  if (!source) return null;
                  return <li key={sourceId}><a href={source.canonicalUrl}>{source.title}</a></li>;
                })}
              </ul>
              <p>{record.unknowns.join(" ")}</p>
              <p className="interface-text">Evidence: {record.evidenceGrade} · {record.evidenceFidelity.replaceAll("-", " ")}</p>
            </details>
          </footer>
        </article>
      ))}
    </div>
  );
}
