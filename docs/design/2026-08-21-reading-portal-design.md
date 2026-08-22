# Systems Around Models — Reading Portal Design

**Status:** Proposed for production implementation  
**Date:** 2026-08-21  
**Owner:** Shivansh Fulper  
**First release:** Portal homepage plus one complete Harness Engineering chapter  

> **Reader-interface amendment — 2026-08-22:** Direct reader review supersedes the
> visible evidence-badge, source-drawer, and revision-panel requirements below for
> the study-guide reader. Evidence labels, source manifests, and revision records
> remain build-time editorial controls. The public reading surface uses ordinary
> links, a sources section, a quiet last-updated line, and one article-level
> correction path. The primary release now includes a complete short Harness
> Engineering guide, with detailed chapters as optional deeper reading.
>
> For the 2026-08-22 Harness study-guide release, this amendment also
> supersedes the earlier first-release product clauses in Sections 1, 2, 5,
> 15, and 16 that require a Fieldbook identity, a simultaneous Memory track,
> visible claim inspection, evidence drawers, revision panels, or explicit
> evidence-badge acceptance. Memory Engineering and gallery work remain future
> projects. The current acceptance contract is: a complete Harness short
> course; truthful curriculum and detailed-chapter status; ordinary public
> sources with complete backstage manifests; one quiet article-level correction
> path; and responsive, static, private-corpus-independent reading.

## 1. Product decision

Build **Systems Around Models** as a standalone, clean-room research publication. Its first public artifact is **The Agent Systems Fieldbook**, with connected Harness Engineering and Memory Engineering sequences.

The first production slice proves the reading system through two routes:

1. `/` — publication front door and sequence map;
2. `/fieldbook/the-model-is-not-the-agent` — the complete flagship chapter reader.

The site must feel like a trusted technical reference with an authored point of view. Waldo and Kennel may later appear as evidence-labeled case studies, but neither is the publication identity or assumed universal architecture.

## 2. Reader promise

A reader should be able to:

- understand the central argument without opening a supplement;
- inspect the evidence behind an important claim without leaving the page;
- distinguish observed, author-reported, inferred, proposed, and unproved claims;
- follow the Harness or Memory sequence without losing their place;
- link to a specific section or version;
- challenge a claim through a visible correction path;
- read comfortably on desktop or mobile for at least thirty minutes.

The publication should reward inspection, not attention capture. No streaks, scores, infinite feeds, engagement counts, or generic AI spectacle are permitted in the first release.

## 3. Approaches considered

### Approach A — Static-first Next.js publication — selected

Use Next.js App Router, TypeScript, MDX, and build-time content registries. Generate the reading routes statically and add small client-side islands only for evidence drawers, reading progress, and diagrams.

Why selected:

- the existing Waldo article reader provides proven implementation patterns without requiring shared branding or source code ownership;
- static output keeps the publication fast, inspectable, searchable, and inexpensive;
- Next.js supports route metadata, print styles, RSS, sitemaps, and later interactive gallery routes;
- the team already operates and deploys this stack.

### Approach B — Astro content site — not selected

Astro would provide excellent static-content ergonomics and minimal client JavaScript. It is not selected because introducing a second web stack provides little reader value and would slow reuse of the existing article-navigation and metadata patterns.

### Approach C — Add `/research` to the Waldo landing site — rejected

This would be fastest initially, but it would make a general-purpose research project look like product marketing, couple its release cycle to Waldo, and weaken the clean-room boundary.

## 4. Visual direction

The approved direction is **The Annotated Field Manual**:

- AI 2027 for prose-first editorial architecture, adjacent diagrams, and supplements;
- AE Studio's Pirate page for restrained archival texture, large editorial type, and compact metadata;
- LessWrong for sequences, durable section links, and intellectual navigation;
- Lightcone Commons for rare, memorable chapter-opening gestures rather than persistent illustration.

### Visual tokens

| Role | Token |
|---|---|
| Paper | `#F4F0E6` |
| Deep paper | `#E8E0CF` |
| Ink | `#171510` |
| Muted ink | `#716B60` |
| Rule | `#C9BFAA` |
| Evidence green | `#28513D` |
| Evidence wash | `#DCE7DC` |
| Correction rust | `#A63F28` |
| Correction wash | `#EFDCD3` |
| Archival gold | `#A47C2B` |

Typography:

- Source Serif 4 for display and reading text;
- Inter for interface controls and navigation;
- IBM Plex Mono for evidence labels, traces, versions, and machine-readable details.

The body measure is 68–74 characters. Body text targets 18–20 px desktop and 17–18 px mobile with at least 1.65 line height. Large display typography appears at entrances and section transitions, not throughout the prose.

### Visual prohibitions

- no glowing nodes, brains, robot imagery, particles, glass panels, or AI gradients;
- no persistent animation next to long-form prose;
- no decorative card grid where ordinary paragraphs would be clearer;
- no copied illustration, prose, or visual identity from the reference sites;
- no Waldo mascot, health palette, or product conversion funnel.

## 5. Information architecture

### Launch navigation

The persistent publication navigation contains:

- Fieldbook;
- Architectures;
- Sources;
- Revisions.

