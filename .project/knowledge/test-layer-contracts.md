# Test Layer Contracts

Each BDD test layer (`@ui`, `@data`, `@e2e`) answers a distinct question. Mixing concerns produces brittle tests that fail on refactors without catching real regressions.

## Overview

```
       /\  @e2e   ~10 scénarios, parcours utilisateur critiques
      /  \
     /----\
    / @data\  ~10 scénarios, mutations & persistance NG
   /--------\
  /   @ui    \  ~60 scénarios, 1-5 par état d'écran × 15 écrans
 /____________\
```

The pyramid reflects cost: `@ui` runs in-process (instant), `@data` boots a broker (~50s for the suite), `@e2e` boots broker + real app + navigates a real browser (~2min). Move every assertion to the lowest layer that can answer the question — UI rendering claims belong in `@ui`, not `@e2e`.

## Key Concepts

- **`@ui` — display layer.** Renders a screen with `LocalDataProvider` (seed data) + happy-dom and asserts on the resulting DOM. Verifies that *given known data, the screen shows the expected text and elements*. Does **not** test navigation outcomes, mutations, or data persistence.

- **`@data` — data layer.** Drives ORM mutations through the real NextGraph broker via a headless test harness. No app UI involved. Verifies that *operations on shapes are correctly persisted and observable in the wallet*. See [data-layer-testing](./data-layer-testing.md).

- **`@e2e` — integration layer.** Boots the real app inside the broker iframe with a Playwright-controlled Chromium. Verifies that *layers collaborate to deliver a user journey* (e.g. create → list → modify → reload → still there). Sparse: 1 scenario per critical path; never duplicate `@ui` content checks here.

## Implementation

### `@ui` — rendering helper

`src/shared/test-harness/renderHelper.tsx` installs happy-dom globals and renders any screen wrapped in `LocalDataProvider` + `RouterProvider`. Called from `world.ts:renderCurrentScreen()` on every `navigateTo(...)`. Seed data (`src/shared/data/seedData.ts`) provides predictable fixtures — `Marie Dupont`/`@mariedupont` is `currentUser`, `Jean Durand`/`@jeandurand` exists in `users`, 5 seed events, etc.

**Good `@ui` assertion patterns:**

```ts
// Text visible to the user
expect(this.getDomText()).to.include('Marie Dupont');

// Element presence by class/role
expect(this.renderedDoc!.querySelector('.app-avatar')).to.not.be.null;

// Conditional rendering (filled state vs empty state)
const cards = this.renderedDoc!.querySelectorAll('.app-card');
expect(cards.length).to.be.greaterThan(0);

// Required form fields rendered with their label + asterisk
const labels = Array.from(this.renderedDoc!.querySelectorAll('p'))
  .map(p => p.textContent ?? '');
expect(labels.some(t => t.includes("Nom de l'événement *"))).to.be.true;
```

**Anti-patterns to remove:**

```ts
// ❌ Regex on source: couples test to code structure, fails on refactor
expect(/<Title[^>]*>Marie Dupont<\/Title>/.test(source)).to.be.true;

// ❌ Testing implementation details
expect(/showDuplicateWarning/.test(source)).to.be.true;
expect(/importableEvents/.test(source)).to.be.true;

// ❌ Testing JSX structure rather than rendered output
expect(/<Avatar[^>]*initials="MD"[^>]*size="lg"/.test(source)).to.be.true;
```

### `@data` — broker-only

Already isolated correctly. See [data-layer-testing](./data-layer-testing.md). Don't touch the DOM here; use the test harness bridge (`window.__testData`).

### `@e2e` — full stack

Path-based routing: navigate via `window.history.pushState` + `popstate` dispatch (`src/modules/auth/steps/e2e/connexion.steps.ts`). Assert on actual DOM text after `appFrame.waitForFunction`. **Do not** re-verify here what `@ui` already covers — `@e2e` should fail when *collaboration* between layers breaks, not when an icon changes.

## Migration Consequences

The current `@ui` suite predates this contract. The migration plan:

1. **Rewrite source-grep assertions** → DOM queries via the helper. The `world.ts:hasText/hasField/hasElement` methods already prefer the rendered DOM and fall back to source — so unmigrated steps still work during the transition.
2. **Delete tests on implementation details** (`/showDuplicateWarning/`, `/importableEvents/`, regex on JSX). They protect nothing the user sees.
3. **Move behavioral assertions to `@e2e`** when not already covered ("clicking Suivant advances the wizard" — exercise it via Playwright if it's not redundant with existing journeys).
4. **Drop redundant `@e2e` content checks** that duplicate `@ui` (e.g. "screen contains 'Découvrir'" — let `@ui` own that).

`world.ts:screenFileMap`, `screenFieldDetectors`, `screenExpectedContent`, `screenRequiredFields` are vestiges of the source-analysis era. Once the migration is complete, they can be removed in favor of seed-data assertions on the rendered DOM.

## See Also

- [BDD Testing setup](./bdd-testing.md) — Cucumber config, file layout, scripts
- [Data Layer](./data-layer.md) — NextGraph shapes, seed data, contexts
- [Data-Layer Testing](./data-layer-testing.md) — broker harness, wallet setup, Playwright
- [Architecture](./architecture.md) — module structure
