import axios from "axios";

/**
 * ============================================================
 * CENTRALIZED API CLIENT — the only file that knows the backend
 * URL or reads an auth token. Nothing else in the app should
 * import axios directly.
 * ============================================================
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const TOKEN_STORAGE_KEY = "smart_siem_token";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

// Attaches the analyst's JWT (see auth.py) if one is stored.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalizes every failure into one shape so callers never branch
// on axios internals -- and clears a stale token on 401 so the
// next request doesn't keep failing silently.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? null;
    if (status === 401) localStorage.removeItem(TOKEN_STORAGE_KEY);

    return Promise.reject({
      status,
      message: error.response?.data?.detail || error.message || "Unexpected network error",
      isNetworkError: !error.response,
    });
  }
);

export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export default api;