import { useMemo, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import UserNode from "./UserNode";
import UserEdge from "./UserEdge";
import UserNetworkTooltip from "./UserNetworkTooltip";

export default function UserNetworkScene({ nodes, edges, visibleNodeIds, onSelectUser, selectedUserId, height = 460 }) {
  const [hovered, setHovered] = useState(null);
  const nodesById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const resolvedEdges = useMemo(
    () =>
      edges
        .map((e) => {
          const s = nodesById[e.source], t = nodesById[e.target];
          if (!s || !t) return null;
          return { ...e, start: new THREE.Vector3(...s.position), end: new THREE.Vector3(...t.position), visible: visibleNodeIds.has(s.id) && visibleNodeIds.has(t.id) };
        })
        .filter(Boolean),
    [edges, nodesById, visibleNodeIds]
  );

  const handleSelect = useCallback((node) => onSelectUser((prev) => (prev === node.id ? null : node.id)), [onSelectUser]);

  return (
    <div className="relative w-full" style={{ height }}>
      <Canvas camera={{ position: [10, 5, 13], fov: 48 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.55} />
        <pointLight position={[8, 8, 8]} intensity={0.4} />
        <Stars radius={40} depth={25} count={400} factor={1.1} saturation={0} fade speed={0.25} />

        {resolvedEdges.map((e) => <UserEdge key={e.id} start={e.start} end={e.end} type={e.type} isVisible={e.visible} />)}
        {nodes.map((n) => (
          <UserNode
            key={n.id}
            node={n}
            isSelected={selectedUserId === n.id}
            isVisible={visibleNodeIds.has(n.id)}
            onHover={setHovered}
            onSelect={handleSelect}
          />
        ))}
        <UserNetworkTooltip node={hovered} />
        <OrbitControls enableDamping dampingFactor={0.08} minDistance={6} maxDistance={26} enablePan />
      </Canvas>
    </div>
  );
}