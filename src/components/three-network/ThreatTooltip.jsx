import { Html } from "@react-three/drei";
import { NODE_TYPES, THREAT_LEVELS } from "./threatNetworkTheme";

export default function ThreatTooltip({ node }) {
  if (!node) return null;
  const typeDef = NODE_TYPES[node.type];
  const levelColor = THREAT_LEVELS[node.threatLevel].color || "#33D69F";

  return (
    <Html position={node.position} center distanceFactor={10} style={{ pointerEvents: "none" }}>
      <div className="pointer-events-none w-max -translate-y-10 rounded-lg border border-white/10 bg-navy-900/95 px-3 py-2 shadow-glow backdrop-blur-md">
        <p className="font-display text-[12px] font-semibold text-navy-50">{node.name}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-navy-400">{typeDef.label}</span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider" style={{ color: levelColor }}>
            {node.threatLevel}
          </span>
        </div>
      </div>
    </Html>
  );
}