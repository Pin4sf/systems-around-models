import Link from "next/link";
import { SystemTrace } from "@/components/diagrams/system-trace";
import { harnessChapterCount, harnessCourse } from "@/lib/study-guide/harness-course";

export default function HomePage() {
  return (
    <article className="homepage">
      <header className="homepage__hero prose">
        <p className="eyebrow interface-text">A free, practical study guide</p>
        <h1>Harness Engineering, from first principles.</h1>
        <p className="homepage__lede">
          Learn the systems around a model: instructions, tools, runtime loops, environments,
          state, memory, authority, recovery, verification, and completion. Read it in order or
          use it as a reference while you build.
        </p>
        <p className="homepage__course-stats interface-text">
          {harnessChapterCount} chapters · 12 labs · 1 capstone
        </p>
        <Link className="homepage__chapter-link interface-text" href="/fieldbook/harness-engineering-study-guide">
          Start reading
        </Link>
      </header>

      <SystemTrace />

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

      <footer className="homepage__status interface-text">
        <p>Public working edition · Read the short course now; detailed chapters follow</p>
      </footer>
    </article>
  );
}
