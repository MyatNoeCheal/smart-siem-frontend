import { useCallback, useEffect, useState } from "react";

export function useApiResource(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, source: null, error: null, loading: true });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const result = await fetcher();
    setState({ ...result, loading: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  const items = state.data?.items ?? (Array.isArray(state.data) ? state.data : null);
  const isEmpty = !state.loading && (state.data == null || (Array.isArray(items) && items.length === 0));

  return { ...state, isEmpty, retry: load };
}