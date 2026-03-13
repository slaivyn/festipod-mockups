# Data Layer

NextGraph-backed local-first data with fallback to local state for demo/disconnected mode.

## Overview

The app has two data modes:
1. **Connected** — NextGraph ORM shapes (P2P, encrypted, local-first)
2. **Disconnected/Demo** — Local React state seeded from `seedData.ts`

All screens use `useFestipodData()` hook regardless of mode.

## NextGraph Stack

```
@ng-org/web          # Browser WASM runtime
@ng-org/orm          # RDF shape-based ORM
@ng-org/shex-orm     # SHEX → TypeScript code generation
@ng-org/alien-deepsignals  # Reactive signals bridge
```

Packages installed from local tarballs in `.ng-tarballs/`.

## SHEX Shapes

`src/shared/shapes/shex/festipodShapes.shex` defines:
- **Event** — title, description, dates, location, themes, participants
- **UserProfile** — name, username, bio, city, visibility
- **Participation** — links event + user, confirmation status

ORM bindings in `src/shared/shapes/orm/`:
- `festipodShapes.schema.ts` — Schema registration
- `festipodShapes.shapeTypes.ts` — Shape type constants
- `festipodShapes.typings.ts` — TypeScript interfaces

Regenerate with `bun run build:orm`.

## Context Providers

### NextGraphContext (`src/shared/context/NextGraphContext.tsx`)
- Connection lifecycle: `disconnected` → `connecting` → `connected` | `error`
- Provides session with store IDs (private, protected, public)
- **Conditional auto-init**: Only auto-calls `initNg()` when running inside the broker iframe (`window.self !== window.top`). Outside the iframe, `initNgWeb()` would redirect the page to the broker — so connection waits for explicit `connect()` call.
- `connect()`: Called by user clicking "Se connecter". When outside broker, triggers the redirect flow.

#### `@ng-org/web` redirect behavior
`initNgWeb()` checks `window.self === window.top`. If the app is NOT in an iframe, it redirects to `nextgraph.net/redir/` with the current URL encoded as a return parameter. The broker then loads the app back in an iframe after auth. This means the app must NOT auto-init NG when loaded standalone.

### FestipodDataContext (`src/shared/context/FestipodDataContext.tsx`)
- Wraps NextGraph shapes with `useShapeWithDefaults()` hook
- CRUD: `createEvent()`, `updateEvent()`, `joinEvent()`, `leaveEvent()`, etc.
- Exposes `useFestipodData()` hook consumed by all screens
- `selectedEventId` state for cross-screen event navigation
- `loadTestData()`: Calls `bootstrapWallet()` to seed test data into NG wallet — only triggered by explicit user action
- **Provider states based on NG status**:
  - `disconnected` → `LocalDataProvider` with seed data (demo mode)
  - `connecting` → `LocalDataProvider` with **empty data** (avoids flashing seed data before wallet loads)
  - `connected` → `NgDataProvider` with real wallet data
  - `error` → `LocalDataProvider` with seed data (graceful fallback)

## Data Types

`src/shared/data/types.ts`:
- `FpEventData` — id, title, date, location, distance, themes, etc.
- `FpUserData` — id, name, username, bio, city, counts
- `FpParticipationData` — eventId + userId + confirmed
- `FpMeetingPointData` — eventId, location, time, host (local-only)
- `FpFriendshipData` — userId + friendId (local-only)

## Seed Data

`src/shared/data/seedData.ts`:
- 10 users (Marie Dupont = current user, `user-1`)
- Multiple events with dates, locations, themes
- Participations, meeting points, friendships
- `CURRENT_USER_ID = 'user-1'`
