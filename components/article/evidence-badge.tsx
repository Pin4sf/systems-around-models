import type { ClaimRecord, SourceRecord } from "@/lib/content/schema";

const labelDefinitions: Record<ClaimRecord["label"], string> = {
  observed: "Directly inspected in a cited artifact, document, or reproduced behavior.",
  "author-reported": "Reported by the named author or builder and not independently reproduced here.",
  inferred: "Derived from observed mechanisms or multiple sources; the conclusion remains falsifiable.",
  proposed: "Introduced by Systems Around Models as a working method, not asserted as an industry standard.",
  unproved: "Described or designed without sufficient implementation or operational evidence.",
};

const labelNames: Record<ClaimRecord["label"], string> = {
  observed: "Observed",
  "author-reported": "Author-reported",
  inferred: "Inferred",
  proposed: "Proposed",
  unproved: "Unproved",
};

type EvidenceBadgeProps = {
  claimId: string;
  claims: Map<string, ClaimRecord>;
  sources: Map<string, SourceRecord>;
  route: string;
  revisionId: string;
  sectionAnchor?: string;
  challengeLabel?: string;
};

export function createCorrectionUrl({
  route,
  revisionId,
  sectionAnchor = "article",
  claimId,
}: Pick<EvidenceBadgeProps, "route" | "revisionId" | "sectionAnchor" | "claimId">) {
  const issueUrl = new URL(
    "https://github.com/Pin4sf/systems-around-models/issues/new",
  );
  issueUrl.searchParams.set("title", `Correction: ${claimId}`);
  issueUrl.searchParams.set(
    "body",
    [
      "Repository: Pin4sf/systems-around-models",
      `Page route: ${route}`,
      `Article revision: ${revisionId}`,
      `Section anchor: #${sectionAnchor}`,
      `Claim ID: ${claimId}`,
      "",
      "Disputed statement:",
      "",
      "Counter-evidence (public links only):",
      "",
      "Requested correction:",
      "",
      "Please do not include credentials, personal data, health data, private traces, or copyrighted documents.",
    ].join("\n"),
  );
  return issueUrl.toString();
}

export function EvidenceBadge({
  claimId,
  claims,
  sources,
  route,
  revisionId,
  sectionAnchor,
  challengeLabel = "Challenge this claim",
}: EvidenceBadgeProps) {
  const claim = claims.get(claimId);
  if (!claim) {
    throw new Error(`Unknown public claim: ${claimId}`);
  }

  const supportingSources = claim.sourceIds.map((sourceId) => {
    const source = sources.get(sourceId);
    if (!source) throw new Error(`Unknown public source: ${sourceId}`);
    return source;
  });
  const label = labelNames[claim.label];
  const detailsId = `evidence-${claim.id}`;
  const correctionUrl = createCorrectionUrl({ route, revisionId, sectionAnchor, claimId });

  return (
    <aside className={`evidence-badge evidence-badge--${claim.label}`} aria-label={`${label} evidence`}>
      <details
        className="evidence-disclosure"
        id={detailsId}
        role="group"
        aria-label={`${label} evidence`}
      >
        <summary className="evidence-disclosure__summary trace-text">{label}</summary>
        <div className="evidence-disclosure__details">
          <p className="evidence-disclosure__definition">{labelDefinitions[claim.label]}</p>
          <p>{claim.statement}</p>
          <dl className="evidence-disclosure__record interface-text">
            <div>
              <dt>Scope</dt>
              <dd>{claim.scope}</dd>
            </div>
            <div>
              <dt>Last reviewed</dt>
              <dd>{claim.lastReviewed}</dd>
            </div>
            <div>
              <dt>Claim revision</dt>
              <dd>{claim.revision}</dd>
            </div>
          </dl>
          <div className="evidence-disclosure__sources">
            <p className="eyebrow trace-text">Sources</p>
            {supportingSources.map((source) => (
              <section className="evidence-source" key={source.id}>
                <h4>
                  <a href={source.canonicalUrl}>{source.title}</a>
                </h4>
                <dl className="evidence-source__record interface-text">
                  <div>
                    <dt>Source type</dt>
                    <dd>{source.sourceType === "publication-synthesis" ? "Publication synthesis" : "First-party essay"}</dd>
                  </div>
                  <div>
                    <dt>Source basis</dt>
                    <dd>{source.basis}</dd>
                  </div>
                  <div>
                    <dt>Evidence grade</dt>
                    <dd>{source.evidenceGrade}</dd>
                  </div>
                  <div>
                    <dt>Last validated</dt>
                    <dd>{source.lastValidated}</dd>
                  </div>
                  <div>
                    <dt>License status</dt>
                    <dd>{source.licenseStatus}</dd>
                  </div>
                </dl>
                <h5>Observed mechanisms</h5>
                {source.observedMechanisms.length > 0 ? (
                  <ul>
                    {source.observedMechanisms.map((mechanism) => (
                      <li key={mechanism.description}>
                        {mechanism.description} <span className="trace-text">{mechanism.evidenceGrade}</span>
                        <span className="evidence-source__basis">Basis: {mechanism.basis}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p>None recorded.</p>}
                <h5>Author-reported statements</h5>
                {source.authorReportedClaims.length > 0 ? (
                  <ul>
                    {source.authorReportedClaims.map((statement) => <li key={statement}>{statement}</li>)}
                  </ul>
                ) : <p>None recorded.</p>}
                <h5>Unknowns</h5>
                <ul>
                  {source.unknowns.map((unknown) => <li key={unknown}>{unknown}</li>)}
                </ul>
              </section>
            ))}
          </div>
          <div className="evidence-disclosure__falsifiers">
            <p className="eyebrow trace-text">What would change this claim</p>
            <ul>
              {claim.falsifiers.map((falsifier) => (
                <li key={falsifier}>{falsifier}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
      <a
        className="evidence-disclosure__challenge interface-text"
        href={correctionUrl}
      >
        {challengeLabel}
      </a>
    </aside>
  );
}
