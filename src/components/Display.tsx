import { Canvas } from "@react-three/fiber";
import ICAL from "ical.js";
import {
  BufferGeometry,
  Float32BufferAttribute,
  LineCurve3,
  Vector3,
} from "three";
import { Line, TrackballControls } from "@react-three/drei";
import { useMemo } from "react";
import { Helix } from "../utils/Helix";

const NUMBER_OF_VERTICES = 365 * 10;
const AXIS = new Vector3(0, 0, 1);
const WIDTH = 0.1;
const THICKNESS = 0.01;
const normalize = (target: number, upper: number, lower: number) =>
  (target - lower) / (upper - lower);

interface Props {
  events: ICAL.Event[];
  start?: Date;
  end?: Date;
  period?: number | "month" | "week";
}

export const Display = ({
  events,
  start = new Date("2025-01-01"),
  end = new Date("2026-01-01"),
  period = "week",
}: Props) => {
  const periodInDate = useMemo(
    () => (period === "week" ? 7 : period === "month" ? 30 : period),
    [period]
  );
  const rangeInDate = useMemo(
    () => (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    [start, end]
  );

  const axis = useMemo(
    () =>
      new LineCurve3(
        AXIS.clone().multiplyScalar(100),
        AXIS.clone().multiplyScalar(-100)
      ),
    []
  );

  const helix = useMemo(
    () => new Helix(axis, 2, rangeInDate / periodInDate),
    [axis, rangeInDate, periodInDate]
  );

  const eventGeometries = useMemo(
    () =>
      events.map((event) => {
        const eventStart = normalize(
          event.startDate.toJSDate().getTime(),
          start.getTime(),
          end.getTime()
        );
        const eventEnd = normalize(
          event.endDate.toJSDate().getTime(),
          start.getTime(),
          end.getTime()
        );
        const NUMBER = Math.max(
          NUMBER_OF_VERTICES * (eventEnd - eventStart),
          10
        );

        const positions: number[] = new Array(NUMBER)
          .fill(0)
          .flatMap((_, i) => {
            const t = ((eventStart - eventEnd) * i) / NUMBER + eventEnd;
            const point = helix.getPoint(t);
            const tangent = helix.getTangent(t);
            const normal = AXIS.clone();
            const binormal = new Vector3()
              .crossVectors(normal, tangent)
              .normalize();

            const corner1 = new Vector3()
              .addVectors(point, normal.clone().multiplyScalar(WIDTH / 2))
              .add(binormal.clone().multiplyScalar(THICKNESS / 2));
            const corner2 = new Vector3()
              .addVectors(point, normal.clone().multiplyScalar(-WIDTH / 2))
              .add(binormal.clone().multiplyScalar(THICKNESS / 2));
            const corner3 = new Vector3()
              .addVectors(point, normal.clone().multiplyScalar(-WIDTH / 2))
              .add(binormal.clone().multiplyScalar(-THICKNESS / 2));
            const corner4 = new Vector3()
              .addVectors(point, normal.clone().multiplyScalar(WIDTH / 2))
              .add(binormal.clone().multiplyScalar(-THICKNESS / 2));

            return [
              ...corner1.toArray(),
              ...corner2.toArray(),
              ...corner3.toArray(),
              ...corner4.toArray(),
            ];
          });
        const sideIndices: number[] = new Array(NUMBER)
          .fill(0)
          .flatMap((_, i) => {
            if (i < NUMBER - 1) {
              const base = i * 4;
              return [
                [base, base + 4, base + 5],
                [base, base + 5, base + 1],
                [base + 1, base + 5, base + 6],
                [base + 1, base + 6, base + 2],
                [base + 2, base + 6, base + 7],
                [base + 2, base + 7, base + 3],
                [base + 3, base + 7, base + 4],
                [base + 3, base + 4, base],
              ].flat();
            } else return [];
          });

        const last = NUMBER * 4 - 4;
        const indices = [0, 1, 2, 0, 2, 3]
          .concat(sideIndices)
          .concat([last, last + 2, last + 1, last, last + 3, last + 2]);

        const geometry = new BufferGeometry();
        geometry.setAttribute(
          "position",
          new Float32BufferAttribute(positions, 3)
        );
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry;
      }),
    [events, helix, start, end]
  );

  return (
    <div style={{ width: 960, height: 560 }}>
      <Canvas>
        <Line
          color="#AAAAAA"
          lineWidth={1}
          points={new Array(NUMBER_OF_VERTICES)
            .fill(0)
            .map((_, i) => helix.getPoint(i / NUMBER_OF_VERTICES))}
        />
        {eventGeometries.map((geometry) => (
          <mesh geometry={geometry}>
            <meshPhongMaterial color="FFFFFF" />
          </mesh>
        ))}
        <color attach="background" args={["#EEEEEE"]} />
        <ambientLight intensity={0.1} color="#EEFFEE" />
        <directionalLight position={[1, 1, 1]} color="red" />
        <TrackballControls />
      </Canvas>
    </div>
  );
};
