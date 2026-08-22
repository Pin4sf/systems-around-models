import type { Metadata } from "next";
import { ArchitectureComparison } from "@/components/architectures/architecture-comparison";
import { ArchitectureGallery } from "@/components/architectures/architecture-gallery";
import { NormalizedTopology } from "@/components/architectures/normalized-topology";
import { loadContent } from "@/lib/content/load-content";
import { canonicalUrl } from "@/lib/publication/site-url";
import { createCorrectionUrl } from "@/components/article/evidence-badge";
import { listArchitectureStudies } from "@/lib/study-guide/architecture-study-registry";

export const metadata: Metadata = {
  title: "The Big Agent Harness Architecture Comparison",
  description: "Compare where real agent systems place control, state, authority, recovery, and proof.",
  alternates: { canonical: canonicalUrl("/architectures") },
  openGraph: {
    title: "The Big Agent Harness Architecture Comparison",
    description: "A visual field map of major coding harnesses, stateful runtimes, and memory systems.",
    url: canonicalUrl("/architectures"),
    type: "article",
  },
};

const lenses = [
  ["Job", "What work is this system actually trying to own?"],
  ["Control", "Who decides what happens next?"],
  ["State", "What survives the current model call?"],
  ["Authority", "Who may cause which effects?"],
  ["Recovery", "Where can interrupted work re-enter?"],
  ["Verification", "What evidence can establish the result?"],
  ["Deliberate omission", "Which responsibility stays outside the system?"],
] as const;

export default async function ArchitecturesPage() {
  const content = await loadContent();
  const baseline = content.architectures.get("architecture-baseline-harness");
  const lesson = content.lessons.get("lesson-how-to-compare-agent-systems");
  if (!baseline || baseline.status !== "public" || !lesson || lesson.status !== "public") {
    throw new Error("Missing public architecture baseline or comparison lesson");
  }
  const records = [...content.architectures.values()]
    .filter((record) => record.status === "public" && record.recordKind === "system")
    .sort((left, right) => left.productClass.localeCompare(right.productClass) || left.name.localeCompare(right.name));
  const correctionUrl = createCorrectionUrl({
    route: "/architectures",
    revisionId: `${lesson.id}@${lesson.revision}`,
    sectionAnchor: "method-title",
    claimId: "architecture-comparison",
  });
  const studySlugs = new Set(listArchitectureStudies().map((study) => {
    const record = content.architectures.get(study.architectureId);
    if (!record) throw new Error(`Missing architecture study record: ${study.architectureId}`);
    return record.slug;
  }));

  return (
    <article className="architecture-reader">
      <header className="architecture-hero">
        <p className="eyebrow interface-text">The Big Agent Harness Architecture Comparison</p>
        <h1>Many harnesses, different jobs.</h1>
        <p className="architecture-hero__deck">
          A field map of where real agent systems place control, state, authority, recovery, and proof—compared on common responsibilities, not a leaderboard.
        </p>
        <p className="architecture-hero__meta interface-text">First public edition · 9 source-pinned profiles · 2 extended studies · 1 shared comparison grammar</p>
        <nav className="architecture-jump interface-text" aria-label="On this page">
          <a href="#baseline">Learn the baseline</a>
          <a href="#comparison">Compare systems</a>
          <a href="#gallery">Browse the gallery</a>
        </nav>
      </header>

      <section className="architecture-section architecture-section--baseline" id="baseline" aria-labelledby="baseline-title">
        <div className="architecture-section__intro prose">
          <p className="eyebrow interface-text">Start with a baseline</p>
          <h2 id="baseline-title">A harness in six responsibilities</h2>
          <p>{baseline.summary}</p>
          <p><strong>A model response is not completion.</strong> The loop is only the beginning; production systems must also locate authority, recovery, evidence, and acceptance.</p>
        </div>
        <NormalizedTopology record={baseline} />
      </section>

      <section className="architecture-section" aria-labelledby="lenses-title">
        <div className="architecture-section__intro prose">
          <p className="eyebrow interface-text">An 8-minute comparison lesson</p>
          <h2 id="lenses-title">Choose a comparison lens</h2>
          <p>{lesson.transferableLesson}</p>
        </div>
        <dl className="comparison-lenses">
          {lenses.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}
        </dl>
      </section>

      <section className="architecture-section architecture-section--wide" id="comparison" aria-labelledby="comparison-title">
        <div className="architecture-section__intro prose">
          <p className="eyebrow interface-text">Shared axes, different boundaries</p>
          <h2 id="comparison-title">Read across, not down</h2>
          <p>The table asks the same questions of every system. A narrow memory layer can therefore be studied honestly beside a coding harness without pretending they are substitutes.</p>
        </div>
        <ArchitectureComparison records={records} studySlugs={studySlugs} />
      </section>

      <section className="architecture-section architecture-section--wide" id="gallery" aria-labelledby="gallery-title">
        <div className="architecture-section__intro prose">
          <p className="eyebrow interface-text">Architecture gallery</p>
          <h2 id="gallery-title">See each system in its own shape</h2>
          <p>This is a working field map. Each profile uses the same visual grammar, but unsupported responsibilities remain external, delegated, or explicitly unestablished.</p>
        </div>
        <ArchitectureGallery records={records} sources={content.sources} studySlugs={studySlugs} />
      </section>

      <section className="architecture-method prose" aria-labelledby="method-title">
        <p className="eyebrow interface-text">How this comparison was made</p>
        <h2 id="method-title">Boundaries before features</h2>
        <p>{lesson.problem} {lesson.mechanism} {lesson.failureBoundary}</p>
        <p>The first edition favors major, instructive systems with official public sources. Profiles marked “deep dive needed” are useful working maps, not final dossiers; their open questions are preserved inside each profile.</p>
        <p><a href={correctionUrl}>Suggest a correction</a></p>
      </section>
    </article>
  );
}
