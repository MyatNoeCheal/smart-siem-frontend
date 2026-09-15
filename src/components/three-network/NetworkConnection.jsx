import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

const LEVEL_STYLE = {
  normal: { color: "#5B8CFF", opacity: 0.16, width: 0.8 },
  suspicious: { color: "#F5A623", opacity: 0.4, width: 1.3 },
  critical: { color: "#FB4B5D", opacity: 0, width: 0 },
};

function NetworkConnection({ start, end, threatLevel, animated }) {
  const particleRef = useRef();
  const { theme } = useTheme();
  const lightMode = theme === "light";
  const speed = threatLevel === "suspicious" ? 0.35 : 0.18;
  const style = LEVEL_STYLE[threatLevel] || LEVEL_STYLE.normal;
  const lineColor = lightMode && threatLevel === "normal" ? "#3B5DB8" : style.color;
  const lineOpacity = lightMode && threatLevel === "normal" ? 0.48 : lightMode ? 0.7 : style.opacity;

  useFrame(({ clock }) => {
    if (!particleRef.current || !animated || threatLevel === "critical") return;
    const t = (clock.elapsedTime * speed) % 1;
    particleRef.current.position.lerpVectors(start, end, t);
    particleRef.current.material.opacity = Math.sin(t * Math.PI); // fade in/out along the path
  });

  if (threatLevel === "critical") return null; // AttackPath owns critical edges entirely

  return (
    <>
      <Line points={[start, end]} color={lineColor} lineWidth={lightMode ? style.width + 0.35 : style.width} transparent opacity={lineOpacity} />
      {animated && (
        <mesh ref={particleRef}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={lineColor} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}

export default memo(NetworkConnection);