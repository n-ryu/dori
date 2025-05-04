import { Canvas } from "@react-three/fiber";
import ICAL from "ical.js";
import { LineCurve3, Vector3 } from "three";
import { Line, TrackballControls } from "@react-three/drei";
import { useMemo } from "react";
import { Helix } from "../utils/Helix";
interface Props {
  events: ICAL.Event[];
}

export const Display = ({ events }: Props) => {
  const axis = useMemo(
    () => new LineCurve3(new Vector3(0, 0, 0), new Vector3(0, 0, 10)),
    []
  );

  const helix = useMemo(() => new Helix(axis, 2, 12), [axis]);

  const dHelix = useMemo(() => new Helix(helix, 0.1, 356), [helix]);

  return (
    <div style={{ width: 960, height: 560 }}>
      <Canvas>
        <Line
          color="#FF0000"
          lineWidth={1}
          points={new Array(10000)
            .fill(0)
            .map((_, i) => dHelix.getPoint(i / 10000))}
        />
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
        <color attach="background" args={["#EEEEFF"]} />
        <ambientLight intensity={0.1} color="#EEFFEE" />
        <directionalLight position={[0, 0, 5]} color="red" />
        <TrackballControls />
      </Canvas>
    </div>
  );
};
