# Festipod

Prototyping tool for a mobile festival/event app — mockup screens, user stories, and BDD specs.

## Two Apps in One

| Layer | Tech | Purpose |
|-------|------|---------|
| **Festipod App** (mockups) | React + sketchy components | 16 mobile screens with hand-drawn UI |
| **Prototyping Tool** (shell) | React + Tailwind/Shadcn | Gallery, demo viewer, BDD specs browser |

## Architecture

Feature-based: code organized by business domain, not technical layer. See [architecture](.project/knowledge/architecture.md).

```
src/modules/{event,user,home,auth,workshop,meeting,notification}/
src/shared/          # Components, context, data — importable by all modules
src/app/             # Prototyping tool shell
src/screens/index.ts # Screen registry
```

## Data Layer

NextGraph (P2P/local-first) with SHEX shapes and ORM. See [data-layer](.project/knowledge/data-layer.md).

## BDD Testing

Multi-layer Cucumber/Gherkin in French. See [bdd-testing](.project/knowledge/bdd-testing.md).

`@data` scenarios test through the real NextGraph broker with Playwright. See [data-layer-testing](.project/knowledge/data-layer-testing.md).

## Quick Start

```bash
bun run dev              # Dev server with HMR (port 3000)
bun run build            # Production build to dist/
bun run test:cucumber    # Run all BDD tests
bun run features:parse   # Regenerate features.ts from .feature files
bun run steps:extract    # Extract step definitions for tooltips
bun run build:orm        # Regenerate ORM from SHEX shapes
```

## Documentation

- [Architecture](.project/knowledge/architecture.md) — module structure, import rules, app shell
- [Data Layer](.project/knowledge/data-layer.md) — NextGraph, shapes, context, seed data
- [BDD Testing](.project/knowledge/bdd-testing.md) — Cucumber setup, step layers, feature files
- [Screens](.project/knowledge/screens.md) — screen inventory, registry, sketchy components
- [Data-Layer Testing](.project/knowledge/data-layer-testing.md) — real broker testing, wallet setup, Playwright harness
