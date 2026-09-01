import { memo } from "react";
import { Line } from "@react-three/drei";
import { EDGE_TYPES } from "./userNetworkTheme";

function UserEdge({ start, end, type, isVisible }) {
  const def = EDGE_TYPES[type] || EDGE_TYPES.shared_ip;
  return <Line points={[start, end]} color={def.color} lineWidth={1.1} transparent opacity={isVisible ? 0.4 : 0.04} />;
}

export default memo(UserEdge);