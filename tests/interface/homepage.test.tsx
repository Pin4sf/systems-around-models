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

it("offers architecture comparison as a first-class study path", () => {
  render(<HomePage />);

  expect(screen.getByRole("heading", { name: "Study the machinery around models." })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Explore architectures" })).toHaveAttribute(
    "href",
    "/architectures",
  );
  expect(screen.getByRole("heading", { name: "Three ways into the field" })).toBeInTheDocument();
});

it("offers the released Memory companion as ordinary reading", () => {
  render(<HomePage />);

  expect(
    screen.getByRole("heading", { name: "Memory Engineering: a practical companion guide" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Read the Memory guide" })).toHaveAttribute(
    "href",
    "/fieldbook/memory-engineering-study-guide",
  );
  expect(screen.queryByText(/evidence badge|revision panel|source drawer/i)).not.toBeInTheDocument();
});

it("leads readers into a complete harness-engineering course map", () => {
  render(<HomePage />);

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
});
