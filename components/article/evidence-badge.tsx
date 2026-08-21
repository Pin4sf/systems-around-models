import type { ClaimRecord, SourceRecord } from "@/lib/content/schema";
import { EvidenceDisclosure } from "@/components/article/evidence-disclosure";

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
      <EvidenceDisclosure buttonLabel={label} detailsId={detailsId}>
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
          <ul>
            {supportingSources.map((source) => (
              <li key={source.id}>
                <a href={source.canonicalUrl}>{source.title}</a>
                <span className="trace-text"> {source.evidenceGrade}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="evidence-disclosure__falsifiers">
          <p className="eyebrow trace-text">What would change this claim</p>
          <ul>
            {claim.falsifiers.map((falsifier) => (
              <li key={falsifier}>{falsifier}</li>
            ))}
          </ul>
        </div>
      </EvidenceDisclosure>
      <a
        className="evidence-disclosure__challenge interface-text"
        href={correctionUrl}
      >
        {challengeLabel}
      </a>
    </aside>
  );
}
