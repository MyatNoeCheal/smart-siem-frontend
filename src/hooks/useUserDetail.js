import { useEffect, useState } from "react";
import { getUserDetail } from "../services/userDetailService";

export function useUserDetail(userId) {
  const [state, setState] = useState({ data: null, source: null, loading: false, error: null });

  useEffect(() => {
    if (!userId) {
      setState({ data: null, source: null, loading: false, error: null });
      return;
    }
    let mounted = true;
    setState((s) => ({ ...s, loading: true }));
    getUserDetail(userId).then((res) => mounted && setState({ ...res, loading: false }));
    return () => { mounted = false; };
  }, [userId]);

  return state;
}