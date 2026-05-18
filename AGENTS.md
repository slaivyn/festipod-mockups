# Festipod

Mobile-first web app for discovering and sharing festival/event recommendations through trusted networks.

## Architecture

Feature-based: code organized by business domain, not technical layer. See [architecture](.project/knowledge/architecture.md).

```
src/modules/{event,user,home,auth,workshop,meeting,notification}/
src/shared/          # Components, context, data — importable by all modules
src/app/             # App shell (router, providers, entry point)
src/screens/index.ts # Screen registry (used by Storybook)
```

## Routing

Path-based routing with History API (custom router in `src/app/router.tsx`).

| Path | Screen |
|------|--------|
| `/` | WelcomeScreen |
| `/login` | LoginScreen |
| `/home` | HomeScreen |
| `/events` | EventsScreen |
| `/events/new` | CreateEventScreen |
| `/events/:id` | EventDetailScreen |
| `/events/:id/edit` | UpdateEventScreen |
| `/events/:id/invite` | InviteScreen |
| `/events/:id/participants` | ParticipantsListScreen |
| `/events/:id/meeting-points` | MeetingPointsScreen |
| `/profile` | ProfileScreen |
| `/profile/edit` | UpdateProfileScreen |
| `/profile/friends` | FriendsListScreen |
| `/profile/share` | ShareProfileScreen |
| `/users/:id` | UserProfileScreen |
| `/settings` | SettingsScreen |

Screens use `useNavigate()` and `useParams()` hooks from the router — no prop drilling.

## Data Layer

NextGraph (P2P/local-first) with SHEX shapes and ORM. See [data-layer](.project/knowledge/data-layer.md).

## BDD Testing

Multi-layer Cucumber/Gherkin in French. See [bdd-testing](.project/knowledge/bdd-testing.md) for the setup and [test-layer-contracts](.project/knowledge/test-layer-contracts.md) for what each layer is allowed to test.

`@ui` scenarios render screens in-process (happy-dom + seed data) and assert on the DOM. `@data` scenarios test data operations through the real NextGraph broker. `@e2e` scenarios test the real app UI in the broker iframe. See [data-layer-testing](.project/knowledge/data-layer-testing.md).

## Quick Start

```bash
bun run dev              # Dev server with HMR (port 3000)
bun run build            # Production build to dist/
bun run storybook        # Browse screens and components
bun run test:cucumber    # Run all BDD tests
bun run features:parse   # Regenerate features.ts from .feature files
bun run steps:extract    # Extract step definitions for tooltips
bun run build:orm        # Regenerate ORM from SHEX shapes
```

## Documentation

- [Architecture](.project/knowledge/architecture.md) — module structure, import rules, app shell
- [Data Layer](.project/knowledge/data-layer.md) — NextGraph, shapes, context, seed data
- [BDD Testing](.project/knowledge/bdd-testing.md) — Cucumber setup, step layers, feature files
- [Test Layer Contracts](.project/knowledge/test-layer-contracts.md) — what each of `@ui`/`@data`/`@e2e` is allowed to test
- [Screens](.project/knowledge/screens.md) — screen inventory, registry, sketchy components
- [Data-Layer Testing](.project/knowledge/data-layer-testing.md) — real broker testing, wallet setup, Playwright harness, e2e layer

## Briefs (work not yet started)

- [Multi-store refactor](.project/briefs/multi-store-refactor.md) — passer du mono-store actuel à une structure de Group stores par communauté/event/RDV (prérequis multi-user)
