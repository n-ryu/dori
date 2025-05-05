import { useQuery } from "@tanstack/react-query";
import { Display } from "./Display";
import ICAL from "ical.js";
import { useControls } from "leva";

export const Calendar = () => {
  const { icsUrl } = useControls("url", {
    icsUrl: { value: "/mock.ics" },
  });

  const { data } = useQuery({
    queryKey: ["ics"],
    queryFn: async () => {
      const response = await fetch(
        icsUrl.startsWith("https")
          ? `https://corsproxy.io/?url=${encodeURIComponent(icsUrl)}` // TODO: not safe
          : icsUrl
      );

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
