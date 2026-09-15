import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

const SEVERITY_COLOR = {
  critical: "#FB4B5D",
  high: "#F5A623",
  medium: "#F5D547",
  low: "#33D69F",
};

function pointOnSphere(radius, seed) {
  const rand = (n) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const theta = rand(seed) * Math.PI * 2;
  const phi = Math.acos(2 * rand(seed + 0.5) - 1);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  );
}

function GlobeCore({ agitated, lightMode }) {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * (agitated ? 0.16 : 0.06);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.7, 3]} />
        <meshBasicMaterial
          color={agitated ? "#F5A623" : lightMode ? "#254E8A" : "#7CC7FF"}
          wireframe
          transparent
          opacity={lightMode ? 1 : agitated ? 0.75 : 0.6}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.68, 32, 32]} />
        <meshBasicMaterial
          color={lightMode ? "#EDF5F8" : "#0B1220"}
          transparent
          opacity={lightMode ? 0.25 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function ThreatNode({ position, severity, phase, intense }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const color = SEVERITY_COLOR[severity];

  useFrame(({ clock }) => {
    const speed = intense ? 5.5 : 2;
    const amp = intense ? 0.85 : 0.35;
    const s = 1 + Math.sin(clock.elapsedTime * speed + phase) * amp;
    if (meshRef.current) meshRef.current.scale.setScalar(s);
    if (glowRef.current) {
      const pulse = 0.5 + Math.sin(clock.elapsedTime * speed + phase) * 0.5;
      glowRef.current.material.opacity = (intense ? 0.55 : 0) * (0.5 + pulse * 0.7);
      glowRef.current.scale.setScalar(intense ? 3.2 + pulse * 1.2 : 1);
    }
  });

  return (
    <group position={position}>
      {intense && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}
      <mesh ref={meshRef}>
        <sphereGeometry args={[intense ? 0.045 : 0.028, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// Particles streaming continuously along the attack arc -- the visual
// language for "active traffic," matching AttackPath.jsx's pattern in
// the layered Cyber Threat Network below, so both visualizations read
// as the same kind of event.
function ArcTraffic({ curve, color, count = 4, speed = 0.55 }) {
  const refs = useRef([]);
  useFrame(({ clock }) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const offset = i / count;
      const t = (clock.elapsedTime * speed + offset) % 1;
      const p = curve.getPointAt(t);
      mesh.position.copy(p);
      mesh.material.opacity = Math.sin(t * Math.PI) * 0.95;
    });
  });
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function AttackArc({ start, end, color, intense, lightMode }) {
  const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.15);
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(start, mid, end), [start, mid, end]);

  return (
    <group>
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={mid}
        color={lightMode ? (intense ? color : "#1F3C66") : color}
        lineWidth={intense ? 3.2 : 1.9}
        transparent
        opacity={intense ? 1 : lightMode ? 1 : 0.9}
      />
      {intense && (
        <QuadraticBezierLine
          start={start}
          end={end}
          mid={mid}
          color={color}
          lineWidth={8}
          transparent
          opacity={lightMode ? 0.45 : 0.32}
        />
      )}
      {intense && <ArcTraffic curve={curve} color={color} />}
    </group>
  );
}

// One-time expanding ring "shockwave" fired at the target node the
// instant a threat is confirmed -- a clear, unmissable punctuation
// mark distinct from the continuous pulsing everything else does.
function Shockwave({ position, trigger, color }) {
  const ringRef = useRef();
  const startTime = useRef(null);
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    if (trigger !== prevTrigger.current) {
      prevTrigger.current = trigger;
      startTime.current = performance.now();
    }
  }, [trigger]);

  useFrame(() => {
    if (startTime.current == null || !ringRef.current) return;
    const elapsed = (performance.now() - startTime.current) / 1000;
    const duration = 1.4;
    if (elapsed > duration) {
      ringRef.current.visible = false;
      startTime.current = null;
      return;
    }
    ringRef.current.visible = true;
    const t = elapsed / duration;
    const scale = 0.1 + t * 2.2;
    ringRef.current.scale.setScalar(scale);
    ringRef.current.material.opacity = (1 - t) * 0.8;
  });

  return (
    <mesh ref={ringRef} position={position} visible={false}>
      <ringGeometry args={[0.9, 1, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function CameraPulseEffect({ trigger, intensity = 0.25 }) {
  const { camera } = useThree();
  const prevTrigger = useRef(trigger);
  const activeSince = useRef(null);
  const basePos = useRef(null);

  useEffect(() => {
    if (trigger !== prevTrigger.current) {
      prevTrigger.current = trigger;
      activeSince.current = performance.now();
      basePos.current = camera.position.clone();
    }
  }, [trigger, camera]);

  useFrame(() => {
    if (activeSince.current == null || !basePos.current) return;
    const elapsed = (performance.now() - activeSince.current) / 1000;
    const duration = 1.1;
    if (elapsed > duration) { activeSince.current = null; return; }
    const t = elapsed / duration;
    const amt = intensity * Math.exp(-t * 4) * Math.sin(t * Math.PI * 3);
    camera.position.z = basePos.current.z - amt;
  });

  return null;
}

export default function ThreatGlobe({ nodes = [], sim = null }) {
  const { theme } = useTheme();
  const lightMode = theme === "light";
  const points = useMemo(
    () => nodes.map((n, i) => ({ ...n, position: pointOnSphere(1.7, i + 1), phase: i * 0.6 })),
    [nodes]
  );

  const simActive = sim?.isRunning || sim?.isDetected;
  const originIdx = 0;
  const targetIdx = Math.min(1, points.length - 1);

  const decorativeArcs = useMemo(() => {
    const result = [];
    for (let i = 0; i < Math.min(8, points.length - 1); i++) {
      const a = points[Math.floor(Math.random() * points.length)];
      const b = points[Math.floor(Math.random() * points.length)];
      if (a && b && a !== b) {
        result.push({ id: `d${i}`, start: a.position, end: b.position, color: SEVERITY_COLOR[a.severity] });
      }
    }
    return result;
  }, [points]);

  return (
    <Canvas camera={{ position: [0, 0, 4.6], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <Stars radius={30} depth={20} count={800} factor={1.4} saturation={0} fade speed={simActive ? 1 : 0.4} color={lightMode ? "#6EA082" : "#FFFFFF"} />
      <GlobeCore agitated={simActive} lightMode={lightMode} />

      {points.map((p, i) => {
        const isOrigin = simActive && i === originIdx;
        const isTarget = simActive && i === targetIdx;
        const severity = isTarget && sim?.isDetected ? "critical" : isOrigin || isTarget ? "high" : p.severity;
        return (
          <ThreatNode key={p.id ?? i} position={p.position} severity={severity} phase={p.phase} intense={isOrigin || isTarget} />
        );
      })}

      {decorativeArcs.map((a) => (
        <AttackArc key={a.id} start={a.start} end={a.end} color={a.color} intense={false} lightMode={lightMode} />
      ))}

      {simActive && points[targetIdx] && (
        <>
          <AttackArc
            start={points[originIdx].position}
            end={points[targetIdx].position}
            color={sim?.isDetected ? "#FB4B5D" : "#F5A623"}
            intense
            lightMode={lightMode}
          />
          <Shockwave
            position={points[targetIdx].position}
            trigger={sim?.isDetected ? (sim?.cameraPulse ?? 1) : 0}
            color="#FB4B5D"
          />
        </>
      )}

      <CameraPulseEffect trigger={sim?.cameraPulse ?? 0} intensity={sim?.isDetected ? 0.4 : 0.15} />
    </Canvas>
  );
}