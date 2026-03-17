# Use private_store_id as useShape scope and @graph

**Date:** 2026-03-17 16:00
**Status:** Accepted

## Context

Clicking "Charger données de test" loaded data in-memory (via ORM signals) but produced `RepoNotFound` errors from `doc_create` and `orm_frontend_update`. Data disappeared after page reload because SPARQL writes never reached the broker. The NextGraph verifier's `self.repos` HashMap didn't contain the private store repo, so `resolve_target()` failed.

## Options Considered

### Option A: `did:ng:i` scope + `doc_create` for @graph
Use "entire user site" scope for reads, create a new document for writes.

**Arguments for:**
- `did:ng:i` is well-documented as a valid subscription scope
- `doc_create` returns a real document NURI

**Arguments against:**
- `did:ng:i` uses a special code path (`NuriTargetV0::UserSite`) that doesn't open individual repos
- `doc_create` calls `resolve_target(NuriTargetV0::PrivateStore)` which needs the repo in `self.repos` — fails if repo wasn't opened
- Requires complex retry logic / timing workarounds

### Option B: `private_store_id` as both scope AND @graph
Mirror the expense-tracker-rdf example: `useShape(type, `did:ng:${session.private_store_id}`)` and `@graph: `did:ng:${session.private_store_id}``.

**Arguments for:**
- Proven pattern: expense-tracker-rdf uses exactly this and works
- `orm_start_graph` with private store NURI opens the repo in the verifier's `self.repos` HashMap
- Subsequent writes via `orm_frontend_update` find the repo because it's now in the cache
- Simple, no retry logic needed

**Arguments against:**
- Slightly less flexible than `did:ng:i` (scoped to one store)
- Requires passing session to `useShapeWithDefaults`

### Option C: `did:ng:i` scope + reuse existing entity @graph
Subscribe with `did:ng:i`, then reuse `@graph` from any existing entity for writes.

**Arguments for:**
- Works for returning users who already have data

**Arguments against:**
- Fails for empty wallets (no existing entities to reuse)
- Still needs `doc_create` fallback which hits the same `RepoNotFound` issue

## Decision

**Option B**: Use `did:ng:${session.private_store_id}` as both `useShape` scope and `@graph` for writes. This matches the official expense-tracker-rdf example exactly.

The `useShapeWithDefaults` hook accepts a `storeNuri` parameter. `FestipodDataContext.useNgData()` gets the session from `useNextGraph()` and passes `did:ng:${session.private_store_id}`.

`ensureGraphNuri()` simplified: checks existing entities first (optimization), then falls back to `did:ng:${session.private_store_id}`.

## Consequences

**Positive:**
- Writes work immediately after connection (no retries needed)
- Data persists across page reloads
- Pattern matches official NextGraph examples
- All 7 e2e scenarios pass including data persistence

**Negative:**
- `useShapeWithDefaults` signature changed (added `storeNuri` parameter)

**Risks:**
- If NextGraph changes the private store behavior, this would break
