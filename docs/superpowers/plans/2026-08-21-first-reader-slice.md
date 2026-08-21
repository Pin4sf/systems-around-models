# First Reader Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-quality standalone homepage and one complete, evidence-labeled fieldbook chapter for Systems Around Models.

**Architecture:** A static-first Next.js application reads trusted MDX essays and schema-validated YAML claim/source/revision records from the public repository at build time. Server Components render all required prose, navigation, diagrams, and evidence definitions; small client islands add progressive disclosure without making reading depend on JavaScript.

**Tech Stack:** Node.js 20.9+, Next.js 16.3.1, React 19.2.8, TypeScript, MDX via `next-mdx-remote` 6.0.0, Zod 4.4.3, YAML 2.9.0, Vitest 4.1.11, Testing Library, Playwright 1.62.1, npm.

**Spec:** `docs/design/2026-08-21-reading-portal-design.md`

## Global Constraints

- `waldo-brain` is manual research input only; no runtime, build-time, package, symlink, or deployment dependency may point to it.
- Public content lives only under this repository's `content/` tree and must pass evidence, privacy, license, and correction-ledger review before release.
- Use the approved Annotated Field Manual tokens: paper `#F4F0E6`, ink `#171510`, evidence `#28513D`, correction `#A63F28`, gold `#A47C2B`.
- Use Source Serif 4 for editorial text, Inter for UI, and IBM Plex Mono for evidence and trace data.
- Keep body measure between 68 and 74 characters and body line height at or above 1.65.
- The representative chapter must remain readable with JavaScript disabled.
- Hydrated client JavaScript must remain under 120 KB compressed on the representative chapter route.
- No analytics, accounts, comments, votes, waitlist, product funnel, dark theme, or invented catalog counts.
- No public site deployment before Shivansh approves the release candidate and destination.

---

## File map

```text
app/
  fieldbook/[slug]/page.tsx       Static chapter route and metadata
  globals.css                     Approved tokens, reader layout, print styles
  layout.tsx                      Publication shell, fonts, metadata defaults
  page.tsx                        Publication homepage
  robots.ts                       Crawl policy
  sitemap.ts                      Canonical public routes
  rss.xml/route.ts                Essay feed
components/
  article/article-contents.tsx    Desktop and mobile section navigation
  article/article-reader.tsx      MDX reading frame
  article/evidence-badge.tsx      Progressive evidence disclosure
  article/revision-notice.tsx     Version and correction entry point
  article/sequence-navigation.tsx Ordered chapter navigation
  diagrams/system-trace.tsx       Static-first end-to-end trace
  publication-shell.tsx           Global header and footer
content/
  essays/harness/the-model-is-not-the-agent.mdx
  claims/claim-harness-capability-configuration.yaml
  revisions/revision-fieldbook-essay-001.yaml
  sources/source-earendil-what-is-a-harness.yaml
  sources/source-harness-engineering-fieldbook-v1.yaml
lib/content/load-content.ts       Filesystem loading and referential integrity
lib/content/schema.ts             Zod schemas and exported record types
lib/content/slugify.ts            Deterministic heading identifiers
public/
  og.png                          Site-wide social card after visual validation
tests/
  content/content-integrity.test.ts
  interface/homepage.test.tsx
  interface/reader.test.tsx
  interface/system-trace.test.tsx
  publication/metadata.test.ts
  e2e/reader.spec.ts
```

---

### Task 1: Application shell and validation harness

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `components/publication-shell.tsx`
- Create: `tests/interface/homepage.test.tsx`

**Interfaces:**
- Consumes: approved design tokens from the specification.
- Produces: `PublicationShell({ children }: { children: React.ReactNode })`, global CSS utilities, and `npm` scripts used by every later task.

- [ ] **Step 1: Scaffold the Next.js TypeScript application without replacing `README.md` or `docs/`**

Run from a temporary directory, then copy only the generated application files into the repository:

