import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const LEVEL_STYLE = {
  normal: { color: "#5B8CFF", opacity: 0.28, width: 1 },
  suspicious: { color: "#F5A623", opacity: 0.45, width: 1.4 },
  critical: { color: "#FB4B5D", opacity: 0, width: 0 }, // handled by AttackPath instead
};

function NetworkConnection({ start, end, threatLevel, animated }) {
  const particleRef = useRef();
  const speed = threatLevel === "suspicious" ? 0.35 : 0.18;
  const style = LEVEL_STYLE[threatLevel] || LEVEL_STYLE.normal;

  useFrame(({ clock }) => {
    if (!particleRef.current || !animated || threatLevel === "critical") return;
    const t = (clock.elapsedTime * speed) % 1;
    particleRef.current.position.lerpVectors(start, end, t);
    particleRef.current.material.opacity = Math.sin(t * Math.PI); // fade in/out along the path
  });

  if (threatLevel === "critical") return null; // AttackPath owns critical edges entirely

  return (
    <>
      <Line points={[start, end]} color={style.color} lineWidth={style.width} transparent opacity={style.opacity} />
      {animated && (
        <mesh ref={particleRef}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={style.color} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}

export default memo(NetworkConnection);