import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const COLOR = "#FB4B5D";
const PARTICLE_COUNT = 3;

export default function AttackPath({ start, end }) {
  const particleRefs = useRef([]);

  const curve = useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const lift = new THREE.Vector3(0, 0.9, 0); // arch the path so it visually separates from the flat layer connections
    mid.add(lift);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(40), [curve]);

  useFrame(({ clock }) => {
    particleRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const offset = i / PARTICLE_COUNT;
      const t = (clock.elapsedTime * 0.5 + offset) % 1;
      const p = curve.getPointAt(t);
      mesh.position.copy(p);
    });
  });

  return (
    <group>
      <Line points={points} color={COLOR} lineWidth={2} transparent opacity={0.55} />
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <mesh key={i} ref={(el) => (particleRefs.current[i] = el)}>
          <sphereGeometry args={[0.075, 10, 10]} />
          <meshBasicMaterial color={COLOR} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}