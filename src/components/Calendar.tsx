import { Display } from "./Display";
import ICAL from "ical.js";
import { Panel } from "./Panel";
import { useMemo, useState } from "react";
import { IndividualEvent } from "../types/types";

export const Calendar = () => {
  const [ics, setIcs] = useState<string>();
  const [selectedEvent, setSelectedEvent] = useState<IndividualEvent>();

  const events = useMemo(() => {
    if (!ics) return;

    const jcalData = ICAL.parse(ics);
    const comp = new ICAL.Component(jcalData);
    return comp
      .getAllSubcomponents("vevent")
      .map((rawEvent) => new ICAL.Event(rawEvent));
  }, [ics]);

  return (
    <div style={{ width: "100%" }}>
      <Panel selectedEvent={selectedEvent} onIcsChange={setIcs} />
      {events && (
        <div style={{ width: "100%", height: "100vh" }}>
          <Display events={events} onSelect={setSelectedEvent} />
        </div>
      )}
    </div>
  );
};
