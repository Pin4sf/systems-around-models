import type { EssayMetadata, RevisionRecord } from "@/lib/content/schema";
import { createCorrectionUrl } from "@/components/article/evidence-badge";

type RevisionNoticeProps = {
  essay: EssayMetadata;
  revision: RevisionRecord;
  placement: "beginning" | "end";
};

export function RevisionNotice({ essay, revision, placement }: RevisionNoticeProps) {
  const revisionUrl = `https://github.com/Pin4sf/systems-around-models/blob/main/content/revisions/${revision.id}.yaml`;
  const correctionUrl = createCorrectionUrl({
    route: `/fieldbook/${essay.slug}`,
    revisionId: revision.id,
    sectionAnchor: placement === "beginning" ? "article" : "sources-and-revision-record",
    claimId: "article-wide-correction",
  });

  return (
    <aside
      className={`revision-notice revision-notice--${placement} interface-text`}
      aria-label={`${placement === "beginning" ? "Article" : "Closing"} revision record`}
    >
      <dl>
        <div>
          <dt>Published</dt>
          <dd>{essay.publishedAt}</dd>
        </div>
        <div>
          <dt>Substantive revision</dt>
          <dd>{essay.substantivelyRevisedAt}</dd>
        </div>
        <div>
          <dt>Revision</dt>
          <dd>
            <a href={revisionUrl}>{revision.id}</a>
          </dd>
        </div>
      </dl>
      {placement === "end" ? (
        <>
          <p>{revision.summary}</p>
          <a className="revision-notice__correction" href={correctionUrl}>
            Report an article correction
          </a>
        </>
      ) : null}
    </aside>
  );
}
