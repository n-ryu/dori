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

    const {
      normals: [normal],
      binormals: [binormal],
    } = this.originalCurve.computeFrenetFrames(t);

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
}
