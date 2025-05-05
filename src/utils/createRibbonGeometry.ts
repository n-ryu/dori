import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";
import { Helix } from "./Helix";

interface Params {
  helix: Helix;
  t1: number;
  t2: number;
  axis: Vector3;
  division: number;
  thickness: number;
  height: number;
  offsetT?: number;
  offsetH?: number;
}

export const createRibbonGeometry = ({
  helix,
  t1,
  t2,
  axis,
  division,
  thickness,
  height,
  offsetT = 0,
  offsetH = 0,
}: Params) => {
  const positions: number[] = new Array(division).fill(0).flatMap((_, i) => {
    const t = ((t2 - t1) * i) / (division - 1) + t1;
    const point = helix.getPoint(t);
    const tangent = helix.getTangent(t);
    const normal = axis.clone();
    const binormal = new Vector3().crossVectors(normal, tangent).normalize();

    const corner1 = new Vector3()
      .addVectors(point, normal.clone().multiplyScalar(height / 2 + offsetH))
      .add(binormal.clone().multiplyScalar(thickness / 2 + offsetT));
    const corner2 = new Vector3()
      .addVectors(point, normal.clone().multiplyScalar(-height / 2 + offsetH))
      .add(binormal.clone().multiplyScalar(thickness / 2 + offsetT));
    const corner3 = new Vector3()
      .addVectors(point, normal.clone().multiplyScalar(-height / 2 + offsetH))
      .add(binormal.clone().multiplyScalar(-thickness / 2 + offsetT));
    const corner4 = new Vector3()
      .addVectors(point, normal.clone().multiplyScalar(height / 2 + offsetH))
      .add(binormal.clone().multiplyScalar(-thickness / 2 + offsetT));

    return [
      ...corner1.toArray(),
      ...corner2.toArray(),
      ...corner3.toArray(),
      ...corner4.toArray(),
    ];
  });
  const sideIndices: number[] = new Array(division).fill(0).flatMap((_, i) => {
    if (i < division - 1) {
      const base = i * 4;
      return [
        [base, base + 5, base + 4],
        [base, base + 1, base + 5],
        [base + 1, base + 6, base + 5],
        [base + 1, base + 2, base + 6],
        [base + 2, base + 7, base + 6],
        [base + 2, base + 3, base + 7],
        [base + 3, base + 4, base + 7],
        [base + 3, base, base + 4],
      ].flat();
    } else return [];
  });

  const last = division * 4 - 4;
  const indices = [0, 2, 1, 0, 3, 2]
    .concat(sideIndices)
    .concat([last, last + 1, last + 2, last, last + 2, last + 3]);

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  // TODO: index 로 포인트를 공유하다보니 shade smoothing 효과가 나타남. 정점 공유를 하지 않고 별개로 생성하면 문제 해결 가능.
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
};
