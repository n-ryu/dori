import { Vector3 } from "three";

export interface OrientedPoint {
  position: Vector3; // position on the curve
  tangent: Vector3; // direction the curve is heading to
  normal: Vector3; // perpendicular to the tangent, defining local orientation
}
