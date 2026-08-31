import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NODE_TYPES, THREAT_LEVELS } from "./threatNetworkTheme";

function NodeGeometry({ shape }) {
  switch (shape) {
    case "icosahedron":
      return <icosahedronGeometry args={[0.42, 1]} />;
    case "box":
      return <boxGeometry args={[0.62, 0.62, 0.62]} />;
    case "octahedron":
      return <octahedronGeometry args={[0.46, 0]} />;
    case "cylinder":
      return <cylinderGeometry args={[0.4, 0.4, 0.6, 16]} />;
    default:
      return <sphereGeometry args={[0.36, 16, 16]} />;
  }
}

function NetworkNode({ node, isSelected, onHover, onSelect }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const glowRef = useRef();
  const phase = useRef(Math.random() * Math.PI * 2).current;

  const typeDef = NODE_TYPES[node.type];
  const threatDef = THREAT_LEVELS[node.threatLevel];
  const baseColor = threatDef.color || typeDef.color;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Subtle float — every node drifts a little so the network doesn't
    // feel static, independent of threat level.
    if (groupRef.current) {
      groupRef.current.position.y = node.position[1] + Math.sin(t * 0.6 + phase) * 0.12;
      groupRef.current.position.x = node.position[0] + Math.cos(t * 0.4 + phase) * 0.06;
    }

    // Pulse — calm for normal nodes, visible for suspicious, strong for critical.
    if (meshRef.current && threatDef.pulse > 0) {
      const s = 1 + Math.sin(t * threatDef.speed + phase) * threatDef.pulse;
      meshRef.current.scale.setScalar(s);
    }
    if (glowRef.current && threatDef.glow > 0) {
      const pulse = 0.5 + Math.sin(t * threatDef.speed + phase) * 0.5;
      glowRef.current.material.opacity = threatDef.glow * (0.5 + pulse * 0.7);
    }
  });

  return (
    <group ref={groupRef} position={node.position}>
      {threatDef.glow > 0 && (
        <mesh ref={glowRef} scale={1.9}>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshBasicMaterial
            color={baseColor}
            transparent
            opacity={threatDef.glow}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {isSelected && (
        <mesh scale={1.55}>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.55} />
        </mesh>
      )}

      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(node);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "default";
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
      >
        <NodeGeometry shape={typeDef.geometry} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={node.threatLevel === "normal" ? 0.25 : 0.6}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

// Nodes only need to re-render when their own selection state changes —
// hovering/selecting one node shouldn't re-render the other sixteen.
export default memo(NetworkNode, (prev, next) => prev.node === next.node && prev.isSelected === next.isSelected);