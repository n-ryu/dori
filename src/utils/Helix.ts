import { Curve, Vector3 } from "three";

export class Helix extends Curve<Vector3> {
  constructor(
    private originalCurve: Curve<Vector3>,
    private radius: number,
    private numberOfRotations: number
  ) {
    super();
  }

  getPoint(t: number) {
    const point = this.originalCurve.getPoint(t);
    const [normal, binormal] = this.getNormals(t);

    const result = new Vector3().addVectors(
      point,
      new Vector3().addVectors(
        normal.multiplyScalar(
          this.radius * Math.cos(2 * Math.PI * t * this.numberOfRotations)
        ),
        binormal.multiplyScalar(
          this.radius * Math.sin(2 * Math.PI * t * this.numberOfRotations)
        )
      )
    );

    return result;
  }

  getNormals(t: number) {
    const tangent = this.originalCurve.getTangent(t);

    const delta = 0.0001;
    const t1 = t > delta ? t - delta : 0;
    const t2 = 1 - t > delta ? t + delta : 1;

    const tangent1 = this.originalCurve.getTangent(t1);
    const tangent2 = this.originalCurve.getTangent(t2);
    const rawNormal = new Vector3()
      .subVectors(tangent2, tangent1)
      .projectOnPlane(tangent)
      .normalize();

    /* TODO: when tangent1 and tangent2 is identical, rawNormal would return [0,0,0]. 
    For this case, it needs to return a fallback value. Currently, I set it to unit vector toward X axis, 
    but would be best if it can return an arbitrary unit vector perpendicular to tanget */
    const normal = rawNormal.length() === 0 ? new Vector3(1, 0, 0) : rawNormal;

    const binormal = new Vector3().crossVectors(normal, tangent);

    return [normal, binormal];
  }

  getRotation(t: number) {
    return 2 * Math.PI * t * this.numberOfRotations;
  }
}
