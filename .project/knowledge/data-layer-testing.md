# Data-Layer Testing

BDD scenarios tagged `@data` test the real NextGraph data pipeline through a broker, not mocked data.

## Overview

`@data` scenarios run Cucumber steps against a real NextGraph broker. Playwright drives a Chromium instance that authenticates with the broker, which loads our test harness in an iframe. The harness uses real `useShape`/ORM subscriptions and exposes a `window.__testData` bridge for step definitions.

## Architecture

```
Cucumber steps → Playwright (Chromium, persistent profile)
                      ↓
               https://nextgraph.eu/auth/#/?o=http://127.0.0.1:{port}
                      ↓
               Broker wallet login (automated)
                      ↓
               Broker loads app in iframe → http://127.0.0.1:{port}
                      ↓
               harness-ng.tsx (init → useShape → ORM → broker)
                      ↓
               window.__testData bridge
```

## Dual Mode

- **Real broker** (default): `harness-ng.tsx` with NextGraph ORM through broker iframe
- **Mock fallback**: `harness.tsx` with standalone DeepSignalSets (if NG harness build fails)

## Wallet Lifecycle

Fully automated — no manual interaction required. CI-ready.

### First Run (wallet creation)
1. `BeforeAll` detects no `.wallet-ready` marker in `.playwright-profile/`
2. Launches headless Chromium with persistent profile
3. Navigates to `https://nextgraph.eu/` → clicks "Create Wallet"
4. Redirected to `account.nextgraph.eu` → clicks "I accept" (ToS)
5. Redirected back → fills username/password form → submits
6. Wallet created in localStorage → marker written
7. This is also a real test of the app's auth/login feature

### Subsequent Runs (automated login)
1. Marker found → skip wallet creation
2. Headless Chromium with persistent profile
3. Automated login: click "Login" → click wallet link → fill password → submit
4. Broker authenticates, loads app harness in iframe
5. Harness initializes NG, creates ORM subscriptions, seeds data if needed
6. `window.__testData.ready` → steps execute via `appFrame.evaluate()`

### Wallet Credentials
- Name: `festipod-tests`
- Password: `festipod-tests`

## Key Technical Details

### Chromium Flags
```
--disable-features=PrivateNetworkAccessRespectPreflightResults,BlockInsecurePrivateNetworkRequests,...
--allow-insecure-localhost
--disable-web-security
```
Required because broker at `nextgraph.eu` (public) loads harness from `http://127.0.0.1:{port}` (local) in an iframe — Chromium's Private Network Access blocks this by default.

### Persistent Profile (`.playwright-profile/`)
- Stores NG wallet in localStorage (`ng_wallets` on `nextgraph.eu`, `ng_bootstrap` on `nextgraph.net`)
- Gitignored
- Must use full Chrome binary, not `chrome-headless-shell`

### HTTP Server
- Started in `BeforeAll` on auto-assigned port (`127.0.0.1:0`)
- Serves harness HTML at `/` and JS bundle at `/harness.js` (separate files — inline script breaks due to special characters in bundle)
- Shut down in `AfterAll`

### ORM Subscriptions
Harness creates subscriptions for all three shapes with scope `did:ng:i` (private store):
- `FpEventShapeType` → events
- `FpUserProfileShapeType` → users
- `FpParticipationShapeType` → participations

### Test Bridge (`window.__testData`)
Exposed by the harness, consumed by steps via `appFrame.evaluate()`:
- `events`, `users`, `participations` — live DeepSignalSets
- `currentUserId` — IRI of the test user
- `getEvent(id)`, `getEventByTitle(title)` — lookups
- `joinEvent(eventId, userId)`, `leaveEvent(eventId, userId)` — mutations
- `isParticipating(eventId, userId)`, `getEventParticipants(eventId)` — queries
- `updateEvent(eventId, updates)` — field updates

## Files

| File | Purpose |
|------|---------|
| `src/shared/test-harness/harness-ng.tsx` | Real broker harness (useShape through broker iframe) |
| `src/shared/test-harness/harness.tsx` | Mock harness (DeepSignalSets, no broker) |
| `src/shared/support/hooks.ts` | Playwright lifecycle (wallet creation, login automation, iframe detection) |
| `src/shared/support/world.ts` | World with `page`/`appFrame` fields |
| `src/modules/event/steps/data/inscription.steps.ts` | Inscription data steps |
| `.playwright-profile/` | Persistent Chromium profile (gitignored) |
| `scripts/debug-browser.ts` | Manual browser debug tool — launches headed Chromium to inspect broker interactions |
| `.playwright-profile-debug/` | Chromium profile created by debug-browser.ts (gitignored) |

## Commands

```bash
bun run test:data      # Run @data scenarios (real broker if wallet exists, mock fallback)
bun run test:cucumber  # Run all scenarios (UI + data)
```

## See Also

- [BDD Testing](./bdd-testing.md) — general Cucumber setup, UI-layer steps
- [Data Layer](./data-layer.md) — NextGraph stack, shapes, context providers
