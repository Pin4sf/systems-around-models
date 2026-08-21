import Link from "next/link";
import type { EssayMetadata } from "@/lib/content/schema";

function SequenceLinks() {
  return (
    <ol>
      <li>
        <Link href="/">Fieldbook overview</Link>
      </li>
      <li aria-current="page">The Model Is Not the Agent</li>
      <li className="sequence-navigation__forthcoming">
        <span>Next chapter</span>
        Harness responsibilities in practice · forthcoming
      </li>
    </ol>
  );
}

export function SequenceNavigation() {
  return (
    <aside className="sequence-navigation interface-text">
      <nav
        className="sequence-navigation__desktop"
        aria-label="Harness Engineering sequence"
      >
        <p className="eyebrow">Harness Engineering</p>
        <SequenceLinks />
      </nav>
      <details className="sequence-navigation__mobile">
        <summary role="button">Open sequence</summary>
        <div aria-label="Harness Engineering sequence chapters">
          <SequenceLinks />
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
          href="/#harness-engineering"
          rel="prev"
          aria-label="Previous: Harness Engineering overview"
        >
          <span>Previous</span>
          Harness Engineering overview
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
          Harness responsibilities in practice · forthcoming
        </p>
      )}
    </nav>
  );
}
