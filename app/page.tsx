import Link from "next/link";
import { SystemTrace } from "@/components/diagrams/system-trace";
import { harnessChapterCount, harnessCourse } from "@/lib/study-guide/harness-course";

export default function HomePage() {
  return (
    <article className="homepage">
      <header className="homepage__hero prose">
        <p className="eyebrow interface-text">A visual study hub for agent systems</p>
        <h1>Study the machinery around models.</h1>
        <p className="homepage__lede">
          Learn harnesses, memory, authority, recovery, and verification—then compare how real
          systems arrange them. Start with the complete guide or follow the question you are building around.
        </p>
        <p className="homepage__course-stats interface-text">
          {harnessChapterCount} chapters · 12 labs · 1 capstone
        </p>
        <Link className="homepage__chapter-link interface-text" href="/fieldbook/harness-engineering-study-guide">
          Start with Harness Engineering
        </Link>
        <Link className="homepage__chapter-link homepage__chapter-link--secondary interface-text" href="/architectures">
          Explore architectures
        </Link>
      </header>

      <SystemTrace />

      <section className="study-paths" aria-labelledby="study-paths-title">
        <div className="course-map__heading prose">
          <p className="eyebrow interface-text">Start here</p>
          <h2 id="study-paths-title">Three ways into the field</h2>
          <p>Read chronologically, compare real systems, or move between concepts as your own architecture takes shape.</p>
        </div>
        <div className="study-paths__rows">
          <Link href="/fieldbook/harness-engineering-study-guide">
            <span className="interface-text">01 · Complete guide</span>
            <strong>Harness Engineering</strong>
            <small>Learn the runtime responsibilities around a model.</small>
          </Link>
          <Link href="/fieldbook/memory-engineering-study-guide">
            <span className="interface-text">02 · Complete guide</span>
            <strong>Memory Engineering</strong>
            <small>Design memory as a governed lifecycle, not a vector lookup.</small>
          </Link>
          <Link href="/architectures">
            <span className="interface-text">03 · Field map</span>
            <strong>Architecture Comparison</strong>
            <small>Compare major harnesses and memory systems without a universal leaderboard.</small>
          </Link>
        </div>
      </section>

      <section className="homepage__section prose" aria-labelledby="what-you-will-learn">
        <p className="eyebrow interface-text">What this guide teaches</p>
        <h2 id="what-you-will-learn">The model is one component. The system does the work.</h2>
        <p>
          A useful agent needs more than a prompt and a tool call. It needs a harness that can
          assemble the right context, bind the right capabilities, preserve enough state to
          recover, handle ambiguous effects, and distinguish execution from verified completion.
          The guide builds that understanding one responsibility at a time.
        </p>
      </section>

      <section className="course-map" id="chapters" aria-labelledby="course-map-title">
        <div className="course-map__heading prose">
          <p className="eyebrow interface-text">The complete syllabus</p>
          <h2 id="course-map-title">The curriculum behind the guide</h2>
          <p>
            Start with the complete short guide, then use this map to go deeper. It comes from a
            forty-chapter working manuscript built from agent runtimes, coding agents, workflow
            systems, memory systems, evaluation research, and failure reports. Detailed chapters
            will be released as they are edited for the web.
          </p>
        </div>
        <div className="course-map__parts">
          {harnessCourse.map((part) => (
            <section className="course-part" key={part.id} aria-labelledby={`${part.id}-title`}>
              <div className="course-part__heading">
                <h3 id={`${part.id}-title`}>{part.label}</h3>
                <span className="interface-text">{part.chapters.length} chapters</span>
              </div>
              <p>{part.description}</p>
              <ol start={part.chapters[0]?.number}>
                {part.chapters.map((chapter) => (
                  <li key={chapter.number}>
                    {chapter.href ? <Link href={chapter.href}>{chapter.title}</Link> : chapter.title}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>

      <section className="homepage__section prose" aria-labelledby="memory-guide-title">
        <p className="eyebrow interface-text">Companion guide</p>
        <h2 id="memory-guide-title">Memory Engineering: a practical companion guide</h2>
        <p>
          Design agent memory as a governed lifecycle: what a record means, where it came from,
          when it may influence work, how it is corrected, and when it is removed.
        </p>
        <Link
          className="homepage__chapter-link interface-text"
          href="/fieldbook/memory-engineering-study-guide"
        >
          Read the Memory guide
        </Link>
      </section>

      <footer className="homepage__status interface-text">
        <p>Public working edition · Read the short course now; detailed chapters follow</p>
      </footer>
    </article>
  );
}
