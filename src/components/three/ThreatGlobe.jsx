import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";

const SEVERITY_COLOR = {
  critical: "#FB4B5D",
  high: "#F5A623",
  medium: "#F5D547",
  low: "#33D69F",
};

function pointOnSphere(radius) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  );
}

function GlobeCore() {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.06;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.7, 3]} />
        <meshBasicMaterial color="#5B8CFF" wireframe transparent opacity={0.14} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.68, 32, 32]} />
        <meshBasicMaterial color="#0B1220" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function ThreatNode({ position, severity, phase }) {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 2 + phase) * 0.35;
    meshRef.current.scale.setScalar(s);
  });
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.028, 8, 8]} />
      <meshBasicMaterial color={SEVERITY_COLOR[severity]} />
    </mesh>
  );
}

function AttackArc({ start, end, color }) {
  const mid = start
    .clone()
    .add(end)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(2.15);
  return (
    <QuadraticBezierLine
      start={start}
      end={end}
      mid={mid}
      color={color}
      lineWidth={0.7}
      transparent
      opacity={0.35}
    />
  );
}

export default function ThreatGlobe({ nodes = [] }) {
  const points = useMemo(
    () =>
      nodes.map((n, i) => ({
        ...n,
        position: pointOnSphere(1.7),
        phase: i * 0.6,
      })),
    [nodes]
  );

  const arcs = useMemo(() => {
    const result = [];
    for (let i = 0; i < Math.min(8, points.length - 1); i++) {
      const a = points[Math.floor(Math.random() * points.length)];
      const b = points[Math.floor(Math.random() * points.length)];
      if (a && b && a !== b) {
        result.push({ id: `${i}`, start: a.position, end: b.position, color: SEVERITY_COLOR[a.severity] });
      }
    }
    return result;
  }, [points]);

  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <Stars radius={30} depth={20} count={800} factor={1.4} saturation={0} fade speed={0.4} />
      <GlobeCore />
      {points.map((p) => (
        <ThreatNode key={p.id} position={p.position} severity={p.severity} phase={p.phase} />
      ))}
      {arcs.map((a) => (
        <AttackArc key={a.id} start={a.start} end={a.end} color={a.color} />
      ))}
    </Canvas>
  );
}