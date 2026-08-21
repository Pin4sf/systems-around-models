import Link from "next/link";

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

export function ArticlePager() {
  return (
    <nav className="article-pager interface-text" aria-label="Previous and next chapters">
      <Link
        href="/#harness-engineering"
        rel="prev"
        aria-label="Previous: Harness Engineering overview"
      >
        <span>Previous</span>
        Harness Engineering overview
      </Link>
      <Link
        href="/#memory-engineering"
        rel="next"
        aria-label="Next: Memory Engineering overview"
      >
        <span>Next</span>
        Memory Engineering overview
      </Link>
    </nav>
  );
}
