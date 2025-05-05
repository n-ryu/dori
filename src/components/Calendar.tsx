import { useQuery } from "@tanstack/react-query";
import { Display } from "./Display";
import ICAL from "ical.js";

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
    <>
      {data && (
        <div style={{ width: "100%", height: "100vh" }}>
          <Display events={data} />
        </div>
      )}
    </>
  );
};
