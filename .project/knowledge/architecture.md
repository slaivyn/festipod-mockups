# Architecture

Feature-based architecture where code is organized by business domain (module), not by technical layer.

## Module Structure

```
src/modules/
  event/          # 7 screens, 5 features — events CRUD, discovery, participants, meeting points
  user/           # 5 screens, 11 features — profiles, friends, sharing
  home/           # 2 screens — dashboard, settings
  auth/           # 2 screens — login, welcome/onboarding
  workshop/       # 0 screens, 6 features — workshop/atelier specs (future)
  meeting/        # 0 screens, 1 feature — meeting point specs
  notification/   # 0 screens, 3 features — notification specs
```

Each module can contain:
- `screens/` — React screen components
- `features/` — Gherkin `.feature` files (BDD specs)
- `steps/{frontend,backend,e2e}/` — Cucumber step definitions by layer

## Import Rules

**Modules only import from `shared/` — never from each other.**

```
src/modules/event/screens/EventDetailScreen.tsx
  ✅ import from '../../../shared/components/sketchy'
  ✅ import from '../../../shared/context/FestipodDataContext'
  ✅ import from '../../../screens' (registry types)
  ❌ import from '../../user/screens/...'
```

## Shared Layer

`src/shared/` contains everything reusable across modules:

| Directory | Contents |
|-----------|----------|
| `components/sketchy/` | Hand-drawn UI library (Button, Card, Avatar, Header, NavBar, etc.) |
| `components/ui/` | Shadcn/Radix components (used only in prototyping tool) |
| `context/` | ThemeContext, NextGraphContext, FestipodDataContext |
| `data/` | User stories (`index.ts`), auto-generated `features.ts`, `testResults.ts`, `seedData.ts`, `types.ts` |
| `hooks/` | `useShapeWithDefaults` (NextGraph) |
| `shapes/` | SHEX definitions + ORM TypeScript bindings |
| `utils/` | `ngSession.ts`, `ngBootstrap.ts` |
| `steps/frontend/` | Shared BDD step definitions (navigation, screen, form) |
| `support/` | Cucumber `world.ts`, `hooks.ts` |
| `types/` | `gherkin.ts` (ParsedFeature, ParsedScenario types) |
| `lib/` | `utils.ts` (cn helper for Tailwind) |

## App Shell

`src/app/` is the prototyping tool — not part of the Festipod app itself:

- `App.tsx` — Root: ThemeProvider > NextGraphProvider > FestipodDataProvider > RouterProvider
- `router.tsx` — Hash-based routing: `#/` (gallery), `#/demo/{screenId}`, `#/specs/{featureId}`
- `frontend.tsx` — React entry point (referenced from `src/index.html`)
- `components/Gallery.tsx` — Screen preview grid
- `components/DemoMode.tsx` — Interactive mockup viewer with sidebar navigation
- `components/specs/` — BDD specs browser (SpecsPage, FeatureView, GherkinHighlighter)

## Screen Registry

`src/screens/index.ts` is the central registry that imports all screens from all modules and exports:
- `screenGroups` — Grouped by domain (Accueil, Evenements, Utilisateur, General)
- `screens` — Flat list
- `getScreen(id)` — Lookup by ID
- `ScreenProps` interface — `{ navigate: (screenId: string) => void }`

## Entry Points

| File | Purpose |
|------|---------|
| `src/index.ts` | Bun.serve() — HTTP server, serves index.html + cucumber report |
| `src/index.html` | HTML entry, loads `src/app/frontend.tsx` |
| `src/app/frontend.tsx` | React root, renders `<App />` |

## Build

- Dev: `bun --hot src/index.ts` (via `bun run dev`)
- Prod: `bun run build.ts` — Bun bundler + Tailwind plugin → `dist/`
- Path alias: `@/*` → `./src/*` (tsconfig)
