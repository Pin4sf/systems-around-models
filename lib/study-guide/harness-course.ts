export type CourseChapter = {
  number: number;
  title: string;
  href?: string;
};

export type CoursePart = {
  id: string;
  label: string;
  description: string;
  chapters: CourseChapter[];
};

export const harnessCourse: CoursePart[] = [
  {
    id: "foundations",
    label: "Part I — Foundations",
    description: "Define the harness boundary, learn the H0→H9 progression, and diagnose recurring failure classes.",
    chapters: [
      { number: 1, title: "Model, agent, harness, environment, and platform", href: "/fieldbook/the-model-is-not-the-agent" },
      { number: 2, title: "The H0→H9 progression", href: "/fieldbook/the-h0-to-h9-progression" },
      { number: 3, title: "Twelve recurring failure classes", href: "/fieldbook/twelve-recurring-failure-classes" },
      { number: 4, title: "Four surface classes", href: "/fieldbook/four-surface-classes" },
      { number: 5, title: "Developer harnesses and product-runtime harnesses", href: "/fieldbook/developer-and-product-runtime-harnesses" },
    ],
  },
  {
    id: "runtime-mechanisms",
    label: "Part II — Runtime mechanisms",
    description: "Study how context, tools, environments, durable state, control structures, and memory work together.",
    chapters: [
      { number: 6, title: "Instructions and context assembly" },
      { number: 7, title: "Tools, capability manifests, and binding" },
      { number: 8, title: "Environments, sandboxes, and custody" },
      { number: 9, title: "State, journals, checkpoints, and replay" },
      { number: 10, title: "Loops, workflows, graphs, and delegation" },
      { number: 11, title: "Memory, compaction, and continuity" },
    ],
  },
  {
    id: "reliable-action",
    label: "Part III — Reliable action",
    description: "Move from possible actions to authorized, bounded, recoverable effects in the world.",
    chapters: [
      { number: 12, title: "Identity, authority, and admission" },
      { number: 13, title: "Leases, fencing, cancellation, and budgets" },
      { number: 14, title: "External effects and transactional outboxes" },
      { number: 15, title: "Ambiguity, idempotency, and recovery" },
      { number: 16, title: "Security, credentials, supply chain, and revocation" },
    ],
  },
  {
    id: "evidence-completion",
    label: "Part IV — Evidence and completion",
    description: "Separate execution from proof, verification, acceptance, closure, and re-entry.",
    chapters: [
      { number: 17, title: "Observability and trace reconstruction" },
      { number: 18, title: "Maker/checker separation" },
      { number: 19, title: "Evidence, verification, policy, acceptance, and closure" },
      { number: 20, title: "Open loops and re-entry" },
    ],
  },
  {
    id: "comparative-cases",
    label: "Part V — Comparative cases",
    description: "Compare real systems by the responsibilities they own, exclude, and verify—not by a universal leaderboard.",
    chapters: [
      { number: 21, title: "Anthropic long-running harnesses" },
      { number: 22, title: "Cursor" },
      { number: 23, title: "LangGraph" },
      { number: 24, title: "Hermes" },
      { number: 25, title: "QM" },
      { number: 26, title: "Cloudflare Think and Agents" },
      { number: 27, title: "DeepSeek Harness and Cordis" },
      { number: 28, title: "Drover" },
      { number: 29, title: "Spotify Xirp and Portal" },
      { number: 30, title: "Factory Missions versus GitHub Copilot" },
      { number: 31, title: "Devin, Greptile, CodeRabbit, and Qodo" },
      { number: 32, title: "A bounded whole-product case study" },
    ],
  },
  {
    id: "evaluation-evolution",
    label: "Part VI — Evaluation and evolution",
    description: "Evaluate model-and-harness configurations, inject failure, and improve the system without letting it edit its judge.",
    chapters: [
      { number: 33, title: "Model × harness evaluation" },
      { number: 34, title: "Conformance and trajectory evaluation" },
      { number: 35, title: "Failure injection and recovery evaluation" },
      { number: 36, title: "Harness learning, promotion, and retirement" },
    ],
  },
  {
    id: "course-publication",
    label: "Part VII — Course and practice",
    description: "Turn the concepts into labs, a capstone system, review rituals, and a maintainable learning resource.",
    chapters: [
      { number: 37, title: "Twelve labs" },
      { number: 38, title: "Capstone" },
      { number: 39, title: "Review questions and design worksheet" },
      { number: 40, title: "Keeping the guide current" },
    ],
  },
];

export const harnessChapterCount = harnessCourse.reduce(
  (total, part) => total + part.chapters.length,
  0,
);
