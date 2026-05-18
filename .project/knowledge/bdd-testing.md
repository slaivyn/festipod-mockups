# BDD Testing

Cucumber/Gherkin BDD specs in French with multi-layer step definitions.

## Overview

- 26 feature files (US-1 to US-26), all in French
- Categories: EVENT, WORKSHOP, USER, MEETING, NOTIF
- Priorities: 0 (Impossible), 1 (Haute), 2 (Moyenne), 3 (Basse)
- Current results: 51 passed, 7 failed, 75 skipped (133 scenarios total)

## Multi-Layer BDD

Each module has step directories for three test layers:

```
src/modules/event/steps/
  ui/           # UI/screen assertions (source analysis)
  data/         # Data layer assertions (Playwright + broker)
  e2e/          # E2E assertions (Playwright + broker + real app UI)
```

Shared steps (cross-domain) live in `src/shared/steps/ui/`.

## Feature Files

Collocated with their module:

```
src/modules/event/features/us-13-creer-evenement.feature
src/modules/user/features/us-23-connexion-utilisateurs.feature
src/modules/workshop/features/us-1-visualiser-atelier-termine.feature
...
```

Tagged with `@CATEGORY @priority-N` for filtering.

## Step Definitions

### Shared Steps (`src/shared/steps/ui/`)

| File | Purpose |
|------|---------|
| `navigation.steps.ts` | Screen navigation, authentication, click/select actions, section/button/field assertions |
| `form.steps.ts` | Form field validation, required fields, import/duplicate detection |
| `screen.steps.ts` | Screen content assertions (participants, events, profiles, QR codes) |

### How UI Steps Work

`@ui` steps render the screen with `LocalDataProvider` (seed data) and `RouterProvider` via happy-dom, then assert on the rendered DOM. The render helper lives in `src/shared/test-harness/renderHelper.tsx` and is invoked from `world.ts:renderCurrentScreen()` on every `navigateTo(...)`.

See [test-layer-contracts](./test-layer-contracts.md) for what `@ui` is allowed to test and the patterns to follow (and avoid).

Legacy: `screenFileMap`, `screenFieldDetectors`, `screenExpectedContent`, `screenRequiredFields` in `world.ts` are vestiges of an earlier source-code-grep approach. `hasText`/`hasField`/`hasElement` now prefer the rendered DOM and fall back to source so unmigrated steps keep working during the transition.

### Screen Name Resolution

French names in `.feature` files map to screen IDs via `screenNameMap`:
- `"accueil"` → `home`
- `"détail événement"` → `event-detail`
- `"mon profil"` → `profile`
- `"relayer un événement"` → `create-event`

## Cucumber Configuration

`cucumber.json`:
```json
{
  "default": {
    "import": [
      "src/shared/support/**/*.ts",
      "src/shared/steps/**/*.ts",
      "src/modules/*/steps/**/*.ts"
    ],
    "paths": ["src/modules/*/features/**/*.feature"],
    "language": "fr"
  }
}
```

Requires `tsx` loader: `node --import tsx/esm node_modules/.bin/cucumber-js`

## Auto-Generated Files

Scripts in `scripts/` parse features and steps into TypeScript data files consumed by the prototyping tool:

| Script | Input | Output |
|--------|-------|--------|
| `parse-features.ts` | `src/modules/*/features/*.feature` | `src/shared/data/features.ts` |
| `parse-test-results.ts` | `reports/cucumber-report.json` | `src/shared/data/testResults.ts` |
| `extract-step-definitions.ts` | `src/shared/steps/ui/*.ts` | `src/shared/data/stepDefinitions.ts` |

Run all: `bun run test:cucumber`

## Data-Layer Testing

`@data` scenarios test through the real NextGraph broker. See [data-layer-testing](./data-layer-testing.md) for full architecture.

## E2E Testing

`@e2e` scenarios test the real app running in the broker iframe. See [data-layer-testing](./data-layer-testing.md#e2e-layer) for architecture. Key differences from `@data`:

- Uses the **real app** (not a test harness) served on a local HTTP port
- Interacts via Playwright locators and `evaluate()` on the app iframe
- Tests actual UI behavior: navigation, redirects, button clicks, screen content
- Requires real broker mode (fails with `Error` if broker unavailable)

## Adding New Steps

1. **Module-specific**: Create in `src/modules/{module}/steps/ui/`
2. **Cross-domain**: Add to `src/shared/steps/ui/`
3. Import `FestipodWorld` type from `../../support/world` (shared) or adjust relative path
4. Run `bun run steps:extract` to regenerate tooltip data
