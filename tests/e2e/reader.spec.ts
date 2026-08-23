import { expect, test } from "@playwright/test";

const route = "/fieldbook/the-model-is-not-the-agent";
const guideRoute = "/fieldbook/harness-engineering-study-guide";
const memoryGuideRoute = "/fieldbook/memory-engineering-study-guide";
const architecturesRoute = "/architectures";
const admissionRoute = "/fieldbook/identity-authority-and-admission";
const effectsRoute = "/fieldbook/external-effects-and-transactional-outboxes";
const securityRoute = "/fieldbook/security-credentials-supply-chain-and-revocation";

test("@desktop homepage leads to a complete readable Harness Engineering guide", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Start with Harness Engineering" })).toHaveAttribute("href", guideRoute);
  await page.getByRole("link", { name: "Start with Harness Engineering" }).click();
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
  await expect(page.getByRole("link", { name: "Memory", exact: true })).toHaveAttribute(
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
  expect(sitemap).toContain(architecturesRoute);
  expect(sitemap).toContain(guideRoute);
  expect(sitemap).toContain(route);
  expect(sitemap).toContain(memoryGuideRoute);
  expect(sitemap).toContain("/fieldbook/memory-compaction-and-continuity");
  expect(sitemap).toContain("/fieldbook/security-credentials-supply-chain-and-revocation");
  expect(robots).toContain("Sitemap:");
  expect(rssResponse.headers()["content-type"]).toContain("application/rss+xml");
  expect(rss).toContain("The Model Is Not the Agent");
  expect(rss).toContain("Memory Engineering: A Practical Study Guide");
  expect(rss).toContain("revision-memory-engineering-study-guide-001");
  expect(rss).toContain("revision-fieldbook-essay-001");
});

test("@desktop architecture field map compares nine profiles and opens extended studies without JavaScript", async ({ page }) => {
  const javascriptRequests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script" || /\.js(?:\?|$)/i.test(request.url())) javascriptRequests.push(request.url());
  });
  await page.goto(architecturesRoute);

  await expect(page.getByRole("heading", { name: "Many harnesses, different jobs." })).toBeVisible();
  await expect(page.getByRole("table", { name: "Agent architecture comparison" })).toBeVisible();
  await expect(page.locator("article[id^='system-']")).toHaveCount(9);
  const codexLink = page.getByRole("link", { name: "OpenAI Codex profile" });
  await expect(codexLink).toHaveAttribute("href", "/architectures/openai-codex");
  await codexLink.click();
  await expect(page).toHaveURL(/\/architectures\/openai-codex$/);
  await expect(page.getByRole("heading", { name: "System boundary" })).toBeVisible();
  await page.goBack();
  const tableContained = await page.locator(".comparison-table-well").evaluate((element) =>
    element.scrollWidth >= element.clientWidth && element.getBoundingClientRect().right <= window.innerWidth,
  );
  expect(tableContained).toBe(true);
  expect(javascriptRequests).toEqual([]);
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

test("@desktop print preserves architecture sources and expanded URLs", async ({ page }) => {
  await page.goto(architecturesRoute);
  await page.emulateMedia({ media: "print" });
  const source = page.getByRole("link", { name: "Claude Code repository" });
  await expect(source).toBeVisible();
  const afterContent = await source.evaluate((element) => getComputedStyle(element, "::after").content);
  expect(afterContent).toContain("github.com/anthropics/claude-code");
});

test("@desktop Reliable Action chapter preserves its diagram and navigation in print", async ({ page }) => {
  await page.goto(admissionRoute);
  await expect(page.getByRole("heading", { name: "Identity, Authority, and Admission" })).toBeVisible();
  await expect(page.getByRole("figure", { name: "Admission binds identity, authority, and proof" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Next: Leases, Fencing, Cancellation, and Budgets" })).toBeVisible();

  await page.emulateMedia({ media: "print", reducedMotion: "reduce" });
  await expect(page.getByRole("navigation", { name: "On this page" })).toBeHidden();
  await expect(page.getByRole("figure", { name: "Admission binds identity, authority, and proof" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sources and further reading" })).toBeVisible();
  await expect(page.locator(".study-guide-footer")).toBeVisible();
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

test("@mobile Reliable Action security chapter keeps the diagram and pager contained", async ({ page }) => {
  await page.goto(securityRoute);
  await expect(page.getByRole("heading", { name: "Security, Credentials, Supply Chain, and Revocation" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open chapters" })).toBeVisible();
  const diagram = page.getByRole("figure", { name: "Revocation propagation across active surfaces" });
  await expect(diagram).toBeVisible();
  const contentFits = await page.locator(".article-reader__prose").evaluate(
    (element) => element.scrollWidth <= element.clientWidth,
  );
  const diagramFits = await diagram.evaluate(
    (element) => element.getBoundingClientRect().right <= window.innerWidth,
  );
  expect(contentFits).toBe(true);
  expect(diagramFits).toBe(true);
  await expect(page.getByRole("link", { name: "Previous: Ambiguity, Idempotency, and Recovery" })).toBeVisible();
  await expect(page.locator(".article-pager__forthcoming")).toContainText(
    "Observability and trace reconstruction",
  );
});

test("@mobile architecture field map keeps narrative contained and topology labels visible", async ({ page }) => {
  await page.goto(architecturesRoute);
  await expect(page.getByRole("heading", { name: "Many harnesses, different jobs." })).toBeVisible();
  await expect(page.locator("#baseline").getByText("Verify and close", { exact: true })).toBeVisible();
  const pageFits = await page.locator(".architecture-reader").evaluate((element) =>
    element.getBoundingClientRect().right <= window.innerWidth && element.getBoundingClientRect().left >= 0,
  );
  expect(pageFits).toBe(true);
  const tableScrolls = await page.locator(".comparison-table-well").evaluate((element) =>
    element.scrollWidth > element.clientWidth,
  );
  expect(tableScrolls).toBe(true);
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

test("@nojs Reliable Action effect chapter preserves custody and ordinary navigation", async ({ page }) => {
  await page.goto(effectsRoute);
  await expect(page.getByRole("heading", { name: "External Effects and Transactional Outboxes" })).toBeVisible();
  await expect(page.getByRole("figure", { name: "Transactional outbox effect lifecycle" })).toBeVisible();
  await expect(page.getByText(/durable dead-letter state/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sources and further reading" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Transactional outbox pattern" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Next: Ambiguity, Idempotency, and Recovery" })).toBeVisible();
  await expect(page.getByRole("group", { name: /evidence/i })).toHaveCount(0);
});

test("@nojs architecture profiles preserve native disclosure and ordinary sources", async ({ page }) => {
  await page.goto(architecturesRoute);
  const disclosure = page.getByText("Trace, sources, and current unknowns").first();
  await disclosure.click();
  await expect(page.getByRole("link", { name: "Claude Code repository" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Suggest a correction" })).toHaveAttribute(
    "href",
    /github\.com\/Pin4sf\/systems-around-models\/issues\/new/,
  );
});
