import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminActivity } from "../services/adminService";

const SEVERITY_ORDER = { low: 0, medium: 1, high: 2, critical: 3 };

export function useAdminActivity() {
  const [state, setState] = useState({ items: [], source: "mock", loading: true, error: null });
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const res = await getAdminActivity({ limit: 300 });
    setState({ items: res.data.items, source: res.source, loading: false, error: res.error });
  }, []);

  useEffect(() => { load(); }, [load]);

  const users = useMemo(() => [...new Set(state.items.map((i) => i.userId).filter(Boolean))].sort(), [state.items]);
  const actions = useMemo(() => [...new Set(state.items.map((i) => i.eventType).filter(Boolean))].sort(), [state.items]);

  const filtered = useMemo(() => {
    return state.items
      .filter((i) => userFilter === "all" || i.userId === userFilter)
      .filter((i) => actionFilter === "all" || i.eventType === actionFilter)
      .filter((i) => severityFilter === "all" || i.severity === severityFilter)
      .filter((i) => {
        if (!dateFrom && !dateTo) return true;
        if (!i.timestamp) return false;
        const t = new Date(i.timestamp).getTime();
        if (dateFrom && t < new Date(dateFrom).getTime()) return false;
        if (dateTo && t > new Date(dateTo).getTime()) return false;
        return true;
      })
      .filter((i) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return i.userId.toLowerCase().includes(q) || i.eventType.toLowerCase().includes(q) || i.ip.toLowerCase().includes(q);
      })
      .sort((a, b) => (new Date(b.timestamp || 0)) - (new Date(a.timestamp || 0)));
  }, [state.items, userFilter, actionFilter, severityFilter, dateFrom, dateTo, search]);

  const stats = useMemo(() => ({
    total: filtered.length,
    uniqueAdmins: new Set(filtered.map((i) => i.userId)).size,
    configChanges: filtered.filter((i) => i.eventType === "config_change").length,
    suspicious: filtered.filter((i) => SEVERITY_ORDER[i.severity] >= SEVERITY_ORDER.high).length,
  }), [filtered]);

  return {
    loading: state.loading, source: state.source, error: state.error, retry: load,
    filtered, users, actions, stats,
    search, setSearch, userFilter, setUserFilter, actionFilter, setActionFilter,
    severityFilter, setSeverityFilter, dateFrom, setDateFrom, dateTo, setDateTo,
  };
}