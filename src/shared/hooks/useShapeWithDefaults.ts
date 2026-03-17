/**
 * useShapeWithDefaults — wrapper around NextGraph ORM's useShape.
 *
 * Subscribes to the private store via did:ng:<private_store_id> scope,
 * which opens the store repo in the verifier (required for writes).
 * Maps results to app types. If the NG set is empty, returns defaults.
 *
 * Must only be called when NG is connected (inside NgDataProvider).
 */

import { useShape } from '@ng-org/orm/react';
import type { ShapeType, BaseType } from '@ng-org/shex-orm';
import type { DeepSignalSet } from '@ng-org/alien-deepsignals';
export interface ShapeWithDefaults<NgT extends BaseType, AppT> {
  /** Mapped items from NG store */
  items: AppT[];
  /** Raw NG signal set for mutations */
  ngSet: DeepSignalSet<NgT>;
}

export function useShapeWithDefaults<NgT extends BaseType, AppT>(
  shapeType: ShapeType<NgT>,
  storeNuri: string | undefined,
  defaults: AppT[],
  mapFromNg: (item: NgT) => AppT,
  shapesReady: boolean,
): ShapeWithDefaults<NgT, AppT> {
  // Use private store NURI as scope (like expense-tracker-rdf).
  // This opens the store repo in the verifier, enabling writes.
  const ngSet = useShape(shapeType, storeNuri) as DeepSignalSet<NgT>;
  const usingDefaults = !shapesReady;
  const items = usingDefaults ? defaults : [...ngSet].map(mapFromNg);

  return { items, ngSet };
}
