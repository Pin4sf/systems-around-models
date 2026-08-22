import { expect, test } from "@playwright/test";

const route = "/fieldbook/the-model-is-not-the-agent";
const guideRoute = "/fieldbook/harness-engineering-study-guide";
const memoryGuideRoute = "/fieldbook/memory-engineering-study-guide";

test("@desktop homepage leads to a complete readable Harness Engineering guide", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Start reading" })).toHaveAttribute("href", guideRoute);
  await page.getByRole("link", { name: "Start reading" }).click();
  await expect(
    page.getByRole("heading", { name: "Harness Engineering: A Practical Study Guide" }),
  ).toBeVisible();
  await expect(page.getByText(/Complete short course/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "7. Learn by building and breaking" })).toBeVisible();
  await expect(page.getByRole("group", { name: /evidence/i })).toHaveCount(0);
});

test("@desktop homepage exposes the released Memory companion without a card grid", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Memory Engineering: a practical companion guide" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Read the Memory guide" })).toHaveAttribute(
    "href",
    memoryGuideRoute,
  );
  await expect(page.getByRole("link", { name: "Memory guide", exact: true })).toHaveAttribute(
    "href",
    memoryGuideRoute,
  );
});

test("@desktop reader exposes a simple chapter and ordinary study navigation", async ({
  page,
}) => {
  const javascriptRequests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script" || /\.js(?:\?|$)/i.test(request.url())) {
      javascriptRequests.push(request.url());
    }
  });
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
    page.getByRole("navigation", { name: "Harness Engineering chapters" }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "On this page" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open chapters" })).toBeHidden();

  await expect(page.getByText("Chapter 1 of 40").first()).toBeVisible();
  await expect(page.getByRole("group", { name: /evidence/i })).toHaveCount(0);
  expect(javascriptRequests).toEqual([]);

  const correction = page.getByRole("link", { name: "Suggest a correction" });
  await expect(correction).toHaveAttribute(
    "href",
    /github\.com\/Pin4sf\/systems-around-models\/issues\/new/,
  );
  const correctionBody = new URL(await correction.getAttribute("href") ?? "").searchParams.get(
    "body",
  );
  expect(correctionBody).toContain(`Page: ${route}`);
  expect(correctionBody).toContain("Edition: revision-fieldbook-essay-001");
  expect(correctionBody).toContain("What should change?");

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "Open chapters" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open contents" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Harness Engineering chapters" }),
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
  expect(sitemap.match(/<url>/g)).toHaveLength(4);
  expect(sitemap).toContain(guideRoute);
  expect(sitemap).toContain(route);
  expect(sitemap).toContain(memoryGuideRoute);
  expect(robots).toContain("Sitemap:");
  expect(rssResponse.headers()["content-type"]).toContain("application/rss+xml");
  expect(rss).toContain("The Model Is Not the Agent");
  expect(rss).toContain("Memory Engineering: A Practical Study Guide");
  expect(rss).toContain("revision-memory-engineering-study-guide-001");
  expect(rss).toContain("revision-fieldbook-essay-001");
});

test("@desktop print and reduced-motion modes preserve the guide without motion", async ({
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
  await expect(page.getByRole("heading", { name: "Sources and further reading" })).toBeVisible();
  await expect(page.locator(".study-guide-footer")).toBeVisible();
  const traceColor = await page.locator(".system-trace__step").first().evaluate(
    (element) => getComputedStyle(element).color,
  );
  expect(traceColor).toBe("rgb(0, 0, 0)");
});

test("@mobile reader preserves one prose column and native navigation drawers", async ({
  page,
}) => {
  await page.goto(guideRoute);
  await expect(page.getByRole("button", { name: "Open chapters" })).toBeVisible();
  await page.getByRole("button", { name: "Open chapters" }).click();
  await expect(page.getByRole("link", { name: "Course overview" }).last()).toBeVisible();
  const gridColumnCount = await page.locator(".article-reader").evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(" ").length,
  );
  expect(gridColumnCount).toBe(1);
  const proseFitsViewport = await page.locator(".article-reader__prose").evaluate(
    (element) => element.scrollWidth <= element.clientWidth,
  );
  expect(proseFitsViewport).toBe(true);
});

test("@mobile Memory reader preserves one prose column and truthful guide navigation", async ({ page }) => {
  await page.goto(memoryGuideRoute);
  await expect(
    page.getByRole("heading", { name: "Memory Engineering: A Practical Study Guide" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Open Memory guide" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Memory guide overview" }).first()).toHaveAttribute(
    "href",
    "/#memory-guide-title",
  );
  const gridColumnCount = await page.locator(".article-reader").evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(" ").length,
  );
  expect(gridColumnCount).toBe(1);
  await expect(page.getByText(/Chapter 1 of 40|H0→H9 progression/)).toHaveCount(0);
});

test("@nojs reader keeps the lesson, sources, and ordinary navigation visible", async ({ page }) => {
  await page.goto(guideRoute);
  await expect(
    page.getByRole("heading", { name: "Harness Engineering: A Practical Study Guide" }),
  ).toBeVisible();
  await expect(page.getByText(/You can read this page in one sitting/)).toBeVisible();
  await expect(page.getByRole("list", { name: "Agent system trace" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sources and next reading" })).toBeVisible();
  await expect(page.getByRole("link", { name: "What is a Harness?" }).first()).toBeVisible();
  const correction = page.getByRole("link", { name: "Suggest a correction" });
  const correctionBody = new URL(await correction.getAttribute("href") ?? "").searchParams.get(
    "body",
  );
  expect(correctionBody).toContain("Public source or counter-example:");
  expect(correctionBody).toContain(
    "Please do not include credentials, personal data, health data, private traces, or copyrighted documents.",
  );
  await expect(
    page.getByRole("link", { name: "Previous: Course overview" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Next: The Model Is Not the Agent" })).toBeVisible();
});

test("@nojs Memory reader keeps the complete lesson, sources, and correction path visible", async ({
  page,
}) => {
  await page.goto(memoryGuideRoute);
  await expect(
    page.getByRole("heading", { name: "Memory Engineering: A Practical Study Guide" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sources and next reading" })).toBeVisible();
  await expect(page.getByRole("link", { name: "MemGPT" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Suggest a correction" })).toBeVisible();
  await expect(page.getByText(/Chapter 1 of 40|H0→H9 progression/)).toHaveCount(0);
});
