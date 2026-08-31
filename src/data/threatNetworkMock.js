// ============================================================
// MOCK DATA — shape mirrors what a real /entity-risk + /threats
// response could be reduced to. Swap generateThreatNetworkMock()
// for a hook that fetches real nodes/edges from FastAPI once
// those endpoints exist; every consumer downstream only needs
// { nodes, edges } in this shape.
// ============================================================

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function scatterOnDisc(count, radius, y) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const angle = i * GOLDEN_ANGLE;
    const r = radius * Math.sqrt((i + 0.6) / count);
    points.push([Math.cos(angle) * r, y, Math.sin(angle) * r]);
  }
  return points;
}

const LAYER_DEFS = [
  { key: "internet", y: 7, radius: 1.2 },
  { key: "server", y: 3.5, radius: 4.6 },
  { key: "user", y: 0, radius: 6.2 },
  { key: "application", y: -3.5, radius: 4.6 },
  { key: "database", y: -7, radius: 2.4 },
];

const RAW_NODES = [
  { id: "net-gw", name: "Internet Gateway", type: "internet", layer: "internet", threatLevel: "normal" },

  { id: "srv-web1", name: "Web Server 01", type: "server", layer: "server", threatLevel: "normal" },
  { id: "srv-web2", name: "Web Server 02", type: "server", layer: "server", threatLevel: "normal" },
  { id: "srv-api", name: "API Gateway", type: "server", layer: "server", threatLevel: "normal" },
  { id: "srv-cache", name: "Cache Server", type: "server", layer: "server", threatLevel: "suspicious" },

  { id: "usr-1", name: "customer_2291", type: "user", layer: "user", threatLevel: "normal" },
  { id: "usr-2", name: "customer_5583", type: "user", layer: "user", threatLevel: "normal" },
  { id: "usr-3", name: "customer_1042", type: "user", layer: "user", threatLevel: "normal" },
  { id: "usr-4", name: "admin_jkim", type: "user", layer: "user", threatLevel: "critical" },
  { id: "usr-5", name: "customer_7710", type: "user", layer: "user", threatLevel: "normal" },
  { id: "usr-6", name: "customer_3399", type: "user", layer: "user", threatLevel: "suspicious" },

  { id: "app-checkout", name: "Checkout Service", type: "application", layer: "application", threatLevel: "normal" },
  { id: "app-catalog", name: "Product Catalog", type: "application", layer: "application", threatLevel: "normal" },
  { id: "app-auth", name: "Auth Service", type: "application", layer: "application", threatLevel: "normal" },
  { id: "app-payments", name: "Payments Service", type: "application", layer: "application", threatLevel: "normal" },

  { id: "db-orders", name: "Orders DB", type: "database", layer: "database", threatLevel: "normal" },
  { id: "db-users", name: "Users DB", type: "database", layer: "database", threatLevel: "critical" },
];

const RAW_EDGES = [
  { source: "net-gw", target: "srv-web1", threatLevel: "normal" },
  { source: "net-gw", target: "srv-web2", threatLevel: "normal" },
  { source: "net-gw", target: "srv-api", threatLevel: "normal" },
  { source: "net-gw", target: "srv-cache", threatLevel: "suspicious" },

  { source: "srv-web1", target: "usr-1", threatLevel: "normal" },
  { source: "srv-web1", target: "usr-2", threatLevel: "normal" },
  { source: "srv-web2", target: "usr-3", threatLevel: "normal" },
  { source: "srv-web2", target: "usr-5", threatLevel: "normal" },
  { source: "srv-api", target: "usr-4", threatLevel: "normal" },
  { source: "srv-cache", target: "usr-6", threatLevel: "suspicious" },

  { source: "usr-1", target: "app-catalog", threatLevel: "normal" },
  { source: "usr-2", target: "app-checkout", threatLevel: "normal" },
  { source: "usr-3", target: "app-catalog", threatLevel: "normal" },
  { source: "usr-4", target: "app-auth", threatLevel: "normal" },
  { source: "usr-5", target: "app-checkout", threatLevel: "normal" },
  { source: "usr-6", target: "app-payments", threatLevel: "suspicious" },

  { source: "app-checkout", target: "db-orders", threatLevel: "normal" },
  { source: "app-catalog", target: "db-orders", threatLevel: "normal" },
  { source: "app-auth", target: "db-users", threatLevel: "normal" },
  { source: "app-payments", target: "db-orders", threatLevel: "suspicious" },

  // The standout attack path: a compromised admin account reaching the
  // Users DB directly, bypassing the application layer entirely.
  { source: "usr-4", target: "db-users", threatLevel: "critical" },
];

function riskProfile(threatLevel) {
  if (threatLevel === "critical") return { riskScore: 88 + Math.round(Math.random() * 10), eventCount: 340 + Math.round(Math.random() * 200) };
  if (threatLevel === "suspicious") return { riskScore: 48 + Math.round(Math.random() * 18), eventCount: 60 + Math.round(Math.random() * 90) };
  return { riskScore: 4 + Math.round(Math.random() * 14), eventCount: 5 + Math.round(Math.random() * 40) };
}

function randomRecentTimestamp(threatLevel) {
  const minutesAgo = threatLevel === "critical" ? Math.round(Math.random() * 6) : Math.round(Math.random() * 180);
  return `${minutesAgo}m ago`;
}

export function generateThreatNetworkMock() {
  const countsByLayer = RAW_NODES.reduce((acc, n) => {
    acc[n.layer] = (acc[n.layer] || 0) + 1;
    return acc;
  }, {});

  const cursors = {};
  const nodes = RAW_NODES.map((n) => {
    const layerDef = LAYER_DEFS.find((l) => l.key === n.layer);
    const positions = scatterOnDisc(countsByLayer[n.layer], layerDef.radius, layerDef.y);
    const idx = cursors[n.layer] || 0;
    cursors[n.layer] = idx + 1;
    return {
      ...n,
      position: positions[idx],
      ...riskProfile(n.threatLevel),
      lastActivity: randomRecentTimestamp(n.threatLevel),
    };
  });

  return { nodes, edges: RAW_EDGES.map((e, i) => ({ id: `edge-${i}`, animated: true, ...e })) };
}