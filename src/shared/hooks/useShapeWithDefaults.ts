/**
 * useShapeWithDefaults — wrapper around NextGraph ORM's useShape.
 *
 * Calls useShape with scope="" (whole dataset) and maps results to app types.
 * If the NG set is empty (not yet loaded or truly empty),
 * it returns the provided defaults.
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
  defaults: AppT[],
  mapFromNg: (item: NgT) => AppT,
  shapesReady: boolean,
): ShapeWithDefaults<NgT, AppT> {
  // scope="did:ng:i" means whole dataset
  const ngSet = useShape(shapeType, "did:ng:i") as DeepSignalSet<NgT>;
  // Before shapes are ready, always show defaults (static display)
  // After ready, show NG data even if empty (means user deleted everything)
  const usingDefaults = !shapesReady;
  const items = usingDefaults ? defaults : [...ngSet].map(mapFromNg);

  console.log(`[useShapeWithDefaults] ${(shapeType as any).shape ?? 'unknown'}: ngSet.size=${ngSet.size}, shapesReady=${shapesReady}, using=${usingDefaults ? 'DEFAULTS' : 'NG data'}`);

  return { items, ngSet };
}
