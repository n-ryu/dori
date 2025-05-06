import { Display } from "./Display";
import ICAL from "ical.js";
import { Panel } from "./Panel";
import { useCallback, useMemo, useState, WheelEvent } from "react";
import { IndividualEvent } from "../types/types";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { datesControl } from "../controls/controls";

export const Calendar = () => {
  const [ics, setIcs] = useState<string>();
  const [selectedEvent, setSelectedEvent] = useState<IndividualEvent>();
  const [_, setDates, getDates] = useControls(...datesControl);

  const events = useMemo(() => {
    if (!ics) return;

    const jcalData = ICAL.parse(ics);
    const comp = new ICAL.Component(jcalData);
    return comp
      .getAllSubcomponents("vevent")
      .map((rawEvent) => new ICAL.Event(rawEvent));
  }, [ics]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      setDates({ today: getDates("today") + e.deltaY * 1000 * 60 });
    },
    [setDates, getDates]
  );

  return (
    <div style={{ width: "100%" }}>
      <Panel selectedEvent={selectedEvent} onIcsChange={setIcs} />
      {events && (
        <div style={{ width: "100%", height: "100vh" }}>
          <Canvas onWheel={handleWheel}>
            <Display events={events} onSelect={setSelectedEvent} />
          </Canvas>
        </div>
      )}
    </div>
  );
};
