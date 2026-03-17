# Use SPARQL DELETE instead of ORM ngSet.delete() for object removal

**Date:** 2026-03-17 18:00
**Status:** Accepted

## Context

Leaving an event requires deleting the user's `Participation` object from the NextGraph store. The ORM's `DeepSignalSet.delete()` method updates the local reactive state (UI reflects the change immediately) but the deletion does not persist to the broker — after page refresh, the participation reappears.

## Options Considered

### Option A: ORM `ngSet.delete(item)`

The ORM README shows `dogs.delete(aDog)` as the intended API. Internally, `.delete()` generates a `{ op: "remove", path: "/<syntheticId>" }` patch, delivered via microtask to `OrmSubscription.onSignalObjectUpdate`, which calls `ng.graph_orm_update()`.

**Arguments for:**
- Official ORM API, shown in README examples
- Immediate local reactive update (instant UI feedback)

**Arguments against:**
- Does not persist in practice: `delete()` returns `true`, local set updates, but after refresh the object is back
- The `graph_orm_update` WASM call may not correctly handle "remove" patches for top-level set objects (possible engine bug)
- No error is thrown — fails silently

### Option B: `ng.sparql_update()` with SPARQL DELETE

Bypass the ORM patch mechanism entirely. Use `DELETE WHERE { GRAPH <graph> { <subject> ?p ?o } }` to remove all RDF triples for the object.

**Arguments for:**
- Works: deletion persists across page refresh
- The broker confirms via `TORMO became invalid` + `GraphOrmUpdate` remove, which reactively removes the item from the ORM set
- Direct control over RDF triple removal

**Arguments against:**
- Not instant: UI update waits for the SPARQL round-trip + broker `GraphOrmUpdate` callback (near-instant in practice, ~50ms)
- Must not combine with `ngSet.delete()` — running both causes CRDT conflicts where the item reappears

### Option C: `ngSet.delete()` + `ng.sparql_update()` together

Use `.delete()` for instant UI and SPARQL for persistence.

**Arguments for:**
- Instant UI feedback + guaranteed persistence

**Arguments against:**
- **Does not work**: the ORM `.delete()` patch and the SPARQL DELETE backend update conflict in the CRDT, resulting in neither UI change nor persistence

## Decision

**Option B: SPARQL DELETE only.** The broker sends back a `GraphOrmUpdate` with `op: "remove"` that reactively removes the item from the ORM set, so the UI still updates — just not synchronously.

Do NOT call `ngSet.delete()` alongside `sparql_update()` — they conflict.

## Implementation

```typescript
// In FestipodDataContext.tsx leaveEvent():
const session = await sessionPromise;
await ng.sparql_update(
  session.session_id,
  `DELETE WHERE { GRAPH <${partGraph}> { <${partId}> ?p ?o } }`,
  partGraph,
);
```

Imports: `ng` from `@ng-org/web`, `sessionPromise` from `../utils/ngSession`.

## Consequences

**Positive:**
- Deletion actually persists
- Single source of truth (broker → ORM → UI)

**Negative:**
- Slight UI delay (~50ms) vs instant for property mutations
- Pattern diverges from ORM README examples

**Risks:**
- If `ng.sparql_update` API changes, this breaks
- Other delete operations (if added) must follow the same pattern
- The ORM `ngSet.delete()` bug may be fixed in a future version — revisit when upgrading `@ng-org/orm`
