import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { PublicationShell } from "@/components/publication-shell";

it("presents a simple study-guide navigation", () => {
  render(
    <PublicationShell>
      <p>Reader</p>
    </PublicationShell>,
  );

  expect(screen.getByText("Systems Around Models")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "By Shivansh Fulper · Portfolio" })).toHaveAttribute(
    "href",
    "https://shivansh-portfolio-one.vercel.app",
  );
  expect(
    screen.getByRole("navigation", { name: "Publication" }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/Waldo/i)).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Harness" })).toHaveAttribute(
    "href",
    "/fieldbook/harness-engineering-study-guide",
  );
  expect(screen.getByRole("link", { name: "Memory" })).toHaveAttribute(
    "href",
    "/fieldbook/memory-engineering-study-guide",
  );
  expect(screen.getByRole("link", { name: "Architectures" })).toHaveAttribute(
    "href",
    "/architectures",
  );
  expect(screen.getByRole("link", { name: "Start here" })).toHaveAttribute("href", "/");
  expect(screen.queryByText(/forthcoming/i)).not.toBeInTheDocument();
});

it("offers architecture comparison as a first-class study path", async () => {
  render(await HomePage());

  expect(screen.getByRole("heading", { name: "Study the machinery around models." })).toBeInTheDocument();
  expect(screen.getByText("The agent systems fieldbook")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Explore architectures" })).toHaveAttribute(
    "href",
    "/architectures",
  );
  expect(screen.getByRole("heading", { name: "Three ways into the field" })).toBeInTheDocument();
});

it("offers the released Memory companion as ordinary reading", async () => {
  render(await HomePage());

  expect(
    screen.getByRole("heading", { name: "Memory Engineering: a practical companion guide" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Read the Memory guide" })).toHaveAttribute(
    "href",
    "/fieldbook/memory-engineering-study-guide",
  );
  expect(screen.queryByText(/evidence badge|revision panel|source drawer/i)).not.toBeInTheDocument();
});

it("leads readers into a complete harness-engineering course map", async () => {
  render(await HomePage());

  expect(
    screen.getByRole("heading", {
      name: "Study the machinery around models.",
      level: 1,
    }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Start with Harness Engineering" })).toHaveAttribute(
    "href",
    "/fieldbook/harness-engineering-study-guide",
  );
  expect(screen.getByText("40 chapters · 12 labs · 1 capstone")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "The curriculum behind the guide" })).toBeInTheDocument();
  expect(screen.getByText("Part I — Foundations")).toBeInTheDocument();
  expect(screen.getByText("Part IV — Evidence and completion")).toBeInTheDocument();
  expect(screen.getByText("Part VI — Evaluation and evolution")).toBeInTheDocument();
  expect(screen.queryByText("The 40+ system case atlas")).not.toBeInTheDocument();
  expect(screen.queryByText("Twelve labs and a capstone")).not.toBeInTheDocument();
  expect(screen.queryByText("Evidence before confidence")).not.toBeInTheDocument();
  expect(screen.queryByText("Corrections stay visible")).not.toBeInTheDocument();
  for (const [name, href] of [
    ["The H0→H9 progression", "/fieldbook/the-h0-to-h9-progression"],
    ["Twelve recurring failure classes", "/fieldbook/twelve-recurring-failure-classes"],
    ["Four surface classes", "/fieldbook/four-surface-classes"],
    ["Developer and Product-Runtime Harnesses", "/fieldbook/developer-and-product-runtime-harnesses"],
    ["Instructions and context assembly", "/fieldbook/instructions-and-context-assembly"],
    ["Tools, capability manifests, and binding", "/fieldbook/tools-capability-manifests-and-binding"],
    ["Environments, sandboxes, and custody", "/fieldbook/environments-sandboxes-and-custody"],
    ["State, journals, checkpoints, and replay", "/fieldbook/state-journals-checkpoints-and-replay"],
    ["Loops, workflows, graphs, and delegation", "/fieldbook/loops-workflows-graphs-and-delegation"],
    ["Memory, compaction, and continuity", "/fieldbook/memory-compaction-and-continuity"],
    ["Identity, Authority, and Admission", "/fieldbook/identity-authority-and-admission"],
    ["Leases, Fencing, Cancellation, and Budgets", "/fieldbook/leases-fencing-cancellation-and-budgets"],
    ["External Effects and Transactional Outboxes", "/fieldbook/external-effects-and-transactional-outboxes"],
    ["Ambiguity, Idempotency, and Recovery", "/fieldbook/ambiguity-idempotency-and-recovery"],
    ["Security, Credentials, Supply Chain, and Revocation", "/fieldbook/security-credentials-supply-chain-and-revocation"],
    ["Observability and Trace Reconstruction", "/fieldbook/observability-and-trace-reconstruction"],
    ["Maker/Checker Separation", "/fieldbook/maker-checker-separation"],
    ["Evidence, Verification, Policy, Acceptance, and Closure", "/fieldbook/evidence-verification-policy-acceptance-and-closure"],
    ["Open Loops and Re-entry", "/fieldbook/open-loops-and-re-entry"],
  ]) {
    expect(screen.getByRole("link", { name: new RegExp(name, "i") })).toHaveAttribute("href", href);
  }
  expect(screen.getByText("Anthropic long-running harnesses").closest("li"))
    .toHaveTextContent("Coming next");
});
