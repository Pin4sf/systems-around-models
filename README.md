# Systems Around Models

A practical, independent study guide to the systems surrounding AI models: harnesses, memory, environments, authority, recovery, verification, and completion.

## Current status

The public study hub now includes the complete **Harness Engineering** and **Memory Engineering** short guides, the first deeper chapter (“The Model Is Not the Agent”), and **The Big Agent Harness Architecture Comparison** at `/architectures`. The architecture reader compares eight source-pinned working profiles through one shared registry, normalized responsibility topologies, a wide matrix, and an anchored gallery.

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
