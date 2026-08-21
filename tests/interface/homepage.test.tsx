import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { PublicationShell } from "@/components/publication-shell";

it("identifies the independent publication and primary sections", () => {
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
});

it("leads readers from the thesis into the first fieldbook chapter", () => {
  render(<HomePage />);

  expect(
    screen.getByRole("heading", {
      name: "The model is only one part of the agent.",
      level: 1,
    }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Start with the model" })).toHaveAttribute(
    "href",
    "/fieldbook/the-model-is-not-the-agent",
  );
  expect(screen.getByRole("heading", { name: "Harness Engineering" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Memory Engineering" })).toBeInTheDocument();
  expect(screen.getByText(/Alpha publication/)).toBeInTheDocument();
});