Only Fieldbook is a complete section in the first production slice. The other labels may appear only when their destination contains a truthful explanation and release status; no dead navigation or invented catalog counts are allowed.

### Homepage

The homepage follows this order:

1. publication name and central thesis;
2. primary action: “Start with the model”;
3. compact end-to-end system trace;
4. Harness Engineering and Memory Engineering sequence introductions;
5. evidence and correction promise;
6. current publication status and version.

The page is a front door, not a marketing funnel. It contains no waitlist, pricing, product pitch, testimonial carousel, or false activity signals.

### Chapter reader

Desktop uses three coordinated columns:

1. left: sequence position and neighboring chapters;
2. center: narrative and technical content;
3. right: section contents, evidence context, and correction entry point.

Mobile preserves only the central column. Sequence navigation and section contents become accessible drawers. Evidence details open inline or as a bottom sheet without resetting scroll position.

The chapter order is:

1. concrete failure trace;
2. central claim;
3. harness boundary;
4. four-part beginner model and production extensions;
5. end-to-end system trace;
6. selection consequences;
7. uncertainties and falsifiers;
8. sources and revision record;
9. next chapter.

## 6. Content architecture

The public repository is the only input to the public build. It must never read directly from a private research corpus at runtime or during deployment.

```text
content/
  essays/
    harness/
    memory/
  claims/
  sources/
  architectures/
  revisions/
```

### Essay record

Each MDX essay declares:

- stable slug;
- title and description;
- sequence and sequence position;
- authors;
- published and substantively revised dates;
- reading time source;
- public status;
- source-manifest identifiers;
- revision identifier;
- previous and next essay identifiers.

### Claim record

Claims requiring explicit evidence state use a canonical record rather than hand-authored badge text.

```yaml
id: claim-harness-capability-configuration
statement: System capability belongs to the model-harness-environment-authority configuration.
label: inferred
scope: general
source_ids:
  - source-harness-engineering-fieldbook-v1
falsifiers:
  - A model-only evaluation predicts deployed agent performance across materially different harnesses and environments.
last_reviewed: 2026-08-21
revision: 1
```

Allowed claim labels are:

- `observed` — directly inspected in a cited artifact, code path, document, or reproduced behavior;
- `author-reported` — claimed by the builder or evaluator but not independently reproduced here;
- `inferred` — derived from observed mechanisms or multiple sources;
- `proposed` — introduced by this project rather than asserted as a field standard;
- `unproved` — described or designed without sufficient implementation or operational evidence.

System-level evidence grades remain separate:

- `IP` — implementation-primary;
- `FD` — first-party documented;
- `FL` — first-party limited;
- `W` — weak or secondary evidence.

The interface must never convert one classification into the other.

### Source record

Each source manifest records:

- stable source identifier;
- canonical title, author, and URL;
- publication and retrieval dates;
- repository commit and inspected paths when applicable;
- source type and license status;
- observed mechanisms;
- author-reported claims;
- unknowns and falsifiers;
- last validation date;
- correction-ledger review status.

## 7. Core components

### `PublicationShell`

Owns publication navigation, global styles, metadata defaults, skip links, and footer. It contains no article-specific claims.

### `SequenceNavigation`

Renders the canonical sequence order and current position. It collapses to a drawer on narrow screens and remains usable without client JavaScript through ordinary links.

### `ArticleReader`

Renders MDX prose, heading anchors, figures, notes, sources, previous/next navigation, and print structure. It constrains prose width independently from diagrams.

### `EvidenceBadge`

Displays a claim's canonical evidence label. Activating it reveals the definition, supporting sources, scope, last review, and falsifiers. Color is supplemental; every state includes readable text.

### `SourceDrawer`

Shows the source manifest for the active claim or citation without destroying reading position. Direct source links remain normal anchors and work without the drawer.

### `SystemTrace`

Renders the shared trace:

```text
admit → compile context → bind capabilities → execute → commit state
→ attempt effect → reconcile → collect evidence → verify
→ accept/close or re-enter
```

The default view is a complete static diagram. Interaction adds step explanations and relevant system examples; it does not hide required meaning.

### `RevisionNotice`

Shows publication date, last substantive revision, revision identifier, and a link to the public revision entry.

### `CorrectionLink`

Opens a prefilled GitHub issue containing page URL, revision, section anchor, claim identifier when present, and fields for counter-evidence. It must not collect credentials, personal data, or private documents.

## 8. Data flow

At build time:

1. validate essay frontmatter;
2. validate claim, source, and revision records against schemas;
3. reject unresolved source identifiers or invalid evidence labels;
4. generate sequence order and article routes;
5. render metadata, RSS, sitemap, and structured data from the same records;
6. generate a build manifest containing content revisions and source-validation dates.

At runtime, the launch site requires no database. Client state is limited to reading progress and optional reader preferences stored on the device. It does not record reading history remotely.

## 9. Corrections and revisions

The public correction loop is:

```text
reader identifies exact claim
→ prefilled public issue
→ evidence review
→ accept, qualify, reject, or leave unresolved
→ update canonical claim/source record
→ publish revision entry
→ affected pages display the new revision
```

