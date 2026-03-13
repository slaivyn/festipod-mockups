# Conditional NextGraph Init Based on Broker Iframe Detection

**Date:** 2026-03-13 14:00
**Status:** Accepted

## Context

`@ng-org/web`'s `initNgWeb()` checks `window.self === window.top`. When the app runs standalone (not in an iframe), it redirects the entire page to `nextgraph.net/redir/` to trigger broker authentication. This caused the app to redirect on every load — even during development or when the user hadn't clicked "Se connecter".

## Options Considered

### Option A: Always auto-init NG on mount
**Arguments for:**
- Simpler code — no branching logic

**Arguments against:**
- Causes immediate redirect to broker when loaded standalone
- Breaks development workflow
- User sees broker login page instead of the app

### Option B: Conditional auto-init based on iframe detection
**Arguments for:**
- When in iframe, the broker has already authenticated — safe to auto-init
- When standalone, user must explicitly click "Se connecter" to trigger the redirect
- Preserves standalone demo/development experience
- Matches `@ng-org/web`'s own detection logic

**Arguments against:**
- Relies on `window.self !== window.top` heuristic (could theoretically be wrong if embedded in non-broker iframe)

## Decision

Option B. `NextGraphContext` checks `const isInsideBroker = typeof window !== 'undefined' && window.self !== window.top` at module level. `useEffect` only auto-calls `initNg()` when `isInsideBroker` is true. The `connect()` callback remains available for explicit user-initiated connection.

Additionally, `FestipodDataContext` now renders empty data (not seed data) during the `connecting` phase to avoid flashing demo content before the wallet loads.

## Consequences

**Positive:**
- App loads without redirecting — works standalone for development and demo
- In broker iframe, connection is seamless and automatic
- No seed data flash during wallet connection

**Negative:**
- None significant

**Risks:**
- If `@ng-org/web` changes its detection logic, our guard may diverge — keep them aligned
