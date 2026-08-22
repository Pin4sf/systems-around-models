import { render, screen, within } from "@testing-library/react";
import ArchitecturesPage from "@/app/architectures/page";

it("teaches a baseline before comparing real systems", async () => {
  render(await ArchitecturesPage());

  expect(
    screen.getByRole("heading", { name: "Many harnesses, different jobs.", level: 1 }),
  ).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "A harness in six responsibilities" })).toBeInTheDocument();
  const baseline = screen.getByRole("region", { name: "A harness in six responsibilities" });
  expect(within(baseline).getByText("Admit", { selector: "strong" })).toBeInTheDocument();
  expect(within(baseline).getByText("Verify and close", { selector: "strong" })).toBeInTheDocument();
  expect(screen.getByText(/not a leaderboard/i)).toBeInTheDocument();
});

it("renders one semantic comparison and gallery from the public cohort", async () => {
  render(await ArchitecturesPage());

  const table = screen.getByRole("table", { name: "Agent architecture comparison" });
  expect(within(table).getByText("OpenAI Codex")).toBeInTheDocument();
  expect(within(table).getByText("Letta")).toBeInTheDocument();
  expect(within(table).getByText("Graphiti")).toBeInTheDocument();
  expect(within(table).getByRole("columnheader", { name: "Deliberate omission" })).toBeInTheDocument();
  expect(document.querySelectorAll("article[id^='system-']")).toHaveLength(9);
  expect(screen.getByRole("link", { name: "OpenAI Codex profile" })).toHaveAttribute(
    "href",
    "/architectures/openai-codex",
  );
  expect(screen.getByRole("link", { name: "DeepSeek Harness and Cordis profile" })).toHaveAttribute(
    "href",
    "/architectures/deepseek-harness-cordis",
  );
  expect(screen.getAllByRole("link", { name: "Read the architecture study" })).toHaveLength(2);
  expect(screen.queryByText(/rank|winner|score/i)).not.toBeInTheDocument();
});

it("does not assign an unknown recovery path to an unnamed delegate", async () => {
  render(await ArchitecturesPage());

  for (const slug of ["claude-code", "gemini-cli", "openhands"]) {
    const profile = document.querySelector(`#system-${slug}`);
    expect(profile).not.toBeNull();
    const recovery = [...(profile as HTMLElement).querySelectorAll(".topology-step")]
      .find((step) => step.querySelector("strong")?.textContent === "Recover");
    expect(recovery).toHaveTextContent("not established");
  }
});

it("keeps research machinery quiet while preserving visible limits", async () => {
  render(await ArchitecturesPage());

  expect(screen.getAllByText("Deliberately leaves out").length).toBeGreaterThan(0);
  expect(screen.getByText(/working field map/i)).toBeInTheDocument();
  expect(screen.queryByText(/correction ledger status|source manifest id|evidence badge/i)).not.toBeInTheDocument();
});
