const traceSteps = [
  {
    label: "Admit",
    explanation: "Decide whether this work may enter the system and under which authority.",
  },
  {
    label: "Context",
    explanation: "Compile the relevant task, user, environment, and prior state into usable context.",
  },
  {
    label: "Capabilities",
    explanation: "Bind the tools, permissions, and boundaries that make particular actions possible.",
  },
  {
    label: "Execute",
    explanation: "Run the selected model and harness procedure against the available capabilities.",
  },
  {
    label: "State",
    explanation: "Commit the durable state needed to understand what was attempted and what remains open.",
  },
  {
    label: "Effect",
    explanation: "Attempt the intended change in the external world, which may succeed, fail, or remain ambiguous.",
  },
  {
    label: "Reconcile",
    explanation: "Compare the attempted effect with the system record and resolve any disagreement.",
  },
  {
    label: "Evidence",
    explanation: "Collect inspectable evidence for what occurred, rather than treating the model response as proof.",
  },
  {
    label: "Verify",
    explanation: "Check whether the observed effect meets the stated conditions for success.",
  },
  {
    label: "Accept or re-enter",
    explanation: "Consciously close the work when it is accepted, or return it to the system with the new evidence.",
  },
] as const;

type SystemTraceProps = {
  compact?: boolean;
  headingLevel?: 2 | 3;
};

export function SystemTrace({ compact = false, headingLevel = 2 }: SystemTraceProps) {
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <section className={`system-trace${compact ? " system-trace--compact" : ""}`} aria-labelledby="system-trace-title">
      <div className="system-trace__heading">
        <p className="eyebrow trace-text">System trace</p>
        <Heading id="system-trace-title">The work around a model</Heading>
      </div>
      <ol className="system-trace__steps" aria-label="Agent system trace">
        {traceSteps.map((step, index) => {
          const explanationId = `system-trace-step-${index}-explanation`;

          return (
            <li className="system-trace__step" key={step.label} aria-describedby={explanationId}>
              <span data-testid="trace-step" className="system-trace__label trace-text">
                {step.label}
              </span>
              <span className="visually-hidden" id={explanationId}>
                {step.explanation}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
