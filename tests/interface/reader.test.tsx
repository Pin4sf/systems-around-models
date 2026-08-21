import { render, screen } from "@testing-library/react";
import ArticlePage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/fieldbook/[slug]/page";

const slug = "the-model-is-not-the-agent";

async function renderReader() {
  const page = await ArticlePage({ params: Promise.resolve({ slug }) });
  render(page);
}

describe("flagship fieldbook reader", () => {
  it("renders the chapter, evidence, sequence, and correction seams", async () => {
    await renderReader();

    expect(
      screen.getByRole("heading", { name: "The Model Is Not the Agent", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Observed", { selector: "button" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(
      screen.getByRole("navigation", { name: "Harness Engineering sequence" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Challenge this claim" }).getAttribute("href"),
    ).toContain("github.com/Pin4sf/systems-around-models/issues/new");
  });

  it("uses durable heading anchors and exposes evidence definitions from the initial render", async () => {
    await renderReader();

    expect(screen.getByRole("heading", { name: "Failure Before Definition" })).toHaveAttribute(
      "id",
      "failure-before-definition",
    );
    expect(screen.getByRole("heading", { name: "The Harness Boundary" })).toHaveAttribute(
      "id",
      "the-harness-boundary",
    );
    expect(screen.getByText(/Directly inspected in a cited artifact/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "What is a Harness?" })[0]).toHaveAttribute(
      "href",
      "https://earendil.com/posts/what-is-a-harness/",
    );
  });

  it("generates the static route and article-specific metadata from the essay record", async () => {
    await expect(generateStaticParams()).resolves.toContainEqual({ slug });

    const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
    expect(metadata.title).toBe("The Model Is Not the Agent | Systems Around Models");
    expect(metadata.description).toMatch(/model, harness, environment, and authority/i);
  });
});
