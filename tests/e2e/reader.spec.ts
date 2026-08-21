import { expect, test } from "@playwright/test";

const route = "/fieldbook/the-model-is-not-the-agent";

test("@desktop reader exposes the chapter, rails, evidence, and keyboard path", async ({
  page,
}) => {
  await page.goto(route);
  await expect(
    page.getByRole("heading", { name: "The Model Is Not the Agent" }),
  ).toBeVisible();
  await expect(page).toHaveTitle("The Model Is Not the Agent | Systems Around Models");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${route}$`));
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://example.invalid/social/systems-around-models.png",
  );
  const socialImage = await page.evaluate(async () => {
    const image = new Image();
    image.src = "/social/systems-around-models.png";
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  });
  expect(socialImage).toEqual({ width: 1200, height: 630 });
  const structuredData = JSON.parse(
    await page.locator('script[type="application/ld\\+json"]').textContent() ?? "{}",
  );
  expect(structuredData).toMatchObject({
    "@type": "Article",
    headline: "The Model Is Not the Agent",
    dateModified: "2026-08-21",
  });
  await expect(
    page.getByRole("navigation", { name: "Harness Engineering sequence" }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "On this page" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open sequence" })).toBeHidden();

  const evidenceSummary = page.getByText("Proposed", { exact: true }).first();
  await evidenceSummary.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/Introduced by Systems Around Models as a working method/).first()).toBeVisible();

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

test("@desktop discovery endpoints expose only released publication routes", async ({
  request,
}) => {
  const [sitemapResponse, robotsResponse, rssResponse] = await Promise.all([
    request.get("/sitemap.xml"),
    request.get("/robots.txt"),
    request.get("/rss.xml"),
  ]);
  const sitemap = await sitemapResponse.text();
  const robots = await robotsResponse.text();
  const rss = await rssResponse.text();

  expect(sitemapResponse.ok()).toBe(true);
  expect(sitemap.match(/<url>/g)).toHaveLength(2);
  expect(sitemap).toContain(route);
  expect(robots).toContain("Sitemap:");
  expect(rssResponse.headers()["content-type"]).toContain("application/rss+xml");
  expect(rss).toContain("The Model Is Not the Agent");
  expect(rss).toContain("revision-fieldbook-essay-001");
});

test("@desktop print and reduced-motion modes preserve evidence without motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  const motion = await page.locator(".system-trace__step").first().evaluate((element) => {
    const style = getComputedStyle(element);
    return { animationName: style.animationName, transitionDuration: style.transitionDuration };
  });
  expect(motion).toEqual({ animationName: "none", transitionDuration: "0s" });

  await page.emulateMedia({ media: "print", reducedMotion: "reduce" });
  await expect(page.getByRole("navigation", { name: "On this page" })).toBeHidden();
  await expect(page.locator(".evidence-disclosure summary").first()).toBeVisible();
  await expect(page.locator(".revision-notice--end")).toBeVisible();
  const traceColor = await page.locator(".system-trace__step").first().evaluate(
    (element) => getComputedStyle(element).color,
  );
  expect(traceColor).toBe("rgb(0, 0, 0)");
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
  const proposedDisclosure = page.getByText("Proposed", { exact: true }).first();
  await expect(proposedDisclosure).toBeVisible();
  await proposedDisclosure.click();
  await expect(page.getByText(/Introduced by Systems Around Models as a working method/).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "What is a Harness?" }).first()).toBeVisible();
  const correction = page.getByRole("link", { name: "Challenge this claim" });
  const correctionBody = new URL(await correction.getAttribute("href") ?? "").searchParams.get(
    "body",
  );
  expect(correctionBody).toContain("Counter-evidence (public links only):");
  expect(correctionBody).toContain(
    "Please do not include credentials, personal data, health data, private traces, or copyrighted documents.",
  );
  await expect(
    page.getByRole("link", { name: "Previous: Harness Engineering overview" }),
  ).toBeVisible();
  await expect(page.locator('a[rel="next"]')).toHaveCount(0);
});
