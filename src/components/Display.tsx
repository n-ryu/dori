import ICAL from "ical.js";
import { LineCurve3, Vector3 } from "three";
import { Line, TrackballControls } from "@react-three/drei";
import { useMemo } from "react";
import { Helix } from "../utils/Helix";
import { CameraLight } from "./CameraLight";
import { createRibbonGeometry } from "../utils/createRibbonGeometry";
import { convertToIndividualEvents } from "../utils/convertToIndividualEvents";

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

  const individualEvents = useMemo(
    () => convertToIndividualEvents(events, start, end),
    [events, start, end]
  );

  const eventGeometries = useMemo(
    () =>
      individualEvents.map((event) => {
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
          Math.ceil(NUMBER_OF_VERTICES * (eventEnd - eventStart)),
          5
        );

        const geometry = createRibbonGeometry({
          helix,
          t1: eventStart,
          t2: eventEnd,
          axis: AXIS,
          division: NUMBER,
          thickness: THICKNESS,
          height: WIDTH,
          offsetH: -WIDTH / 2,
        });

        return { event, geometry };
      }),
    [individualEvents, helix, start, end]
  );

  return (
    <>
      <Line
        color="#AAAAAA"
        lineWidth={1}
        points={new Array(NUMBER_OF_VERTICES)
          .fill(0)
          .map((_, i) => helix.getPoint(i / NUMBER_OF_VERTICES))}
      />
      {eventGeometries.map(({ geometry, event }, i) => (
        // TODO: 더 적절한 key 찾기. ex. uid + startDate
        <mesh key={i} geometry={geometry}>
          <meshPhongMaterial
            color={event.isRecurring() ? "blue" : "red"}
            flatShading
          />
        </mesh>
      ))}
      <color attach="background" args={["#EEEEEE"]} />
      <ambientLight intensity={0.1} color="#FFFFFF" />
      <CameraLight />
      <TrackballControls />
    </>
  );
};
