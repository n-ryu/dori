import { Canvas } from "@react-three/fiber";
import ICAL from "ical.js";

interface Props {
  events: ICAL.Event[];
}

export const Display = ({ events }: Props) => {
  return <Canvas />;
};
