import { useEffect, useState } from "react";
import "./ControlSection.css";
import dayjs from "dayjs";
import { Leva, useControls } from "leva";
import { datesControl } from "../controls/controls";
import { Toggle } from "./Toggle";

export const ControlSection = () => {
  const [now, setNow] = useState<Date>(new Date());
  const [showLeva, setShowLeva] = useState<boolean>(false);

  const [{ today }, setDates] = useControls(...datesControl);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="wrapper">
      <label className="label">Current</label>
      <span>{dayjs(now).format("YYYY-MM-DD HH:mm:ss")}</span>
      <label className="label">Look At</label>
      <span>{dayjs(today).format("YYYY-MM-DD HH:mm:ss")}</span>
      <label className="label">Period</label>
      <div className="buttons">
        <button className="period" onClick={() => setDates({ period: 365 })}>
          Year
        </button>
        <button className="period" onClick={() => setDates({ period: 30 })}>
          Month
        </button>
        <button className="period" onClick={() => setDates({ period: 7 })}>
          Week
        </button>
        <button className="period" onClick={() => setDates({ period: 1 })}>
          Day
        </button>
      </div>
      <label className="label">Advanced</label>
      <Toggle value={showLeva} onChange={setShowLeva} />
      <Leva hidden={!showLeva} />
    </div>
  );
};
