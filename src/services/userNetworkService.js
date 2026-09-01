import { getUserBehavior } from "./userService";
import { computeForceLayout } from "../utils/forceLayout";
import { mockUsers, mockEdges } from "../data/mockUserNetwork";

const MAX_NODES = 40;
const MAX_EDGES = 120;
const SEVERITY_ORDER = { low: 0, medium: 1, high: 2, critical: 3 };

export async function getUserNetwork() {
  const res = await getUserBehavior({ limit: 300 });

  let baseNodes, baseEdges, source, error;

  if (res.source === "live" && res.data.items.length) {
    const byUser = {};
    res.data.items.forEach((ev) => {
      if (!ev.userId || ev.userId === "—") return;
      if (!byUser[ev.userId]) byUser[ev.userId] = { userId: ev.userId, eventCount: 0, maxSeverity: "low", ips: new Set() };
      const u = byUser[ev.userId];
      u.eventCount += 1;
      if (SEVERITY_ORDER[ev.severity] > SEVERITY_ORDER[u.maxSeverity]) u.maxSeverity = ev.severity;
      if (ev.ip && ev.ip !== "—") u.ips.add(ev.ip);
    });

    const users = Object.values(byUser)
      .sort((a, b) => SEVERITY_ORDER[b.maxSeverity] - SEVERITY_ORDER[a.maxSeverity] || b.eventCount - a.eventCount)
      .slice(0, MAX_NODES);

    baseNodes = users.map((u) => ({ id: u.userId, riskLevel: u.maxSeverity, eventCount: u.eventCount }));

    baseEdges = [];
    outer: for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const shared = [...users[i].ips].some((ip) => users[j].ips.has(ip));
        if (shared) {
          baseEdges.push({ id: `e-${i}-${j}`, source: users[i].userId, target: users[j].userId, type: "shared_ip" });
          if (baseEdges.length >= MAX_EDGES) break outer;
        }
      }
    }

    source = "live";
    error = res.error;
  } else {
    baseNodes = mockUsers.map((u) => ({ id: u.id, riskLevel: u.riskLevel, eventCount: u.eventCount }));
    baseEdges = mockEdges;
    source = "mock";
    error = res.error;
  }

  const positions = computeForceLayout(baseNodes, baseEdges);
  const nodes = baseNodes.map((n) => ({ ...n, position: [positions[n.id].x, positions[n.id].y, positions[n.id].z] }));

  return { nodes, edges: baseEdges, source, error };
}