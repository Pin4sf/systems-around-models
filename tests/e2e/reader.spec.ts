import { expect, test } from "@playwright/test";

const route = "/fieldbook/the-model-is-not-the-agent";

test("@desktop reader exposes the chapter, rails, evidence, and keyboard path", async ({
  page,
}) => {
  await page.goto(route);
  await expect(
    page.getByRole("heading", { name: "The Model Is Not the Agent" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Harness Engineering sequence" }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "On this page" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open sequence" })).toBeHidden();

  const evidenceButton = page.getByRole("button", { name: "Observed" });
  await evidenceButton.focus();
  await page.keyboard.press("Enter");
  await expect(evidenceButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText(/Directly inspected in a cited artifact/)).toBeVisible();

  const correction = page.getByRole("link", { name: "Challenge this claim" });
  await expect(correction).toHaveAttribute(
    "href",
    /github\.com\/Pin4sf\/systems-around-models\/issues\/new/,
  );
  const correctionBody = new URL(await correction.getAttribute("href") ?? "").searchParams.get(
    "body",
  );
  expect(correctionBody).toContain("Repository: Pin4sf/systems-around-models");
  expect(correctionBody).toContain(`Page route: ${route}`);
  expect(correctionBody).toContain("Article revision: revision-fieldbook-essay-001");
  expect(correctionBody).toContain("Section anchor: #failure-before-definition");
  expect(correctionBody).toContain("Claim ID: claim-harness-capability-configuration");

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "Open sequence" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open contents" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Harness Engineering sequence" }),
  ).toBeHidden();
});

test("@mobile reader preserves one prose column and native navigation drawers", async ({
  page,
}) => {
  await page.goto(route);
  await expect(page.getByRole("button", { name: "Open sequence" })).toBeVisible();
  await page.getByRole("button", { name: "Open sequence" }).click();
  await expect(page.getByRole("link", { name: "Fieldbook overview" }).last()).toBeVisible();
  const gridColumnCount = await page.locator(".article-reader").evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(" ").length,
  );
  expect(gridColumnCount).toBe(1);
  const proseFitsViewport = await page.locator(".article-reader__prose").evaluate(
    (element) => element.scrollWidth <= element.clientWidth,
  );
  expect(proseFitsViewport).toBe(true);
});

test("@nojs reader keeps meaning and ordinary navigation visible", async ({ page }) => {
  await page.goto(route);
  await expect(
    page.getByRole("heading", { name: "The Model Is Not the Agent" }),
  ).toBeVisible();
  await expect(page.getByText(/Atlas is a fictional software-delivery agent/)).toBeVisible();
  await expect(page.getByRole("list", { name: "Agent system trace" })).toBeVisible();
  await expect(page.getByRole("link", { name: "What is a Harness?" }).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Previous: Harness Engineering overview" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Next: Memory Engineering overview" }),
  ).toBeVisible();
});
