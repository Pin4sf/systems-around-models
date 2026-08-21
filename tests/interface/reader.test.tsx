import { render, screen, within } from "@testing-library/react";
import ArticlePage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/fieldbook/[slug]/page";
import { compilePublicMdx } from "@/lib/content/compile-public-mdx";
import { ArticlePager } from "@/components/article/sequence-navigation";
import { loadContent } from "@/lib/content/load-content";

const slug = "the-model-is-not-the-agent";

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

  it("renders the chapter, evidence, sequence, and correction seams", async () => {
    await renderReader();

    expect(
      screen.getByRole("heading", { name: "The Model Is Not the Agent", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Observed|Proposed/ })).not.toBeInTheDocument();
    const firstEvidence = screen.getAllByRole("group", { name: "Proposed evidence" })[0];
    expect(within(firstEvidence).getByText("Proposed", { selector: "summary" })).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Harness Engineering sequence" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Challenge this claim" }).getAttribute("href"),
    ).toContain("github.com/Pin4sf/systems-around-models/issues/new");
    expect(screen.getAllByText("Author-reported", { selector: "summary" })).toHaveLength(2);
    expect(
      screen.getByText(/Earendil argues that people can own and adapt their harness/),
    ).toBeInTheDocument();
  });

  it("uses durable heading anchors and exposes evidence definitions from the initial render", async () => {
    await renderReader();

    const article = screen.getByRole("article");

    expect(screen.getByRole("heading", { name: "Failure Before Definition" })).toHaveAttribute(
      "id",
      "failure-before-definition",
    );
    expect(screen.getByRole("heading", { name: "The Harness Boundary" })).toHaveAttribute(
      "id",
      "the-harness-boundary",
    );
    expect(screen.getAllByText(/Introduced by Systems Around Models as a claim, pattern, or working method/).length)
      .toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "What is a Harness?" })[0]).toHaveAttribute(
      "href",
      "https://earendil.com/posts/what-is-a-harness/",
    );
    expect(
      within(article)
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "Failure Before Definition",
      "The Harness Boundary",
      "Control and User Leverage",
      "The End-to-End Trace",
      "What Architecture Selection Changes",
      "Uncertainties and Falsifiers",
      "Sources and Revision Record",
    ]);
    expect(
      within(article).getByRole("heading", {
        name: "The work around a model",
        level: 3,
      }),
    ).toBeInTheDocument();
  });

  it("renders source basis, evidence, unknowns, validation, and license in native disclosures", async () => {
    await renderReader();

    const failureEvidence = screen.getAllByRole("group", { name: "Proposed evidence" })[0];
    expect(within(failureEvidence).getByText("Publication synthesis")).toBeInTheDocument();
    expect(within(failureEvidence).getByText("Evidence grade")).toBeInTheDocument();
    expect(within(failureEvidence).getByText("Last validated")).toBeInTheDocument();
    expect(within(failureEvidence).getByText("License status")).toBeInTheDocument();
    expect(within(failureEvidence).getByText("Observed mechanisms")).toBeInTheDocument();
    expect(within(failureEvidence).getByText("Author-reported statements")).toBeInTheDocument();
    expect(within(failureEvidence).getByText("Unknowns")).toBeInTheDocument();
  });

  it("links revision and synthesis provenance to a generated immutable manifest target", async () => {
    await renderReader();

    const revisionLinks = screen.getAllByRole("link", { name: "revision-fieldbook-essay-001" });
    expect(revisionLinks[0]).toHaveAttribute(
      "href",
      "/manifests/revision-fieldbook-essay-001.json",
    );
    const synthesisLinks = screen.getAllByRole("link", {
      name: "The Agent Systems Fieldbook — Harness Engineering, version 1",
    });
    expect(synthesisLinks[0]).toHaveAttribute(
      "href",
      "/manifests/revision-fieldbook-essay-001.json",
    );
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
    expect(screen.getAllByText(/Harness responsibilities in practice · forthcoming/).length)
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