```bash
npx create-next-app@16.3.1 /tmp/systems-around-models-app --ts --eslint --app --src-dir=false --use-npm --no-tailwind --import-alias='@/*'
```

Preserve the existing design commit. Remove starter page content before the first product-specific commit.

- [ ] **Step 2: Add content and test dependencies**

Run:

```bash
npm install next-mdx-remote@6.0.0 zod@4.4.3 yaml@2.9.0
npm install --save-dev vitest@4.1.11 jsdom @testing-library/react @testing-library/jest-dom @playwright/test@1.62.1
```

Add scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 3: Write the failing publication-shell test**

```tsx
import { render, screen } from "@testing-library/react";
import { PublicationShell } from "@/components/publication-shell";

it("identifies the independent publication and primary sections", () => {
  render(<PublicationShell><p>Reader</p></PublicationShell>);
  expect(screen.getByText("Systems Around Models")).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: "Publication" })).toBeInTheDocument();
  expect(screen.queryByText(/Waldo/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 4: Run the test and verify the expected failure**

Run: `npm test -- tests/interface/homepage.test.tsx`  
Expected: FAIL because `PublicationShell` does not exist.

- [ ] **Step 5: Implement the shell and approved base tokens**

`PublicationShell` must render a skip link, header, publication navigation, `<main id="main-content">`, and footer. `globals.css` must define the approved color tokens, font variables, focus ring, 72-character `.prose` measure, reduced-motion rule, and print reset.

```tsx
export function PublicationShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="/">Systems Around Models</a>
        <nav aria-label="Publication">
          <a href="/">Fieldbook</a>
          <span aria-disabled="true">Architectures</span>
          <span aria-disabled="true">Sources</span>
          <span aria-disabled="true">Revisions</span>
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer>Independent research on systems around models.</footer>
    </>
  );
}
```

- [ ] **Step 6: Verify the shell**

Run: `npm test -- tests/interface/homepage.test.tsx && npm run lint`  
Expected: PASS with no lint errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json eslint.config.mjs vitest.config.ts vitest.setup.ts app components tests
git commit -m "site: establish the publication shell (why: create the independent reader foundation)"
```

---

### Task 2: Canonical content, claim, source, and revision registries

**Files:**
- Create: `lib/content/schema.ts`
- Create: `lib/content/load-content.ts`
- Create: `lib/content/slugify.ts`
- Create: `content/claims/claim-harness-capability-configuration.yaml`
- Create: `content/sources/source-earendil-what-is-a-harness.yaml`
- Create: `content/sources/source-harness-engineering-fieldbook-v1.yaml`
- Create: `content/revisions/revision-fieldbook-essay-001.yaml`
- Create: `tests/content/content-integrity.test.ts`

**Interfaces:**
- Produces: `ClaimRecord`, `SourceRecord`, `RevisionRecord`, `EssayMetadata`, `loadClaims()`, `loadSources()`, `loadRevisions()`, `loadEssay(slug)`, `listEssays()`, and `slugifyHeading(label)`.
- Guarantees: stable identifiers, allowed evidence labels, valid source references, unique essay slugs, and explicit revision identifiers.

- [ ] **Step 1: Write failing schema and referential-integrity tests**

```ts
import { loadClaims, loadRevisions, loadSources } from "@/lib/content/load-content";

it("loads only normalized public evidence labels", async () => {
  const claims = await loadClaims();
  expect(claims.get("claim-harness-capability-configuration")?.label).toBe("inferred");
});

it("resolves every claim source and every revision target", async () => {
  const [claims, sources, revisions] = await Promise.all([
    loadClaims(), loadSources(), loadRevisions(),
  ]);
  for (const claim of claims.values()) {
    claim.sourceIds.forEach((id) => expect(sources.has(id)).toBe(true));
  }
  expect(revisions.get("revision-fieldbook-essay-001")?.targetSlug)
    .toBe("the-model-is-not-the-agent");
});
```

- [ ] **Step 2: Run tests and verify loader failures**

