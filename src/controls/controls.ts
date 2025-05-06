export const globalControl = [
  "global",
  {
    background: "#eeeeee",
  },
] as const;

export const vertexControl = [
  "vertex",
  {
    numberOfVertices: 365 * 10 * 4,
  },
] as const;

export const shapeControl = [
  "shape",
  {
    radius: 2,
    length: 50,
  },
] as const;

export const ribbonControl = [
  "ribbon",
  {
    height: 0.1,
    thickness: 0.01,
    gap: 0.01,
    minVertices: 50,
  },
] as const;

export const datesControl = [
  "dates",
  () => ({
    today: new Date().getTime(),
    range: { value: 365, step: 1, title: "range(days)" },
    period: { value: 7, step: 1, title: "period(days)" },
  }),
] as const;
