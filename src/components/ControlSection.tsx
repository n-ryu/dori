import { useEffect, useState } from "react";
import "./ControlSection.css";
import dayjs from "dayjs";
import { useControls } from "leva";
import { datesControl } from "../controls/controls";

export const ControlSection = () => {
  const [now, setNow] = useState<Date>(new Date());

  const [{ today }, setDates, getDates] = useControls(...datesControl);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="wrapper">
      <div className="row">
        <label className="label">Current</label>
        <span>{dayjs(now).format("YYYY-MM-DD HH:mm:ss")}</span>
      </div>
      <div className="row">
        <label className="label">Look At</label>
        <span>{dayjs(today).format("YYYY-MM-DD HH:mm:ss")}</span>
      </div>
      <div className="row">
        <label className="label">Period</label>
        <div>
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
      </div>
    </div>
  );
};
