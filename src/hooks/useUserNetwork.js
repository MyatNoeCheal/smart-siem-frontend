import { useCallback, useEffect, useMemo, useState } from "react";
import { getUserNetwork } from "../services/userNetworkService";

export function useUserNetwork() {
  const [state, setState] = useState({ nodes: [], edges: [], source: "mock", loading: true, error: null });
  const [riskFilter, setRiskFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const res = await getUserNetwork();
    setState({ ...res, loading: false });
  }, []);

  useEffect(() => { load(); }, [load]);

  const matchesFilter = useCallback(
    (node) => {
      if (riskFilter !== "all" && node.riskLevel !== riskFilter) return false;
      if (searchQuery.trim() && !node.id.toLowerCase().includes(searchQuery.trim().toLowerCase())) return false;
      return true;
    },
    [riskFilter, searchQuery]
  );

  const visibleNodeIds = useMemo(() => new Set(state.nodes.filter(matchesFilter).map((n) => n.id)), [state.nodes, matchesFilter]);

  return { ...state, riskFilter, setRiskFilter, searchQuery, setSearchQuery, visibleNodeIds, retry: load };
}