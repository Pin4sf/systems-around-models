import { expect, test } from "@playwright/test";

const route = "/fieldbook/the-model-is-not-the-agent";
const guideRoute = "/fieldbook/harness-engineering-study-guide";
const memoryGuideRoute = "/fieldbook/memory-engineering-study-guide";
const architecturesRoute = "/architectures";
const admissionRoute = "/fieldbook/identity-authority-and-admission";
const effectsRoute = "/fieldbook/external-effects-and-transactional-outboxes";
const securityRoute = "/fieldbook/security-credentials-supply-chain-and-revocation";
const openLoopsRoute = "/fieldbook/open-loops-and-re-entry";
const hermesRoute = "/fieldbook/hermes-integrated-agent-runtime";
const qmRoute = "/fieldbook/qm-scoped-resources-and-leased-runs";
const cloudflareRoute = "/fieldbook/cloudflare-think-and-agents";
const deepseekRoute = "/fieldbook/deepseek-harness-and-cordis";
const droverRoute = "/fieldbook/drover-fleet-custody-and-evidence";
const xirpRoute = "/fieldbook/spotify-xirp-and-portal";
const boundedCaseRoute = "/fieldbook/bounded-whole-product-case-study";
const evaluationRoute = "/fieldbook/model-harness-evaluation";
const labsRoute = "/fieldbook/twelve-harness-labs";
const worksheetRoute = "/fieldbook/harness-review-questions-and-design-worksheet";
const latestRoute = "/fieldbook/keeping-the-guide-current";
const siteOrigin = process.env.SITE_URL ?? "https://example.invalid";

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
    `${siteOrigin}/social/systems-around-models.png`,
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

  await expect(page.getByText("Chapter 1", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/Chapter 1 of 40/)).toHaveCount(0);
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
  expect(sitemap).toContain(openLoopsRoute);
  expect(sitemap).toContain(hermesRoute);
  expect(sitemap).toContain(qmRoute);
  expect(sitemap).toContain(cloudflareRoute);
  expect(sitemap).toContain(deepseekRoute);
  expect(sitemap).toContain(droverRoute);
  expect(sitemap).toContain(xirpRoute);
  expect(sitemap).toContain(boundedCaseRoute);
  expect(sitemap).toContain(evaluationRoute);
  expect(sitemap).toContain(labsRoute);
  expect(sitemap).toContain(worksheetRoute);
  expect(sitemap).toContain(latestRoute);
  expect(robots).toContain("Sitemap:");
  expect(rssResponse.headers()["content-type"]).toContain("application/rss+xml");
  expect(rss).toContain("The Model Is Not the Agent");
  expect(rss).toContain("Memory Engineering: A Practical Study Guide");
  expect(rss).toContain("revision-memory-engineering-study-guide-001");
  expect(rss).toContain("revision-fieldbook-essay-001");
  expect(rss).toContain("Open Loops and Re-entry");
  expect(rss).toContain("revision-open-loops-re-entry-001");
  expect(rss).toContain("Hermes: An Integrated Agent Runtime");
  expect(rss).toContain("revision-hermes-integrated-agent-runtime-002");
  expect(rss).toContain("revision-qm-scoped-resources-and-leased-runs-002");
  expect(rss).toContain("revision-cloudflare-think-and-agents-002");
  expect(rss).toContain("revision-deepseek-harness-and-cordis-002");
  expect(rss).toContain("revision-drover-fleet-custody-and-evidence-003");
  expect(rss).toContain("revision-spotify-xirp-and-portal-001");
  expect(rss).toContain("revision-bounded-whole-product-case-study-001");
  expect(rss).toContain("revision-model-harness-evaluation-001");
  expect(rss).toContain("revision-keeping-the-guide-current-001");
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
  await expect(page.getByRole("link", { name: "Next: Observability and Trace Reconstruction" })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "Repository crosswalk: ten boundary tests" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Community Cybersecurity Skills" })).toBeVisible();
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

test("@nojs Evidence and Completion chapter preserves re-entry state and ordinary navigation", async ({ page }) => {
  await page.goto(openLoopsRoute);
  await expect(page.getByRole("heading", { name: "Open Loops and Re-entry" })).toBeVisible();
  await expect(page.getByRole("figure", { name: "Open loop re-entry lifecycle" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Retrieval check" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sources and further reading" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Previous: Evidence, Verification, Policy, Acceptance, and Closure" })).toBeVisible();
  await expect(page.getByRole("group", { name: /evidence/i })).toHaveCount(0);
});

test("@mobile Evidence and Completion chapter keeps its diagram and prose contained", async ({ page }) => {
  await page.goto(openLoopsRoute);
  const diagram = page.getByRole("figure", { name: "Open loop re-entry lifecycle" });
  await expect(diagram).toBeVisible();
  const [contentFits, diagramFits] = await Promise.all([
    page.locator(".article-reader__prose").evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
    diagram.evaluate(
      (element) => element.getBoundingClientRect().right <= window.innerWidth,
    ),
  ]);
  expect(contentFits).toBe(true);
  expect(diagramFits).toBe(true);
});

test("@desktop print preserves Evidence and Completion sources and closure state", async ({ page }) => {
  await page.goto(openLoopsRoute);
  await page.emulateMedia({ media: "print", reducedMotion: "reduce" });
  await expect(page.getByRole("navigation", { name: "On this page" })).toBeHidden();
  await expect(page.getByRole("figure", { name: "Open loop re-entry lifecycle" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sources and further reading" })).toBeVisible();
  await expect(page.locator(".study-guide-footer")).toBeVisible();
});

test("@nojs comparative case preserves source boundaries and released navigation", async ({ page }) => {
  await page.goto(hermesRoute);
  await expect(page.getByRole("heading", { name: "Hermes: An Integrated Agent Runtime" })).toBeVisible();
  await expect(page.getByRole("figure", { name: "Hermes integrated runtime seams" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Failure boundary" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Retrieval check" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Hermes Agent release v0.20.5" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Previous: LangGraph: Durable State and Interrupts" })).toBeVisible();
  await expect(page.getByRole("group", { name: /evidence/i })).toHaveCount(0);
});

test("@mobile comparative case keeps its seam map and prose contained", async ({ page }) => {
  await page.goto(hermesRoute);
  const diagram = page.getByRole("figure", { name: "Hermes integrated runtime seams" });
  await expect(diagram).toBeVisible();
  const [contentFits, diagramFits] = await Promise.all([
    page.locator(".article-reader__prose").evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
    diagram.evaluate(
      (element) => element.getBoundingClientRect().right <= window.innerWidth,
    ),
  ]);
  expect(contentFits).toBe(true);
  expect(diagramFits).toBe(true);
});

test("@desktop print preserves comparative source and retrieval surfaces", async ({ page }) => {
  await page.goto(hermesRoute);
  await page.emulateMedia({ media: "print", reducedMotion: "reduce" });
  await expect(page.getByRole("navigation", { name: "On this page" })).toBeHidden();
  await expect(page.getByRole("figure", { name: "Hermes integrated runtime seams" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sources and further reading" })).toBeVisible();
  await expect(page.locator(".study-guide-footer")).toBeVisible();
});

test("@desktop refreshed DeepSeek case exposes its exact release boundary", async ({ page }) => {
  await page.goto(deepseekRoute);
  await expect(page.getByRole("heading", { name: "DeepSeek Harness and Cordis" })).toBeVisible();
  await expect(page.getByRole("figure", { name: "DeepSeek ordered session lifecycle" })).toBeVisible();
  await expect(page.getByRole("link", { name: "DeepSeek Harness dsh-v0.1.1-rc.2" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Next: Drover: Fleet Custody and Evidence" })).toBeVisible();
});

test("@mobile Cloudflare case keeps its durable-turn diagram contained", async ({ page }) => {
  await page.goto(cloudflareRoute);
  const diagram = page.getByRole("figure", { name: "Cloudflare durable turn lifecycle" });
  await expect(diagram).toBeVisible();
  const [contentFits, diagramFits] = await Promise.all([
    page.locator(".article-reader__prose").evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
    diagram.evaluate(
      (element) => element.getBoundingClientRect().right <= window.innerWidth,
    ),
  ]);
  expect(contentFits).toBe(true);
  expect(diagramFits).toBe(true);
});

test("@nojs latest comparative case preserves fleet custody and source boundaries", async ({ page }) => {
  await page.goto(droverRoute);
  await expect(page.getByRole("heading", { name: "Drover: Fleet Custody and Evidence" })).toBeVisible();
  await expect(page.getByRole("figure", { name: "Drover fleet custody and evidence planes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Failure boundary" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Drover v0.3.7" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Previous: DeepSeek Harness and Cordis" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Next: Spotify Xirp and Portal: Native Custody and Context" })).toBeVisible();
  await expect(page.getByRole("group", { name: /evidence/i })).toHaveCount(0);
});

test("@desktop current Xirp case preserves native-custody and source boundaries", async ({ page }) => {
  await page.goto(xirpRoute);
  await expect(page.getByRole("heading", { name: "Spotify Xirp and Portal: Native Custody and Context" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Native custody is not provider parity" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Xirp changelog" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Next: Factory Missions versus GitHub Copilot" })).toBeVisible();
});

test("@nojs bounded whole-product case stays public, generic, and human-authorized", async ({ page }) => {
  await page.goto(boundedCaseRoute);
  await expect(page.getByRole("heading", { name: "A Bounded Whole-Product Case Study" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Preserve human-owned external effects" })).toBeVisible();
  await expect(page.getByRole("link", { name: "AI Job Search v1.6.0" })).toBeVisible();
  await expect(page.getByRole("group", { name: /evidence/i })).toHaveCount(0);
});

test("@desktop evaluation chapter labels matched budgets and rejects SOTA shortcuts", async ({ page }) => {
  await page.goto(evaluationRoute);
  await expect(page.getByRole("heading", { name: "Model × Harness Evaluation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lock the evaluator and protect held-out tasks" })).toBeVisible();
  await expect(page.getByText(/makes no SOTA assertion/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Rethinking the Evaluation of Harness Evolution for Agents" })).toBeVisible();
});

test("@mobile labs and worksheet keep wide tables contained", async ({ page }) => {
  for (const target of [labsRoute, worksheetRoute]) {
    await page.goto(target);
    await expect(page.getByRole("heading", { name: target === labsRoute ? "Twelve Harness Labs" : "Harness Review Questions and Design Worksheet" })).toBeVisible();
    const contained = await page.locator(".article-reader__prose").evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    );
    expect(contained).toBe(true);
  }
});

test("@nojs final chapter closes the released sequence without a next link", async ({ page }) => {
  await page.goto(latestRoute);
  await expect(page.getByRole("heading", { name: "Keeping the Guide Current" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Publication needs a harness too" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Previous: Harness Review Questions and Design Worksheet" })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Next:/ })).toHaveCount(0);
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
