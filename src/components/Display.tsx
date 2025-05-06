import ICAL from "ical.js";
import { LineCurve3, Vector3 } from "three";
import { Line, TrackballControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Helix } from "../utils/Helix";
import { CameraLight } from "./CameraLight";
import { convertToIndividualEvents } from "../utils/convertToIndividualEvents";
import { computeOffset } from "../utils/computeOffset";
import { useControls } from "leva";
import dayjs from "dayjs";
import { uuidToColor } from "../utils/uuidToColor";
import { EventRibbon } from "./EventRibbon";
import { IndividualEvent } from "../types/types";
import {
  datesControl,
  globalControl,
  ribbonControl,
  shapeControl,
  vertexControl,
} from "../controls/controls";
import { useFrame } from "@react-three/fiber";
import { TodayIndicator } from "./TodayIndicator";

interface Props {
  events: ICAL.Event[];
  onSelect: (event?: IndividualEvent) => void;
}

export const Display = ({ events, onSelect }: Props) => {
  const global = useControls(...globalControl);

  const { numberOfVertices } = useControls(...vertexControl);

  const [shape] = useControls(...shapeControl);

  const ribbon = useControls(...ribbonControl);

  const [dates] = useControls(...datesControl);

  const [period, setPeriod] = useState<number>(dates.period);
  const [length, setLength] = useState<number>(shape.length);

  const lerpRef = useRef({ period: dates.period, length: shape.length });

  useFrame(() => {
    const newPeriod =
      (dates.period - lerpRef.current.period) * 0.1 + lerpRef.current.period;
    const newLength =
      (shape.length - lerpRef.current.length) * 0.1 + lerpRef.current.length;

    if (Math.abs(newPeriod - dates.period) < dates.period * 0.0001) {
      setPeriod(dates.period);
      setLength(shape.length);
      lerpRef.current = { period: dates.period, length: shape.length };
    } else {
      setPeriod(newPeriod);
      setLength(newLength);
      lerpRef.current = { period: newPeriod, length: newLength };
    }
  });

  const axis = useMemo(() => new Vector3(0, 0, 1), []);

  const [start, end] = useMemo(
    () => [
      dayjs(dates.today)
        .add(-dates.range / 2, "day")
        .toDate(),
      dayjs(dates.today)
        .add(dates.range / 2, "day")
        .toDate(),
    ],
    [dates]
  );

  const axisCurve = useMemo(
    () => new LineCurve3(new Vector3(), axis.clone().multiplyScalar(length)),
    [axis, length]
  );

  const helix = useMemo(
    () => new Helix(axisCurve, shape.radius, dates.range / period),
    [axisCurve, dates.range, period, shape.radius]
  );

  const individualEvents = useMemo(
    () =>
      computeOffset(
        convertToIndividualEvents(
          events.map((event) => {
            event.color = uuidToColor(event.uid);
            return event;
          }),
          start,
          end
        )
      ),
    [events, start, end]
  );

  const [hoveredEventId, setHoveredEventId] = useState<{
    uid: string;
    recurrenceId?: ICAL.Time;
  }>();

  useEffect(() => {
    onSelect(
      individualEvents.find(
        (event) =>
          event.event.uid === hoveredEventId?.uid &&
          event.recurrenceId === hoveredEventId?.recurrenceId
      )
    );
  }, [onSelect, individualEvents, hoveredEventId]);

  return (
    <>
      <Line
        color="#AAAAAA"
        lineWidth={1}
        fog
        points={new Array(numberOfVertices)
          .fill(0)
          .map((_, i) => helix.getPoint(i / numberOfVertices - 0.5))}
      />
      {individualEvents.map(
        ({ event, startDate, endDate, offset, recurrenceId }) => {
          const rangeMs = dates.range * 1000 * 60 * 60 * 24;
          const startMs =
            startDate.toJSDate().getTime() - (dates.today - rangeMs / 2);
          const endMs =
            endDate.toJSDate().getTime() - (dates.today - rangeMs / 2);
          return (
            <EventRibbon
              key={event.uid + recurrenceId}
              helix={helix}
              color={event.color}
              start={startMs}
              end={endMs}
              range={rangeMs}
              axis={axis}
              division={Math.max(
                Math.ceil((numberOfVertices * (startMs - endMs)) / rangeMs),
                ribbon.minVertices
              )}
              thickness={ribbon.thickness}
              height={ribbon.height}
              offsetH={-ribbon.height * (offset + 0.5) - offset * ribbon.gap}
              selected={event.uid === hoveredEventId?.uid}
              onPointerEnter={() => {
                setHoveredEventId({ uid: event.uid, recurrenceId });
              }}
              onPointerLeave={() => {
                setHoveredEventId(undefined);
              }}
            />
          );
        }
      )}
      <mesh
        position={[shape.radius + 0.21, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <coneGeometry args={[0.07, 0.2]} />
        <meshPhongMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={0.2}
        />
      </mesh>
      <TodayIndicator
        range={dates.range}
        today={dates.today}
        helix={helix}
        radius={shape.radius}
      />
      <color attach="background" args={[global.background]} />
      <ambientLight intensity={0.1} color="#FFFFFF" />
      <fog attach="fog" args={[global.background, 0, 20]} />
      <CameraLight />
      <TrackballControls noZoom />
    </>
  );
};
