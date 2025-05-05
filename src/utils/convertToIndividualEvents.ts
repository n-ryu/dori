import ICAL from "ical.js";
import { IndividualEvent } from "../types/types";

export const convertToIndividualEvents = (
  events: ICAL.Event[],
  start: Date,
  end: Date
): IndividualEvent[] =>
  events.flatMap((event) => {
    if (!event.isRecurring())
      return {
        event,
        startDate: event.startDate,
        endDate: event.endDate,
      };

    const iterator = event.iterator();
    const arr = [];
    while (!iterator.complete) {
      const next = iterator.next();

      if (!next || next.toJSDate() >= end) break;
      if (next.toJSDate() < start) continue;

      const { item, startDate, endDate, recurrenceId } =
        event.getOccurrenceDetails(next);

      arr.push({
        event: item,
        startDate,
        endDate,
        recurrenceId,
      });
    }
    return arr;
  });
