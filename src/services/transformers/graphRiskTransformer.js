// Reshapes the backend's GNN graph-risk output (see gnn_inference.py's
// score_entity_graph()) into the {nodes, edges} shape ThreatNetwork.jsx /
// NetworkNode.jsx / NetworkConnection.jsx already expect -- the same 3D
// component used by Overview.jsx's scripted "Cyber Threat Network" demo,
// just fed real data here instead of threatNetworkMock.js's synthetic graph.
//
// TYPE MAPPING: NetworkNode.jsx looks up node.type in threatNetworkTheme.js's
// NODE_TYPES (internet/server/user/application/database) for its geometry +
// color. The GNN's graph only has two entity types (ip/user), so this is a
// purely cosmetic mapping onto the existing visual vocabulary -- ip -> the
// "server" geometry/layer, user -> the existing "user" geometry/layer. It
// does NOT imply these IPs are actually servers; it's just which shape they
// render as.
const TYPE_MAP = {
  ip: { nodeType: "server", layer: "server" },
  user: { nodeType: "user", layer: "user" },
};

const LAYER_Y = { server: 3.2, user: -1.5 };
const LAYER_ROTATION = { server: 0.4, user: 2.6 };

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function scatterOnDisc(count, radius, y, rotationOffset) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const angle = i * GOLDEN_ANGLE + rotationOffset;
    const r = radius * Math.sqrt((i + 0.6) / Math.max(count, 1));
    points.push([Math.cos(angle) * r, y, Math.sin(angle) * r]);
  }
  return points;
}

function threatLevelForScore(score, isAnomaly) {
  if (!isAnomaly || score == null) return "normal";
  if (score >= 85) return "critical";
  if (score >= 40) return "suspicious";
  return "normal";
}

export function transformGraphRisk(raw) {
  if (!raw?.available) {
    return {
      available: false,
      reason: raw?.reason || "Not enough entity graph data yet.",
      nodes: [],
      edges: [],
      graphSize: raw?.graph_size || null,
    };
  }

  const results = raw.results || [];
  const nodeMap = new Map();

  // Scored entities -- the ones the GNN actually ranked.
  results.forEach((r) => {
    const mapped = TYPE_MAP[r.entity_type] || TYPE_MAP.user;
    nodeMap.set(r.entity, {
      id: r.entity,
      name: r.entity_id,
      type: mapped.nodeType,
      layer: mapped.layer,
      threatLevel: threatLevelForScore(r.graph_anomaly_score, r.is_anomaly),
      riskScore: r.graph_anomaly_score,
      eventCount: r.degree,
      lastActivity: "live",
      isContextOnly: false,
    });
  });

  // Neighbours named for XAI context but not themselves in the top-N
  // scored set: added as lightweight nodes purely so their edge to a
  // flagged entity is visible -- NOT because the model separately
  // flagged them (isContextOnly marks the distinction).
  const edges = [];
  results.forEach((r) => {
    (r.top_neighbours || []).forEach((neighbourId, i) => {
      if (!nodeMap.has(neighbourId)) {
        const [entityType, ...rest] = neighbourId.split(":");
        const mapped = TYPE_MAP[entityType] || TYPE_MAP.user;
        nodeMap.set(neighbourId, {
          id: neighbourId,
          name: rest.join(":"),
          type: mapped.nodeType,
          layer: mapped.layer,
          threatLevel: "normal",
          riskScore: null,
          eventCount: null,
          lastActivity: "—",
          isContextOnly: true,
        });
      }
      edges.push({
        id: `${r.entity}__${neighbourId}__${i}`,
        source: r.entity,
        target: neighbourId,
        threatLevel: threatLevelForScore(r.graph_anomaly_score, r.is_anomaly),
        animated: true,
      });
    });
  });

  const nodesByLayer = {};
  nodeMap.forEach((n) => {
    (nodesByLayer[n.layer] = nodesByLayer[n.layer] || []).push(n);
  });

  const nodes = [];
  Object.entries(nodesByLayer).forEach(([layer, layerNodes]) => {
    const radius = Math.max(3, layerNodes.length * 0.9);
    const positions = scatterOnDisc(
      layerNodes.length, radius, LAYER_Y[layer] ?? 0, LAYER_ROTATION[layer] ?? 0
    );
    layerNodes.forEach((n, i) => nodes.push({ ...n, position: positions[i] }));
  });

  return {
    available: true,
    reason: null,
    graphSize: raw.graph_size,
    threshold: raw.threshold,
    nodes,
    edges,
  };
}