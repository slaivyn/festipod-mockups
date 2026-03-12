# Automated Headless Wallet Creation for CI

**Date:** 2026-03-12 15:00
**Status:** Accepted

## Context

Data-layer BDD tests (`@data` scenarios) require a NextGraph wallet in a persistent Chromium profile. Previously, the first run required manual interaction: a visible browser opened and the user had to create a wallet and close the browser. This blocked CI execution.

## Options Considered

### Option A: Programmatic wallet creation via NG SDK
Call `ng.wallet_create()` directly from Node/Bun, bypassing the UI entirely.

**Arguments for:**
- Fastest execution
- No browser needed for wallet creation

**Arguments against:**
- `@ng-org/web` is browser-only (WASM + postMessage)
- Would need to reverse-engineer the registration API at `account.nextgraph.eu`
- Doesn't test the real auth flow

### Option B: Automate the browser UI flow headlessly
Use Playwright to drive the same wallet creation UI a real user would use, but in headless mode.

**Arguments for:**
- Tests the real auth/login feature end-to-end
- No API reverse-engineering needed
- Same persistent profile used for subsequent test runs
- CI-ready with no manual steps

**Arguments against:**
- Depends on `nextgraph.eu` and `account.nextgraph.eu` being reachable
- UI changes in NextGraph could break the automation
- Adds ~27s to first run

## Decision

Option B — automate the browser UI. The wallet creation flow (navigate to `nextgraph.eu` → "Create Wallet" → accept ToS at `account.nextgraph.eu` → fill username/password → submit) is itself a legitimate test of the app's auth feature. The dependency on external services is acceptable since the tests already depend on the broker being reachable.

## Consequences

**Positive:**
- Tests are fully CI-ready (no human interaction)
- Auth/login flow is tested as a side effect
- Single command `bun run test:data` works from a clean state

**Negative:**
- Requires internet access (nextgraph.eu, account.nextgraph.eu)
- Fragile to NextGraph UI changes (button text, form IDs)

**Risks:**
- `account.nextgraph.eu` rate limiting could block CI runs that frequently recreate wallets
