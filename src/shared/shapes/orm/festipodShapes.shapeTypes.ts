import type { ShapeType } from "@ng-org/shex-orm";
import { festipodShapesSchema } from "./festipodShapes.schema";
import type { FpEvent, FpUserProfile, FpParticipation } from "./festipodShapes.typings";

// ShapeTypes for festipodShapes
export const FpEventShapeType: ShapeType<FpEvent> = {
  schema: festipodShapesSchema,
  shape: "http://festipod.org/Event",
};
export const FpUserProfileShapeType: ShapeType<FpUserProfile> = {
  schema: festipodShapesSchema,
  shape: "http://festipod.org/UserProfile",
};
export const FpParticipationShapeType: ShapeType<FpParticipation> = {
  schema: festipodShapesSchema,
  shape: "http://festipod.org/Participation",
};
