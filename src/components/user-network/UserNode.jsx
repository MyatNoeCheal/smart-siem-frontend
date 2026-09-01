import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RISK_LEVELS } from "./userNetworkTheme";

function UserNode({ node, isSelected, isVisible, onHover, onSelect }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const phase = useRef(Math.random() * Math.PI * 2).current;
  const def = RISK_LEVELS[node.riskLevel] || RISK_LEVELS.low;
  const scale = 0.32 + Math.min(node.eventCount, 200) / 200 * 0.3;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (meshRef.current) {
      const pulseScale = def.pulse > 0 ? 1 + Math.sin(t * def.speed + phase) * def.pulse : 1;
      meshRef.current.scale.setScalar(scale * pulseScale);
      meshRef.current.material.opacity = isVisible ? 1 : 0.12;
    }
    if (glowRef.current && def.glow > 0) {
      glowRef.current.material.opacity = (isVisible ? def.glow : 0.02) * (0.5 + Math.sin(t * def.speed + phase) * 0.5);
    }
  });

  return (
    <group position={node.position}>
      {def.glow > 0 && (
        <mesh ref={glowRef} scale={scale * 2.1}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color={def.color} transparent opacity={def.glow} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}
      {isSelected && (
        <mesh scale={scale * 1.7}>
          <sphereGeometry args={[0.5, 20, 20]} />
          <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.55} />
        </mesh>
      )}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; onHover(node); }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = "default"; onHover(null); }}
        onClick={(e) => { e.stopPropagation(); onSelect(node); }}
      >
        <sphereGeometry args={[0.5, 20, 20]} />
        <meshStandardMaterial color={def.color} emissive={def.color} emissiveIntensity={0.5} transparent roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  );
}

export default memo(UserNode, (p, n) => p.node === n.node && p.isSelected === n.isSelected && p.isVisible === n.isVisible);