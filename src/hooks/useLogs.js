import { useCallback, useEffect, useState } from "react";
import { getLogs } from "../services/logService";

const PAGE_SIZE = 20;

export function useLogs() {
  const [state, setState] = useState({ items: [], total: 0, totalPages: 1, source: "mock", loading: true, error: null });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("");
  const [severity, setSeverity] = useState("");
  const [sort, setSort] = useState({ key: "timestamp", dir: "desc" });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const params = { page, page_size: PAGE_SIZE };
    if (search.trim()) params.search = search.trim();
    if (eventType) params.event_type = eventType;
    if (severity) params.severity = severity;

    const res = await getLogs(params);

    // Sorting is applied to the CURRENT PAGE only -- the backend has no
    // sort parameter, and re-sorting across all pages would require
    // pulling every record into the browser, which is exactly what
    // pagination exists to avoid.
    const sorted = [...res.data.items].sort((a, b) => {
      let av = a[sort.key], bv = b[sort.key];
      if (sort.key === "timestamp") { av = av ? new Date(av).getTime() : 0; bv = bv ? new Date(bv).getTime() : 0; }
      if (av == null) av = -1;
      if (bv == null) bv = -1;
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });

    setState({
      items: sorted,
      total: res.data.total,
      totalPages: res.data.totalPages,
      source: res.source,
      loading: false,
      error: res.error,
    });
  }, [page, search, eventType, severity, sort]);

  useEffect(() => { load(); }, [load]);

  // Any filter change resets to page 1 -- avoids landing on an out-of-range page.
  useEffect(() => { setPage(1); }, [search, eventType, severity]);

  const toggleSort = useCallback((key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  }, []);

  return {
    ...state, page, setPage, search, setSearch, eventType, setEventType,
    severity, setSeverity, sort, toggleSort, pageSize: PAGE_SIZE, retry: load,
  };
}