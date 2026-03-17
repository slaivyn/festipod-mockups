/**
 * NextGraph graph NURI management.
 *
 * Returns the private store NURI as @graph for ORM entity creation.
 * This matches the expense-tracker-rdf approach: useShape with
 * private_store_id scope opens the repo, and writes target the same NURI.
 */

import { sessionPromise } from './ngSession';

let cachedGraphNuri: string | undefined;

/**
 * Get the graph NURI for adding ORM entities.
 * Uses the private store NURI (same as expense-tracker-rdf).
 */
export async function ensureGraphNuri(
  ...sets: Iterable<{ readonly "@graph": string }>[]
): Promise<string> {
  if (cachedGraphNuri) return cachedGraphNuri;

  // Reuse @graph from any existing entity if available
  for (const set of sets) {
    for (const item of set) {
      if (item["@graph"]) {
        cachedGraphNuri = item["@graph"];
        console.log('[ngGraph] Reusing existing graph NURI:', cachedGraphNuri);
        return cachedGraphNuri;
      }
    }
  }

  // Use private store NURI (the repo is opened by useShape with this scope)
  const session = await sessionPromise;
  cachedGraphNuri = `did:ng:${session.private_store_id}`;
  console.log('[ngGraph] Using private store as graph:', cachedGraphNuri);
  return cachedGraphNuri;
}
