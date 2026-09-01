import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { THREAT_LEVELS } from "../three-network/threatNetworkTheme";

const CHAIN = ["User", "Email", "Application", "Server", "Database"];
const SPACING = 3.2;

// stageLevel: how far the attack is judged to have reached (see
// severityToChainDepth). Nodes at/behind that depth read as "compromised",
// the node right at the edge reads as "active", everything ahead is calm.
function levelForIndex(index, depth, investigationStatus) {
  if (investigationStatus === "resolved" || investigationStatus === "false_positive") return "normal";
  if (index + 1 < depth) return "critical";
  if (index + 1 === depth) return "suspicious";
  return "normal";
}

function ChainNode({ position, label, level, onSelect, isSelected }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const threatDef = THREAT_LEVELS[level];
  const color = threatDef.color || "#5B8CFF";

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (meshRef.current && threatDef.pulse > 0) {
      meshRef.current.scale.setScalar(1 + Math.sin(t * threatDef.speed) * threatDef.pulse);
    }
    if (glowRef.current && threatDef.glow > 0) {
      glowRef.current.material.opacity = threatDef.glow * (0.6 + Math.sin(t * threatDef.speed) * 0.4);
    }
  });

  return (
    <group position={position}>
      {threatDef.glow > 0 && (
        <mesh ref={glowRef} scale={1.8}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={threatDef.glow} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}
      {isSelected && (
        <mesh scale={1.5}>
          <sphereGeometry args={[0.5, 20, 20]} />
          <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.5} />
        </mesh>
      )}
      <mesh
        ref={meshRef}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
        onClick={() => onSelect(label)}
      >
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={level === "normal" ? 0.25 : 0.65} roughness={0.4} metalness={0.2} />
      </mesh>
      <Text position={[1.1, 0, 0]} fontSize={0.32} color="#8B96AC" anchorX="left" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

function FlowParticle({ start, end, active }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const t = (clock.elapsedTime * 0.35) % 1;
    ref.current.position.lerpVectors(start, end, t);
    ref.current.material.opacity = Math.sin(t * Math.PI);
  });
  if (!active) return null;
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshBasicMaterial color="#FB4B5D" transparent blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

export default function AttackPathScene({ depth, investigationStatus, onSelectNode, selectedNode, height = 420 }) {
  const positions = useMemo(
    () => CHAIN.map((_, i) => new THREE.Vector3(0, (CHAIN.length - 1 - i) * (SPACING / 1.6) - (CHAIN.length - 1) * (SPACING / 3.2), 0)),
    []
  );

  return (
    <div style={{ height }} className="w-full">
      <Canvas camera={{ position: [5, 1.5, 6], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 6, 6]} intensity={0.4} />

        {positions.slice(0, -1).map((p, i) => {
          const segmentActive = investigationStatus !== "resolved" && investigationStatus !== "false_positive" && i + 1 <= depth;
          const color = segmentActive ? "#FB4B5D" : "#4C5A78";
          return (
            <group key={i}>
              <Line points={[p, positions[i + 1]]} color={color} lineWidth={segmentActive ? 2 : 1} transparent opacity={segmentActive ? 0.6 : 0.25} />
              <FlowParticle start={p} end={positions[i + 1]} active={segmentActive} />
            </group>
          );
        })}

        {CHAIN.map((label, i) => (
          <ChainNode
            key={label}
            position={positions[i]}
            label={label}
            level={levelForIndex(i, depth, investigationStatus)}
            onSelect={onSelectNode}
            isSelected={selectedNode === label}
          />
        ))}

        <OrbitControls enableDamping dampingFactor={0.08} minDistance={4} maxDistance={14} enablePan={false} />
      </Canvas>
    </div>
  );
}