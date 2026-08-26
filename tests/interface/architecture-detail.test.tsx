import { render, screen } from "@testing-library/react";
import ArchitectureDetailPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/architectures/[slug]/page";

describe("canonical architecture studies", () => {
  it("publishes the first two source-pinned studies as static routes", async () => {
    await expect(generateStaticParams()).resolves.toEqual([
      { slug: "deepseek-harness-cordis" },
      { slug: "openai-codex" },
    ]);
  });

  it.each([
    ["openai-codex", "OpenAI Codex", "343074d4207d", "2026-08-22"],
    ["deepseek-harness-cordis", "DeepSeek Harness and Cordis", "b150a551b8d4", "2026-08-26"],
  ])("renders %s with its boundary, topology, failure mode, and retrieval check", async (slug, title, version, reviewedAt) => {
    render(await ArchitectureDetailPage({ params: Promise.resolve({ slug }) }));

    expect(screen.getByRole("heading", { name: title, level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(version)).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "System boundary", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Normalized topology", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "One complete run", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "State, authority, recovery, and proof", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Adopt, adapt, or reject", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Failure boundary", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Retrieval check", level: 2 })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Last reviewed ${reviewedAt}`))).toBeInTheDocument();
  });

  it("preserves DeepSeek's native event and lifecycle shape beside the normalized comparison", async () => {
    render(await ArchitectureDetailPage({ params: Promise.resolve({ slug: "deepseek-harness-cordis" }) }));
    expect(screen.getByRole("img", { name: "DeepSeek Harness native session and plugin lifecycle" })).toBeInTheDocument();
  });

  it("builds route-specific metadata", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "openai-codex" }) });
    expect(metadata.title).toBe("OpenAI Codex Architecture Study | Systems Around Models");
    expect(metadata.alternates?.canonical).toBe("/architectures/openai-codex");
  });
});
