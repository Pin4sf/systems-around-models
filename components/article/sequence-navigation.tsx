import Link from "next/link";
import type { EssayMetadata } from "@/lib/content/schema";

const guideSlug = "harness-engineering-study-guide";
const firstChapterSlug = "the-model-is-not-the-agent";

function SequenceLinks({ essay }: { essay: EssayMetadata }) {
  const isGuide = essay.slug === guideSlug;
  return (
    <ol>
      <li>
        <Link href="/#chapters">Course overview</Link>
      </li>
      <li aria-current={isGuide ? "page" : undefined}>
        <span>Short course</span>
        {isGuide ? "Harness Engineering Study Guide" : (
          <Link href={`/fieldbook/${guideSlug}`}>Harness Engineering Study Guide</Link>
        )}
      </li>
      <li aria-current={!isGuide ? "page" : undefined}>
        <span>Chapter 1 of 40</span>
        {!isGuide ? "The Model Is Not the Agent" : (
          <Link href={`/fieldbook/${firstChapterSlug}`}>The Model Is Not the Agent</Link>
        )}
      </li>
      {!isGuide ? (
        <li className="sequence-navigation__forthcoming">
          <span>Up next</span>
          The H0→H9 progression
        </li>
      ) : null}
    </ol>
  );
}

export function SequenceNavigation({ essay }: { essay: EssayMetadata }) {
  return (
    <aside className="sequence-navigation interface-text">
      <nav
        className="sequence-navigation__desktop"
        aria-label="Harness Engineering chapters"
      >
        <p className="eyebrow">Harness Engineering</p>
        <SequenceLinks essay={essay} />
      </nav>
      <details className="sequence-navigation__mobile">
        <summary role="button">Open chapters</summary>
        <div aria-label="Harness Engineering chapter list">
          <SequenceLinks essay={essay} />
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
  const bySlug = new Map(releasedEssays.map((releasedEssay) => [releasedEssay.slug, releasedEssay]));
  const previous = essay.previousEssaySlug ? bySlug.get(essay.previousEssaySlug) : undefined;
  const next = essay.nextEssaySlug ? bySlug.get(essay.nextEssaySlug) : undefined;

  return (
    <nav className="article-pager interface-text" aria-label="Previous and next chapters">
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
          href="/#chapters"
          rel="prev"
          aria-label="Previous: Course overview"
        >
          <span>Previous</span>
          Course overview
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
      ) : (
        <p className="article-pager__forthcoming">
          <span>Next chapter</span>
          The H0→H9 progression
        </p>
      )}
    </nav>
  );
}