Run: `npm test -- tests/content/content-integrity.test.ts`  
Expected: FAIL because the schemas, loaders, and content records do not exist.

- [ ] **Step 3: Define exact public record schemas**

```ts
export const EvidenceLabel = z.enum([
  "observed", "author-reported", "inferred", "proposed", "unproved",
]);
export const EvidenceGrade = z.enum(["IP", "FD", "FL", "W"]);

export const ClaimSchema = z.object({
  id: z.string().regex(/^claim-[a-z0-9-]+$/),
  statement: z.string().min(20),
  label: EvidenceLabel,
  scope: z.string().min(2),
  sourceIds: z.array(z.string()).min(1),
  falsifiers: z.array(z.string()).min(1),
  lastReviewed: z.iso.date(),
  revision: z.number().int().positive(),
});
```

Define equivalent `SourceSchema`, `RevisionSchema`, and `EssayMetadataSchema` using the fields mandated by the design specification. YAML uses snake_case; loaders normalize to camelCase typed records.

- [ ] **Step 4: Add the first reviewed records**

The Earendil source record must identify the canonical URL, Earendil as author, `2026-08-20` publication date, `2026-08-21` retrieval date, `first-party-essay` source type, `FD` grade, its four-part beginner model as author-reported, and the provider-parity/authorization/completion limitations as unknown or unsupported by that source.

The fieldbook source record must identify the public chapter as a publication synthesis, not expose the private vault path, and carry `IP` only for mechanisms backed by inspected implementation artifacts.

- [ ] **Step 5: Implement deterministic loaders and heading slugs**

Load only repository-relative paths rooted under `content/`. Reject absolute paths, `..`, broken source IDs, duplicate IDs, invalid labels, missing license status, and invalid dates with messages containing the offending public filename.

- [ ] **Step 6: Verify registry integrity**

Run: `npm test -- tests/content/content-integrity.test.ts`  
Expected: PASS for all records and FAIL fixtures with explicit filenames.

- [ ] **Step 7: Commit**

```bash
git add lib/content content tests/content
git commit -m "content: add validated evidence registries (why: keep public claims inspectable)"
```

---

### Task 3: Publication homepage and static system trace

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Create: `components/diagrams/system-trace.tsx`
- Modify: `tests/interface/homepage.test.tsx`
- Create: `tests/interface/system-trace.test.tsx`

**Interfaces:**
- Consumes: `PublicationShell` and approved tokens.
- Produces: `SystemTrace({ compact?: boolean })` and the canonical homepage entry point.

- [ ] **Step 1: Write failing homepage and trace tests**

```tsx
expect(screen.getByRole("heading", {
  name: "The model is only one part of the agent.", level: 1,
})).toBeInTheDocument();
expect(screen.getByRole("link", { name: "Start with the model" }))
  .toHaveAttribute("href", "/fieldbook/the-model-is-not-the-agent");
expect(screen.getAllByTestId("trace-step").map((node) => node.textContent))
  .toEqual(["Admit", "Context", "Capabilities", "Execute", "State", "Effect", "Reconcile", "Evidence", "Verify", "Accept or re-enter"]);
```

- [ ] **Step 2: Run tests and verify failures**

Run: `npm test -- tests/interface/homepage.test.tsx tests/interface/system-trace.test.tsx`  
Expected: FAIL because the homepage and trace do not contain the production content.

- [ ] **Step 3: Implement the prose-first homepage**

Render, in order: thesis hero, “Start with the model” link, compact trace, Harness Engineering introduction, Memory Engineering introduction, evidence promise, correction promise, and alpha publication status. Use ordinary links and server-rendered text; do not add a carousel, counters, or scroll-triggered animation.

- [ ] **Step 4: Implement the static-first trace**

Use an ordered list with text labels and CSS connectors. Each step includes a visually hidden explanation so the complete trace is understandable without color or JavaScript.

- [ ] **Step 5: Verify homepage behavior and build**

