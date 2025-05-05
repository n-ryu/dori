import ICAL from "ical.js";

export const convertToIndividualEvents = (
  events: ICAL.Event[],
  start: Date,
  end: Date
) =>
  events.flatMap((event) => {
    if (!event.isRecurring())
      return {
        item: event,
        startDate: event.startDate,
        endDate: event.endDate,
      };

    const interator = event.iterator(ICAL.Time.fromJSDate(start));
    const arr = [];
    while (!interator.complete) {
      // TODO: ICAL.Event 타입과 ICAL.RecurExpansion 에 대해 더 잘 이해할 필요가 있어보임.
      const next = interator.next();
      if (!next || next.toJSDate() > end) break;
      arr.push(event.getOccurrenceDetails(next));
    }
    return arr;
  });
