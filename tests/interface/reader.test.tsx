import { render, screen, within } from "@testing-library/react";
import ArticlePage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/fieldbook/[slug]/page";
import { compilePublicMdx } from "@/lib/content/compile-public-mdx";
import { ArticlePager } from "@/components/article/sequence-navigation";
import { loadContent } from "@/lib/content/load-content";

const slug = "the-model-is-not-the-agent";
const guideSlug = "harness-engineering-study-guide";

async function renderReader() {
  const page = await ArticlePage({ params: Promise.resolve({ slug }) });
  render(page);
}

describe("flagship fieldbook reader", () => {
  it.each([
    'import { Fragment } from "react"',
    'import{Fragment}from "react"',
    'export { default } from "react"',
    "export{Fragment}",
  ])("rejects MDX ESM before evaluating %s", async (esm) => {
    await expect(
      compilePublicMdx({ source: `${esm}\n\n# Public heading`, components: {} }),
    ).rejects.toThrow("Public MDX ESM is not allowed");
  });

  it("renders a simple chapter without claim-review machinery", async () => {
    await renderReader();

    expect(
      screen.getByRole("heading", { name: "The Model Is Not the Agent", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Harness Engineering chapters" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Chapter 1 of 40").length).toBeGreaterThan(0);
    expect(screen.queryByRole("group", { name: /evidence/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Challenge this/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Article revision record/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Earendil argues that people can own and adapt their harness/),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Suggest a correction" })).toHaveAttribute(
      "href",
      expect.stringContaining("github.com/Pin4sf/systems-around-models/issues/new"),
    );
    const correction = screen.getByRole("link", { name: "Suggest a correction" });
    const correctionBody = new URL(correction.getAttribute("href") ?? "").searchParams.get("body");
    expect(correctionBody).toContain("Section: article");
    expect(correctionBody).toContain("Scope: article-wide correction");
  });

  it("publishes a complete short Harness Engineering course as the primary reader", async () => {
    const page = await ArticlePage({ params: Promise.resolve({ slug: guideSlug }) });
    render(page);

    expect(
      screen.getByRole("heading", { name: "Harness Engineering: A Practical Study Guide", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Complete short course/)).toBeInTheDocument();
    for (const heading of [
      "1. Start with the system, not the model",
      "2. Grow the harness one responsibility at a time",
      "3. Build the runtime around six working parts",
      "4. Make action bounded and recoverable",
      "5. Define what done means",
      "6. Choose architectures by responsibility",
      "7. Learn by building and breaking",
      "A compact design worksheet",
      "Sources and next reading",
    ]) {
      expect(screen.getByRole("heading", { name: heading, level: 2 })).toBeInTheDocument();
    }
    expect(screen.queryByText("Evidence grade")).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: /evidence/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read the full first chapter/i })).toHaveAttribute(
      "href",
      "/fieldbook/the-model-is-not-the-agent",
    );
  });

  it("uses durable heading anchors and ordinary source links", async () => {
    await renderReader();

    const article = screen.getByRole("article");

    expect(screen.getByRole("heading", { name: "Start with a failure" })).toHaveAttribute(
      "id",
      "start-with-a-failure",
    );
    expect(screen.getByRole("heading", { name: "What a harness actually does" })).toHaveAttribute(
      "id",
      "what-a-harness-actually-does",
    );
    expect(screen.getAllByRole("link", { name: "What is a Harness?" })[0]).toHaveAttribute(
      "href",
      "https://earendil.com/posts/what-is-a-harness/",
    );
    expect(
      within(article)
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "Start with a failure",
      "What a harness actually does",
      "What control should feel like",
      "Follow the work from request to completion",
      "How to choose an architecture",
      "What is still unsettled",
      "Sources and further reading",
    ]);
    expect(
      within(article).getByRole("heading", {
        name: "The work around a model",
        level: 3,
      }),
    ).toBeInTheDocument();
  });

  it("keeps rigor in a normal sources section instead of interrupting prose", async () => {
    await renderReader();

    expect(
      screen.getByRole("heading", { name: "Sources and further reading" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "What is a Harness?" })[0]).toBeInTheDocument();
    expect(screen.queryByText("Evidence grade")).not.toBeInTheDocument();
    expect(screen.queryByText("Unknowns")).not.toBeInTheDocument();
  });

  it("generates the static route and article-specific metadata from the essay record", async () => {
    await expect(generateStaticParams()).resolves.toContainEqual({ slug });

    const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
    expect(metadata.title).toBe("The Model Is Not the Agent | Systems Around Models");
    expect(metadata.description).toMatch(/model, harness, environment, and authority/i);
  });

  it("does not advertise an unreleased next chapter", async () => {
    await renderReader();

    expect(document.querySelector('a[rel="next"]')).not.toBeInTheDocument();
    expect(screen.getAllByText(/The H0→H9 progression/).length)
      .toBeGreaterThan(0);
  });

  it("derives next-link semantics from the released essay sequence", async () => {
    const content = await loadContent();
    const first = content.essays.get(slug);
    if (!first) throw new Error("Expected flagship essay");
    const second = {
      ...first,
      slug: "harness-responsibilities-in-practice",
      title: "Harness Responsibilities in Practice",
      sequencePosition: 2,
      previousEssaySlug: first.slug,
      nextEssaySlug: undefined,
    };
    render(
      <ArticlePager
        essay={{ ...first, nextEssaySlug: second.slug }}
        releasedEssays={[first, second]}
      />,
    );

    expect(screen.getByRole("link", { name: "Next: Harness Responsibilities in Practice" }))
      .toHaveAttribute("href", "/fieldbook/harness-responsibilities-in-practice");
    expect(screen.getByRole("link", { name: "Next: Harness Responsibilities in Practice" }))
      .toHaveAttribute("rel", "next");
  });
});
