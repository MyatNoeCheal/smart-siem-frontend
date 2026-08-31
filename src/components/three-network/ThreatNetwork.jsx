import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import NetworkNode from "./NetworkNode";
import NetworkConnection from "./NetworkConnection";
import AttackPath from "./AttackPath";
import ThreatTooltip from "./ThreatTooltip";
import EntityDetailsPanel from "./EntityDetailsPanel";
import { LAYER_LABELS } from "./threatNetworkTheme";

// Subtle, non-flashy camera nudge fired once per `trigger` change --
// a quick decaying push-in/settle, not a shake. Used to punctuate the
// moment a threat is confirmed without disrupting the user's own
// orbit/zoom/pan state.
function CameraPulseEffect({ trigger }) {
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
    if (elapsed > duration) {
      activeSince.current = null;
      return;
    }
    const t = elapsed / duration;
    const intensity = 0.35 * Math.exp(-t * 4) * Math.sin(t * Math.PI * 3);
    camera.position.z = basePos.current.z - intensity;
    camera.position.y = basePos.current.y + intensity * 0.4;
  });

  return null;
}

export default function ThreatNetwork({
  nodes,
  edges,
  height = 480,
  nodeOverrides = {},
  attackEdgeIds = [],
  cameraPulse = 0,
}) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Merge simulation overrides onto the base topology without mutating it --
  // this is the only place a live/simulated threatLevel or riskScore
  // update needs to be applied before rendering.
  const mergedNodes = useMemo(
    () => nodes.map((n) => (nodeOverrides[n.id] ? { ...n, ...nodeOverrides[n.id] } : n)),
    [nodes, nodeOverrides]
  );

  const nodesById = useMemo(() => Object.fromEntries(mergedNodes.map((n) => [n.id, n])), [mergedNodes]);

  const resolvedEdges = useMemo(
    () =>
      edges
        .map((e) => {
          const source = nodesById[e.source];
          const target = nodesById[e.target];
          if (!source || !target) return null;
          return {
            ...e,
            isAttackPath: e.threatLevel === "critical" || attackEdgeIds.includes(e.id),
            start: new THREE.Vector3(...source.position),
            end: new THREE.Vector3(...target.position),
          };
        })
        .filter(Boolean),
    [edges, nodesById, attackEdgeIds]
  );

  const handleHover = useCallback((node) => setHoveredNode(node), []);
  const handleSelect = useCallback((node) => setSelectedNode((prev) => (prev?.id === node.id ? null : node)), []);

  return (
    <div className="relative w-full" style={{ height }}>
      <Canvas
        camera={{ position: [11, 6, 15], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.55} />
        <pointLight position={[10, 10, 10]} intensity={0.4} />
        <Stars radius={40} depth={25} count={500} factor={1.2} saturation={0} fade speed={0.3} />

        {LAYER_LABELS.map((l) => (
          <Text key={l.key} position={[-9.5, l.y, 0]} fontSize={0.32} color="#4C5A78" anchorX="left" anchorY="middle">
            {l.label}
          </Text>
        ))}

        {resolvedEdges.map((e) =>
          e.isAttackPath ? (
            <AttackPath key={e.id} start={e.start} end={e.end} />
          ) : (
            <NetworkConnection key={e.id} start={e.start} end={e.end} threatLevel={e.threatLevel} animated={e.animated} />
          )
        )}

        {mergedNodes.map((n) => (
          <NetworkNode
            key={n.id}
            node={n}
            isSelected={selectedNode?.id === n.id}
            onHover={handleHover}
            onSelect={handleSelect}
          />
        ))}

        <ThreatTooltip node={hoveredNode} />
        <CameraPulseEffect trigger={cameraPulse} />

        <OrbitControls enableDamping dampingFactor={0.08} minDistance={8} maxDistance={28} enablePan />
      </Canvas>

      <EntityDetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />

      <div className="pointer-events-none absolute bottom-3 left-3 flex gap-3 rounded-lg border border-white/10 bg-navy-900/80 px-3 py-2 backdrop-blur-md">
        <LegendDot color="#33D69F" label="Normal" />
        <LegendDot color="#F5A623" label="Suspicious" />
        <LegendDot color="#FB4B5D" label="Critical" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="font-mono text-[9px] uppercase tracking-wider text-navy-400">{label}</span>
    </div>
  );
}