Run: `npm test -- tests/interface/homepage.test.tsx tests/interface/system-trace.test.tsx && npm run build`  
Expected: PASS; `/` is statically generated and contains the canonical chapter link.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/globals.css components/diagrams tests/interface
git commit -m "site: build the fieldbook front door (why: lead readers through the shared thesis)"
```

---

### Task 4: Complete flagship chapter reader

**Files:**
- Create: `content/essays/harness/the-model-is-not-the-agent.mdx`
- Create: `app/fieldbook/[slug]/page.tsx`
- Create: `components/article/article-reader.tsx`
- Create: `components/article/article-contents.tsx`
- Create: `components/article/sequence-navigation.tsx`
- Create: `components/article/evidence-badge.tsx`
- Create: `components/article/revision-notice.tsx`
- Modify: `app/globals.css`
- Create: `tests/interface/reader.test.tsx`
- Create: `tests/e2e/reader.spec.ts`
- Create: `playwright.config.ts`

**Interfaces:**
- Consumes: `loadEssay`, `loadClaims`, `loadSources`, `loadRevisions`, `slugifyHeading`, and `SystemTrace`.
- Produces: static `/fieldbook/the-model-is-not-the-agent`, generated article metadata, progressive evidence details, sequence navigation, and durable heading anchors.

- [ ] **Step 1: Write failing reader tests**

```tsx
expect(screen.getByRole("heading", { name: "The Model Is Not the Agent", level: 1 }))
  .toBeInTheDocument();
expect(screen.getByText("Observed", { selector: "button" })).toHaveAttribute(
  "aria-expanded", "false",
);
expect(screen.getByRole("navigation", { name: "Harness Engineering sequence" }))
  .toBeInTheDocument();
expect(screen.getByRole("link", { name: "Challenge this claim" }).getAttribute("href"))
  .toContain("github.com/Pin4sf/systems-around-models/issues/new");
```

- [ ] **Step 2: Run tests and verify failures**

Run: `npm test -- tests/interface/reader.test.tsx`  
Expected: FAIL because the reader components and chapter do not exist.

- [ ] **Step 3: Create the intentionally public chapter**

Write original publication prose under these exact headings:

1. `Failure Before Definition`
2. `The Harness Boundary`
3. `Control and User Leverage`
4. `The End-to-End Trace`
5. `What Architecture Selection Changes`
6. `Uncertainties and Falsifiers`
7. `Sources and Revision Record`

The chapter must include the Atlas ambiguous-effect failure trace, the four-part beginner map attributed to Earendil, the stricter model × harness × environment × authority formulation, provider portability distinctions, and the difference between model stopping, effect success, Verification, Acceptance, and closure. Do not copy private paths, Atlan material, third-party prose, volatile ecosystem counts, or unsupported historical superlatives.

- [ ] **Step 4: Implement the server-rendered reader**

Use `compileMDX` with a fixed component map. Reject arbitrary component imports from MDX. Generate heading IDs with `slugifyHeading`, render the desktop sequence rail and contents rail, and preserve a single prose column on mobile.

- [ ] **Step 5: Implement progressive evidence disclosure**

`EvidenceBadge` receives `claimId: string`, looks up its server-provided record, and renders an accessible button plus adjacent details. The initial HTML includes the label definition and source links; client code controls visibility only.

- [ ] **Step 6: Implement revision and correction entry points**

Create a prefilled GitHub issue URL containing repository, route, article revision, section anchor, and claim ID. Render publication date, substantive revision date, and revision identifier at the chapter beginning and end.

- [ ] **Step 7: Verify desktop, mobile, keyboard, and no-JavaScript paths**

Playwright assertions:

```ts
await page.goto("/fieldbook/the-model-is-not-the-agent");
await expect(page.getByRole("heading", { name: "The Model Is Not the Agent" })).toBeVisible();
await expect(page.getByRole("navigation", { name: "Harness Engineering sequence" })).toBeVisible();
await page.setViewportSize({ width: 390, height: 844 });
await expect(page.getByRole("button", { name: "Open sequence" })).toBeVisible();
```

Run a second Playwright project with `javaScriptEnabled: false` and assert that prose, source links, the static trace, and previous/next links remain visible.

- [ ] **Step 8: Run reader verification**

Run: `npm test -- tests/interface/reader.test.tsx && npm run build && npm run test:e2e -- tests/e2e/reader.spec.ts`  
Expected: all checks PASS for desktop, mobile, and no-JavaScript configurations.

- [ ] **Step 9: Commit**

```bash
git add content/essays app/fieldbook components/article app/globals.css tests/interface/reader.test.tsx tests/e2e playwright.config.ts
git commit -m "fieldbook: publish the first evidence-labeled chapter (why: prove the complete reader experience)"
```

---

### Task 5: Publication metadata, feeds, print, and release checks

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/fieldbook/[slug]/page.tsx`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `app/rss.xml/route.ts`
- Modify: `app/globals.css`
- Create: `tests/publication/metadata.test.ts`
- Create: `scripts/check-public-content.mjs`
- Modify: `package.json`
- Create: `.github/ISSUE_TEMPLATE/correction.yml`
- Create: `.github/workflows/verify.yml`

