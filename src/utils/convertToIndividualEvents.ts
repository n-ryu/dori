import ICAL from "ical.js";
import { IndividualEvent } from "../types/types";
import dayjs from "dayjs";

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

    const iterator = event.iterator(
      ICAL.Time.fromJSDate(dayjs(start).startOf("day").toDate())
    );
    const arr = [];
    while (!iterator.complete) {
      const next = iterator.next();

      if (!next || next.toJSDate() >= end) break;

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
