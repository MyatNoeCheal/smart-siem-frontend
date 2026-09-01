import { Html } from "@react-three/drei";
import { RISK_LEVELS } from "./userNetworkTheme";

export default function UserNetworkTooltip({ node }) {
  if (!node) return null;
  const color = RISK_LEVELS[node.riskLevel]?.color || "#33D69F";
  return (
    <Html position={node.position} center distanceFactor={9} style={{ pointerEvents: "none" }}>
      <div className="pointer-events-none w-max -translate-y-9 rounded-lg border border-white/10 bg-navy-900/95 px-3 py-2 shadow-glow backdrop-blur-md">
        <p className="font-display text-[12px] font-semibold text-navy-50">{node.id}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color }}>{node.riskLevel}</span>
          <span className="font-mono text-[10px] text-navy-500">{node.eventCount} events</span>
        </div>
      </div>
    </Html>
  );
}