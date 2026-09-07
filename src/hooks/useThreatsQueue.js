import { useCallback, useEffect, useMemo, useState } from "react";
import { getThreats } from "../services/threatService";
import api from "../services/api";

const SEVERITY_ORDER = { critical: 3, high: 2, medium: 1, low: 0 };

export function useThreatsQueue() {
  const [state, setState] = useState({ items: [], source: "mock", loading: true, error: null });
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("open");
  const [groupIncidents, setGroupIncidents] = useState(true);
  const [sortBy, setSortBy] = useState("priority"); // "priority" | "recency" | "severity"
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const params = { limit: 200, group_incidents: groupIncidents, sort: sortBy === "severity" ? "priority" : sortBy };
    if (statusFilter !== "all") params.status = statusFilter;
    const res = await getThreats(params);
    setState({ items: res.data.items, source: res.source, loading: false, error: res.error });
  }, [groupIncidents, sortBy, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    let items = state.items;
    if (severityFilter !== "all") items = items.filter((t) => t.severity === severityFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (t) => t.ip?.toLowerCase().includes(q) || t.type?.toLowerCase().includes(q) || (t.reason || []).join(" ").toLowerCase().includes(q)
      );
    }
    if (sortBy === "severity") {
      items = [...items].sort((a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity]);
    }
    return items;
  }, [state.items, severityFilter, search, sortBy]);

  const stats = useMemo(() => ({
    total: filtered.length,
    critical: filtered.filter((t) => t.severity === "critical").length,
    high: filtered.filter((t) => t.severity === "high").length,
    unassignedOpen: filtered.filter((t) => (t.status === "new" || !t.status)).length,
  }), [filtered]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  // Real write -- PATCH /alerts/{id}/status, same endpoint dashboard.js
  // already uses. Unlike Threat Investigation's session-only actions,
  // this queue view is the analyst's actual triage tool, so status
  // changes here are meant to persist. Simulated (sim-*) ids are
  // skipped -- there's nothing in the database to update for those.
  const updateStatus = useCallback(async (ids, newStatus) => {
    setActionError(null);
    const realIds = [...ids].filter((id) => !id.startsWith("sim-"));
    try {
      await Promise.all(realIds.map((id) => api.patch(`/alerts/${id}/status`, { status: newStatus })));
      clearSelection();
      await load();
    } catch (err) {
      setActionError(err.message || "Couldn't update status.");
    }
  }, [clearSelection, load]);

  return {
    ...state, filtered, stats, search, setSearch, severityFilter, setSeverityFilter,
    statusFilter, setStatusFilter, groupIncidents, setGroupIncidents, sortBy, setSortBy,
    selectedIds, toggleSelect, clearSelection, updateStatus, actionError, retry: load,
  };
}