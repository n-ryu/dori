import ICAL from "ical.js";

export interface IndividualEvent {
  event: ICAL.Event;
  startDate: ICAL.Time;
  endDate: ICAL.Time;
  recurrenceId?: ICAL.Time;
}
