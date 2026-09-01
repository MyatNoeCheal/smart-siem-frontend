// Lightweight force-directed layout: repulsion between all nodes +
// spring attraction along edges, run for a fixed iteration count once
// when the graph is built (not per animation frame). Deliberately kept
// dependency-free -- no d3-force needed for <= ~50 nodes.
export function computeForceLayout(nodes, edges, { iterations = 180, radius = 6 } = {}) {
  const pos = {};
  nodes.forEach((n) => {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    pos[n.id] = {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi),
    };
  });

  const REPULSION = 3.2;
  const SPRING = 0.02;
  const IDEAL_LEN = 2.6;

  for (let iter = 0; iter < iterations; iter++) {
    const force = {};
    nodes.forEach((n) => (force[n.id] = { x: 0, y: 0, z: 0 }));

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i].id, b = nodes[j].id;
        const pa = pos[a], pb = pos[b];
        let dx = pa.x - pb.x, dy = pa.y - pb.y, dz = pa.z - pb.z;
        const distSq = dx * dx + dy * dy + dz * dz || 0.01;
        const dist = Math.sqrt(distSq);
        const f = REPULSION / distSq;
        dx /= dist; dy /= dist; dz /= dist;
        force[a].x += dx * f; force[a].y += dy * f; force[a].z += dz * f;
        force[b].x -= dx * f; force[b].y -= dy * f; force[b].z -= dz * f;
      }
    }

    edges.forEach((e) => {
      const pa = pos[e.source], pb = pos[e.target];
      if (!pa || !pb) return;
      let dx = pb.x - pa.x, dy = pb.y - pa.y, dz = pb.z - pa.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01;
      const diff = (dist - IDEAL_LEN) * SPRING;
      dx /= dist; dy /= dist; dz /= dist;
      force[e.source].x += dx * diff; force[e.source].y += dy * diff; force[e.source].z += dz * diff;
      force[e.target].x -= dx * diff; force[e.target].y -= dy * diff; force[e.target].z -= dz * diff;
    });

    nodes.forEach((n) => {
      const p = pos[n.id], f = force[n.id];
      p.x += f.x - p.x * 0.01;
      p.y += f.y - p.y * 0.01;
      p.z += f.z - p.z * 0.01;
    });
  }

  return pos;
}