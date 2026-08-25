# Systems Around Models

A practical, independent study guide to the systems surrounding AI models: harnesses, memory, environments, authority, recovery, verification, and completion.

Live deployment: [systems-around-models.vercel.app](https://systems-around-models.vercel.app/)

## Current status

The public study hub now includes the complete **Harness Engineering** and **Memory Engineering** short guides, Harness Chapters 1–28, and **The Big Agent Harness Architecture Comparison** at `/architectures`. The architecture reader compares nine source-pinned profiles through one shared registry, normalized responsibility topologies, a wide matrix, and an anchored gallery. OpenAI Codex and DeepSeek Harness/Cordis have extended study pages; their visible evidence boundaries and the maintained refresh queue distinguish a current working study from an implementation-pinned dossier.

The editorial refresh queue is maintained in [`docs/editorial/publication-refresh-queue.md`](docs/editorial/publication-refresh-queue.md).

The production contract is in [`docs/design/2026-08-21-reading-portal-design.md`](docs/design/2026-08-21-reading-portal-design.md).

## Clean-room boundary

A separate private research corpus may be consulted manually for source discovery and context. This repository is the only input to the public website. It must not import from, depend on, or automatically copy the private corpus during development, build, or deployment.

Public claims, sources, diagrams, and architecture records must be independently reviewed and intentionally transferred into this repository with their evidence, version, privacy, and license status intact.

## Release verification

Run the same ordered release gate locally and in CI with the reserved non-public metadata origin:

```bash
SITE_URL=https://example.invalid npm run verify:release
```

The gate runs lint, unit and content tests, the reviewed source scan, manifest generation and production build, deployable built-output scan, representative-route compressed JavaScript budget, and all Playwright projects. A production build without `SITE_URL` is expected to fail closed.
