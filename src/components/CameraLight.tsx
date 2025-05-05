import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CameraLight() {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (!lightRef.current) return;

    lightRef.current.position.copy(camera.position);

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    lightRef.current.target.position.copy(camera.position.clone().add(dir));
    lightRef.current.target.updateMatrixWorld();
  });

  return (
    <>
      <directionalLight ref={lightRef} intensity={1} color="#FFFFFF" />
      <object3D name="light-target" />
    </>
  );
}