Corrections are not silently overwritten. Each accepted substantive correction states what changed, why, which pages were affected, and whether prior conclusions still hold. Rejected corrections retain a concise disposition when they raised a substantive challenge.

## 10. Accessibility and reading behavior

- meet WCAG 2.2 AA contrast and keyboard requirements;
- expose skip links and logical landmarks;
- keep heading hierarchy sequential;
- provide text equivalents for diagrams;
- never require hover for evidence or navigation;
- respect `prefers-reduced-motion`;
- retain visible focus states;
- use semantic footnotes and references;
- preserve 200% text zoom without horizontal prose scrolling;
- provide print styles with expanded URLs, evidence labels, and revision metadata.

Reading progress is local, nonessential, and motion-light. It must not appear as a score or imply completion of the ideas.

## 11. Performance and resilience

Targets for the representative chapter on a mid-tier mobile connection:

- hydrated client JavaScript under 120 KB compressed on the representative chapter route;
- no layout shift from fonts or diagrams;
- no autoplay media;
- primary prose usable before interactive components hydrate;
- static diagram and evidence definitions available when JavaScript fails;
- optimized social image and no decorative hero image required for first contentful paint.

The build fails on broken internal links, duplicate slugs, missing evidence definitions, missing revision identifiers, or unresolved public source records.

## 12. Search, sharing, and distribution

Every chapter has canonical metadata derived from its essay record:

- unique title and description;
- article publication and revision dates;
- author identity;
- canonical URL;
- Open Graph and X metadata;
- Article structured data;
- share image specific to the publication, with no inherited Waldo branding.

The first release includes RSS and sitemap generation. Search across essays and Architecture Cards waits until enough public content exists to produce meaningful results.

## 13. Public, private, and legal boundary

The clean-room public repository must not contain:

- proprietary Atlan or Waldo implementation details that are not already approved public material;
- credentials, local paths, private URLs, user data, health data, personal traces, or internal session logs;
- proprietary prompts or source code copied without permission;
- third-party diagrams, illustrations, prose, or screenshots without an appropriate license;
- claims of implementation, parity, adoption, or operational proof unsupported by the public evidence record.

Before public release, every page passes:

1. source and version review;
2. correction-ledger review;
3. privacy and credential scan;
4. legal and license review;
5. unsupported-claim review;
6. visual and accessibility review.

## 14. Testing

### Content validation

- schema tests for essays, claims, sources, and revisions;
- broken-link and duplicate-anchor tests;
- sequence-order consistency tests;
- claim/source referential-integrity tests;
- snapshot tests for evidence-label definitions.

### Interface validation

- desktop and mobile route rendering;
- keyboard navigation through drawers, badges, and source panels;
- focus restoration after closing overlays;
- JavaScript-disabled reading and navigation;
- reduced-motion behavior;
- print output;
- metadata, RSS, sitemap, and structured-data assertions.

### Publication validation

- private-term and secret-pattern scan;
- source-license field present for every public source;
- no unpublished architecture card reachable from navigation;
- correction link contains the page revision and section anchor;
- representative external links checked before release.

## 15. Delivery sequence

### Slice 1 — First meaningful preview

- create the standalone application shell;
- implement the approved visual tokens;
- implement the homepage hero, sequence introductions, and static trace;
- implement the opening chapter header and first failure trace;
- verify desktop and mobile compilation;
- present the working local reader before broadening the build.

### Slice 2 — Complete reader

- finish the flagship chapter;
- add sequence and section navigation;
- add evidence badges and source drawer;
- add revision notice and correction link;
- add print and reduced-motion behavior.

### Slice 3 — Publication plumbing

- add schemas and build validation;
- add canonical metadata, structured data, RSS, and sitemap;
- add public revisions surface;
- add accessibility, performance, source, privacy, and legal checks.

### Slice 4 — Release candidate

- run editorial and evidence review;
- run responsive visual review;
- validate production build;
- publish only after Shivansh approves the release candidate and destination.

## 16. Acceptance criteria

The first release is acceptable when:

- a new reader can state why the model is not the agent after reading the opening chapter;
- the homepage leads directly to a complete Harness Engineering short course and truthfully labels the deeper curriculum;
- every public source named by the guide resolves to a backstage source record even though evidence controls are not shown in the reader;
- the system trace is understandable without interaction;
- chapter, section, source, and correction links are durable;
- the representative reader works on mobile, keyboard-only, reduced-motion, print, and JavaScript-disabled paths;
- no private Waldo-vault content or unsupported product claim appears in the repository or build;
- the site passes production build, content-integrity, accessibility, privacy, and metadata checks;
- no public deployment occurs before explicit release-candidate approval.

## 17. Explicit non-goals for the first release

- comments, accounts, votes, reactions, or personalized feeds;
- a universal architecture leaderboard;
- the full Harness or Memory books;
- architecture comparison filters;
- PDF or EPUB export;
- site-wide search;
- analytics or reader surveillance;
- dark theme;
- community-submitted Architecture Cards;
- Waldo product conversion or lead capture.

These may be evaluated only after the reader proves that people can understand, inspect, and challenge the core work.
