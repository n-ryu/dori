import { useQuery } from "@tanstack/react-query";
import { Display } from "./Display";
import ICAL from "ical.js";
import { Canvas } from "@react-three/fiber";

export const Calendar = () => {
  const { data } = useQuery({
    queryKey: ["ics"],
    queryFn: async () => {
      const response = await fetch("/mock_calendar_data.ics");

      const icalData = await response.text();
      const jcalData = ICAL.parse(icalData);
      const comp = new ICAL.Component(jcalData);
      const subComps = comp
        .getAllSubcomponents("vevent")
        .map((rawEvent) => new ICAL.Event(rawEvent));

      return subComps;
    },
  });

  return (
    <div>
      {data && (
        <div style={{ width: 960, height: 560 }}>
          <Canvas>
            <Display events={data} />
          </Canvas>
        </div>
      )}
      {data?.map((event) => (
        <div key={event.uid}>
          {event.summary}
          {event.startDate.toJSDate().toDateString()}
        </div>
      ))}
    </div>
  );
};
