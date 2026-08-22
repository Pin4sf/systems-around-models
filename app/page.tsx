import Link from "next/link";
import { SystemTrace } from "@/components/diagrams/system-trace";

export default function HomePage() {
  return (
    <article className="homepage">
      <header className="homepage__hero prose">
        <p className="eyebrow interface-text">The Agent Systems Fieldbook</p>
        <h1>The model is only one part of the agent.</h1>
        <p className="homepage__lede">
          Systems Around Models is an independent fieldbook for examining the harnesses, memory,
          authority, and evidence that turn a model response into work in the world.
        </p>
        <Link className="homepage__chapter-link interface-text" href="/fieldbook/the-model-is-not-the-agent">
          Start with the model
        </Link>
      </header>

      <SystemTrace />

      <section className="homepage__section prose" aria-labelledby="harness-engineering">
        <p className="eyebrow interface-text">Sequence one</p>
        <h2 id="harness-engineering">Harness Engineering</h2>
        <p>
          A capable model still needs a system that can admit work, assemble context, constrain
          capabilities, preserve state, and verify effects. This sequence studies that boundary:
          the part that makes a model usable, legible, and accountable in a real environment.
        </p>
      </section>

      <section className="homepage__section prose" aria-labelledby="memory-engineering">
        <p className="eyebrow interface-text">Sequence two</p>
        <h2 id="memory-engineering">Memory Engineering</h2>
        <p>
          Memory is not a longer prompt. It is the work of deciding what a system may retain, how
          that record can be inspected and corrected, and when a past event should change the next
          decision. This sequence follows continuity without confusing accumulation for truth.
        </p>
      </section>

      <section className="homepage__promises" aria-label="Publication promises">
        <div>
          <h2>Evidence before confidence</h2>
          <p>
            Important claims name their evidence state, sources, scope, and falsifiers so readers
            can inspect what the fieldbook knows and what it does not.
          </p>
        </div>
        <div>
          <h2>Corrections stay visible</h2>
          <p>
            A claim can be challenged with counter-evidence. Substantive corrections become part
            of the public revision record rather than disappearing into an unmarked rewrite.
          </p>
        </div>
      </section>

      <footer className="homepage__status interface-text">
        <p>Alpha publication · Fieldbook v0.1 · First chapter in review</p>
      </footer>
    </article>
  );
}