**Interfaces:**
- Consumes: `listEssays()` and canonical essay/source/revision records.
- Produces: route-specific metadata, sitemap, RSS, correction template, CI verification, print output, and privacy/source guardrails.

- [ ] **Step 1: Write failing metadata and feed tests**

Assert that the homepage and chapter have distinct titles/descriptions, the chapter metadata uses its essay revision, sitemap contains exactly the released routes, and RSS contains the flagship essay with its canonical URL.

- [ ] **Step 2: Run tests and verify failures**

Run: `npm test -- tests/publication/metadata.test.ts`  
Expected: FAIL because route metadata, sitemap, and RSS are incomplete.

- [ ] **Step 3: Implement canonical metadata and feeds from content records**

Use one `SITE_URL` environment value. Development and test builds fall back to `http://localhost:3000`; production builds fail with `SITE_URL is required for production metadata` when it is absent. Generate Article structured data from the same essay record used by the visible page. The approved hosting URL will be supplied only at the release-candidate deployment gate.

- [ ] **Step 4: Add print and reduced-motion behavior**

Print expands source URLs, retains evidence labels and revision metadata, removes navigation controls, and preserves diagrams in monochrome. Reduced-motion disables progress transitions and diagram step animation.

- [ ] **Step 5: Add deterministic public-content checks**

`scripts/check-public-content.mjs` must fail on absolute local paths, `waldo-brain`, credential patterns, unresolved `source_ids`, invalid evidence labels, missing license status, and unpublished records referenced by navigation. Add `npm run check:public`.

- [ ] **Step 6: Add correction issue template and CI**

The correction template requests exact URL, revision, section, disputed statement, counter-evidence, and desired correction. It warns contributors not to submit credentials, personal data, health data, private traces, or copyrighted documents.

CI runs:

```bash
npm ci
npm run lint
npm test
npm run check:public
npm run build
```

- [ ] **Step 7: Run the complete release-candidate check**

Run: `npm run lint && npm test && npm run check:public && npm run build && npm run test:e2e`  
Expected: PASS with only `/` and `/fieldbook/the-model-is-not-the-agent` presented as complete publication routes.

- [ ] **Step 8: Commit**

```bash
git add app .github scripts tests/publication package.json package-lock.json
git commit -m "release: add publication integrity gates (why: make the first reader safe to review publicly)"
```

---

## Release-candidate handoff

After Task 5:

1. show the local homepage and reader to Shivansh;
2. report source, privacy, accessibility, metadata, build, and end-to-end validation results;
3. identify the exact public content revision and Git commit;
4. request approval for the hosting destination and public site deployment;
5. do not deploy the website until that approval is explicit.
