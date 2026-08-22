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
  expect(screen.getByRole("link", { name: "Study guide" })).toHaveAttribute(
    "href",
    "/fieldbook/harness-engineering-study-guide",
  );
  expect(screen.getByRole("link", { name: "Curriculum" })).toHaveAttribute("href", "/#chapters");
  expect(screen.getByRole("link", { name: "First chapter" })).toHaveAttribute(
    "href",
    "/fieldbook/the-model-is-not-the-agent",
  );
  expect(screen.queryByText(/forthcoming/i)).not.toBeInTheDocument();
});

it("leads readers into a complete harness-engineering course map", () => {
  render(<HomePage />);

  expect(
    screen.getByRole("heading", {
      name: "Harness Engineering, from first principles.",
      level: 1,
    }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Start reading" })).toHaveAttribute(
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
