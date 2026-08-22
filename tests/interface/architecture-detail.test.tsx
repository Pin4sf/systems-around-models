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
    ["openai-codex", "OpenAI Codex", "343074d4207d"],
    ["deepseek-harness-cordis", "DeepSeek Harness and Cordis", "47f943859bef"],
  ])("renders %s with its boundary, topology, failure mode, and retrieval check", async (slug, title, version) => {
    render(await ArchitectureDetailPage({ params: Promise.resolve({ slug }) }));

    expect(screen.getByRole("heading", { name: title, level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(version)).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "System boundary", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Normalized topology", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Failure boundary", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Retrieval check", level: 2 })).toBeInTheDocument();
  });

  it("builds route-specific metadata", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "openai-codex" }) });
    expect(metadata.title).toBe("OpenAI Codex Architecture Study | Systems Around Models");
    expect(metadata.alternates?.canonical).toBe("/architectures/openai-codex");
  });
});
