import api from "./api";
import { withMockFallback } from "./withMockFallback";
import { transformGraphRisk } from "./transformers/graphRiskTransformer";
import { mockGraphRiskRaw } from "./mock/mockGraphRisk";

// GNN Graph Autoencoder entity-risk graph -- see gnn_inference.py /
// build_entity_graph.py on the backend. Complements threatService.js's
// /threats (per-event alerts) and entity_risk.py's UEBA panel (per-entity
// score over time): this one is "how unusual does this entity's position
// in the IP<->user relationship graph look right now".
export async function getGraphRisk(params = {}) {
  const { raw, source, error } = await withMockFallback(
    () => api.get("/entity-risk/graph", { params }).then((r) => r.data),
    mockGraphRiskRaw,
    "getGraphRisk"
  );
  return { data: transformGraphRisk(raw), source, error };
}