import { IndividualEvent } from "../types/types";

interface OffsettedEvent extends IndividualEvent {
  offset: number;
}

export const computeOffset = (events: IndividualEvent[]): OffsettedEvent[] => {
  let rest: IndividualEvent[] = [];
  let targetEvents: IndividualEvent[] = events.slice(0).sort((a, b) => {
    const startDiff =
      a.startDate.toJSDate().getTime() - b.startDate.toJSDate().getTime();

    if (startDiff !== 0) return startDiff;

    return -a.endDate.toJSDate().getTime() + b.endDate.toJSDate().getTime();
  });
  const result: OffsettedEvent[] = [];

  let offset = 0;
  let endDate: Date = new Date(0);
  while (result.length < events.length) {
    targetEvents.forEach((event) => {
      if (event.startDate.toJSDate() >= endDate) {
        result.push({ ...event, offset });
        endDate = event.endDate.toJSDate();
      } else {
        rest.push(event);
      }
    });
    endDate = new Date(0);
    targetEvents = [...rest];
    rest = [];
    offset++;
  }

  return result;
};
