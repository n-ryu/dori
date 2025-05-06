import ICAL from "ical.js";
import { LineCurve3, Vector3 } from "three";
import { Line, TrackballControls } from "@react-three/drei";
import { useCallback, useMemo, useState, WheelEvent } from "react";
import { Helix } from "../utils/Helix";
import { CameraLight } from "./CameraLight";
import { convertToIndividualEvents } from "../utils/convertToIndividualEvents";
import { computeOffset } from "../utils/computeOffset";
import { useControls } from "leva";
import dayjs from "dayjs";
import { uuidToColor } from "../utils/uuidToColor";
import { Canvas } from "@react-three/fiber";
import { EventRibbon } from "./EventRibbon";

interface Props {
  events: ICAL.Event[];
}

export const Display = ({ events }: Props) => {
  const global = useControls("global", {
    background: "#eeeeee",
  });

  const { numberOfVertices } = useControls("vertex", {
    numberOfVertices: 365 * 10,
  });

  const shape = useControls("shape", {
    radius: 2,
    length: 50,
    axis: { value: [0, 0, 1], editable: false }, // TODO: axis 에 상대적이어야 하는 값들이 매직 넘버처럼 사용되는 곳들이 있음.
  });

  const ribbon = useControls("ribbon", {
    height: 0.1,
    thickness: 0.01,
    gap: 0.01,
    minVertices: 10,
  });

  const [dates, setDates, getDates] = useControls("date", () => ({
    today: new Date().getTime(),
    range: { value: 365, step: 1, title: "range(days)" },
    period: { value: 7, step: 1, title: "period(days)" },
  }));

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

  const axis = useMemo(
    () =>
      new LineCurve3(
        new Vector3(),
        new Vector3(...shape.axis).clone().multiplyScalar(shape.length)
      ),
    [shape]
  );

  const helix = useMemo(
    () => new Helix(axis, shape.radius, dates.range / dates.period),
    [axis, dates.range, dates.period, shape.radius]
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

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      setDates({ today: getDates("today") + e.deltaY * 1000 * 60 });
    },
    [setDates, getDates]
  );

  const [hoveredEventId, setHoveredEventId] = useState<{
    uid: string;
    recurrenceId?: ICAL.Time;
  }>();
  const hoveredEvent = useMemo(
    () =>
      individualEvents.find(
        ({ event, recurrenceId }) =>
          event.uid === hoveredEventId?.uid &&
          recurrenceId === hoveredEventId?.recurrenceId
      ),
    [individualEvents, hoveredEventId]
  );

  const memoAxis = useMemo(() => new Vector3(...shape.axis), [shape.axis]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          zIndex: 100,
          background: "#ffffffbb",
          borderRadius: 5,
          padding: 10,
          top: 20,
          left: 20,
          boxShadow: "0 0 9px 0 #00000088",
          fontFamily: "Arial",
          fontSize: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: 150,
          opacity: hoveredEvent ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        {hoveredEvent && (
          <>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              {hoveredEvent.event.summary}
            </div>
            <div>{`${hoveredEvent.startDate.toString()} - \n${hoveredEvent.endDate.toString()}`}</div>
            <div>{hoveredEvent.event.description}</div>
            <div>{hoveredEvent.event.uid}</div>
          </>
        )}
      </div>
      <Canvas onWheel={handleWheel}>
        <group position={[0, 0, -shape.length / 2]}>
          <Line
            color="#AAAAAA"
            lineWidth={1}
            fog
            points={new Array(numberOfVertices)
              .fill(0)
              .map((_, i) => helix.getPoint(i / numberOfVertices))}
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
                  axis={memoAxis}
                  division={Math.max(
                    Math.ceil((numberOfVertices * (startMs - endMs)) / rangeMs),
                    ribbon.minVertices
                  )}
                  thickness={ribbon.thickness}
                  height={ribbon.height}
                  offsetH={
                    -ribbon.height * (offset + 0.5) - offset * ribbon.gap
                  }
                />
              );
            }
          )}
        </group>
        <color attach="background" args={[global.background]} />
        <ambientLight intensity={0.1} color="#FFFFFF" />
        <fog
          attach="fog"
          args={[global.background, 0, shape.length / 2 / Math.SQRT2]}
        />
        <CameraLight />
        <TrackballControls noZoom />
      </Canvas>
    </>
  );
};
