import { render, screen } from "@testing-library/react";
import { SystemTrace } from "@/components/diagrams/system-trace";

it("renders the complete system trace as an ordered, self-explanatory sequence", () => {
  render(<SystemTrace compact />);

  expect(screen.getByRole("list")).toHaveAttribute("aria-label", "Agent system trace");
  expect(screen.getAllByTestId("trace-step").map((node) => node.textContent)).toEqual([
    "Admit",
    "Context",
    "Capabilities",
    "Execute",
    "State",
    "Effect",
    "Reconcile",
    "Evidence",
    "Verify",
    "Accept or re-enter",
  ]);
  expect(screen.getByText(/Decide whether this work may enter the system/)).toBeInTheDocument();
});

it("uses an h2 by default and supports an h3 inside an article section", () => {
  const { rerender } = render(<SystemTrace />);

  expect(
    screen.getByRole("heading", { name: "The work around a model", level: 2 }),
  ).toBeInTheDocument();

  rerender(<SystemTrace headingLevel={3} />);

  expect(
    screen.getByRole("heading", { name: "The work around a model", level: 3 }),
  ).toBeInTheDocument();
});
