import { Mesh, Vector3 } from "three";
import { Helix } from "../utils/Helix";
import { createRibbonGeometry } from "../utils/createRibbonGeometry";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface Props {
  helix: Helix;
  start: number;
  end: number;
  range: number;
  axis: Vector3;
  division: number;
  thickness: number;
  height: number;
  offsetT?: number;
  offsetH?: number;
  color: string;
}

export const EventRibbon = ({
  helix,
  start,
  end,
  range,
  axis,
  division,
  thickness,
  height,
  offsetH,
  color,
}: Props) => {
  const t1 = start / range;
  const dt = (end - start) / range;
  const geometry = useMemo(() => {
    return createRibbonGeometry({
      helix,
      t1: 0,
      t2: dt,
      axis,
      division,
      thickness,
      height,
      offsetH,
    });
  }, [helix, dt, axis, division, thickness, height, offsetH]);

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
    <mesh ref={ref} geometry={geometry}>
      <meshPhongMaterial flatShading color={color} />
    </mesh>
  );
};
