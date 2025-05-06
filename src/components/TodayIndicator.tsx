import { Mesh } from "three";
import { Helix } from "../utils/Helix";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

interface Props {
  helix: Helix;
  range: number;
  today: number;
  radius: number;
}

export const TodayIndicator = ({ helix, today, range, radius }: Props) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  });
  const t1 = (now.getTime() - today) / (range * 1000 * 60 * 60 * 24);

  const ref = useRef<Mesh>(null);
  const tRef = useRef<number>(t1);

  useEffect(() => {
    if (!ref.current) return;

    ref.current?.position.set(0, 0, helix.getPoint(tRef.current).z);
    ref.current?.rotation.set(0, 0, -helix.getRotation(tRef.current));
  }, [helix]);

  useFrame(() => {
    tRef.current = (t1 - tRef.current) * 0.05 + tRef.current;
    ref.current?.position.set(0, 0, helix.getPoint(tRef.current).z);
    ref.current?.rotation.set(0, 0, -helix.getRotation(tRef.current));
  });

  return (
    <group ref={ref} position={[0, 0, 0]}>
      <mesh position={[radius + 0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.07, 0.19]} />
        <meshPhongMaterial color="#00ff00" />
      </mesh>
    </group>
  );
};
