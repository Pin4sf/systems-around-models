import Link from "next/link";
import type { EssayMetadata } from "@/lib/content/schema";
import { getStudyGuideEntryForEssay } from "@/lib/study-guide/study-guide-registry";

function SequenceLinks({ essay, releasedEssays }: { essay: EssayMetadata; releasedEssays: EssayMetadata[] }) {
  const guide = getStudyGuideEntryForEssay(essay, releasedEssays);
  return (
    <ol>
      {guide.navigation.items.map((item) => {
        if (item.kind === "link") {
          return (
            <li key={item.label}>
              {item.eyebrow ? <span>{item.eyebrow}</span> : null}
              <Link href={item.href}>{item.label}</Link>
            </li>
          );
        }
        if (item.kind === "current") {
          return (
            <li key={item.label} aria-current="page">
              {item.eyebrow ? <span>{item.eyebrow}</span> : null}
              {item.label}
            </li>
          );
        }
        return (
          <li key={item.label} className="sequence-navigation__forthcoming">
            <span>{item.eyebrow}</span>
            {item.label}
          </li>
        );
      })}
    </ol>
  );
}

export function SequenceNavigation({ essay, releasedEssays }: { essay: EssayMetadata; releasedEssays: EssayMetadata[] }) {
  const guide = getStudyGuideEntryForEssay(essay, releasedEssays);
  return (
    <aside className="sequence-navigation interface-text">
      <nav
        className="sequence-navigation__desktop"
        aria-label={guide.navigation.label}
      >
        <p className="eyebrow">{guide.sequenceName}</p>
        <SequenceLinks essay={essay} releasedEssays={releasedEssays} />
      </nav>
      <details className="sequence-navigation__mobile">
        <summary role="button">{guide.navigation.drawerLabel}</summary>
        <div aria-label={guide.navigation.mobileLabel}>
          <SequenceLinks essay={essay} releasedEssays={releasedEssays} />
        </div>
      </details>
    </aside>
  );
}

type ArticlePagerProps = {
  essay: EssayMetadata;
  releasedEssays: EssayMetadata[];
};

export function ArticlePager({ essay, releasedEssays }: ArticlePagerProps) {
  const guide = getStudyGuideEntryForEssay(essay, releasedEssays);
  const bySlug = new Map(releasedEssays.map((releasedEssay) => [releasedEssay.slug, releasedEssay]));
  const previous = essay.previousEssaySlug ? bySlug.get(essay.previousEssaySlug) : undefined;
  const next = essay.nextEssaySlug ? bySlug.get(essay.nextEssaySlug) : undefined;

  return (
    <nav className="article-pager interface-text" aria-label={`Previous and next ${guide.sequenceName} reading`}>
      {previous ? (
        <Link
          href={`/fieldbook/${previous.slug}`}
          rel="prev"
          aria-label={`Previous: ${previous.title}`}
        >
          <span>Previous</span>
          {previous.title}
        </Link>
      ) : (
        <Link
          href={guide.navigation.overview.href}
          rel="prev"
          aria-label={`Previous: ${guide.navigation.overview.label}`}
        >
          <span>Previous</span>
          {guide.navigation.overview.label}
        </Link>
      )}
      {next ? (
        <Link
          href={`/fieldbook/${next.slug}`}
          rel="next"
          aria-label={`Next: ${next.title}`}
        >
          <span>Next</span>
          {next.title}
        </Link>
      ) : guide.finalLabel ? (
        <p className="article-pager__forthcoming">
          <span>Next chapter</span>
          {guide.finalLabel}
        </p>
      ) : null}
    </nav>
  );
}
