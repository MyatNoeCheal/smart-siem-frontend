import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { setAuthToken } from "../services/api";

const AuthContext = createContext(null);
const USER_STORAGE_KEY = "smart_siem_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [checking, setChecking] = useState(true);

  const logout = useCallback(() => {
    setAuthToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  // On first load, if a token exists, confirm it's still valid via /auth/me
  // rather than trusting a possibly-expired token blindly.
  useEffect(() => {
    const token = localStorage.getItem("smart_siem_token");
    if (!token) {
      setChecking(false);
      return;
    }
    api
      .get("/auth/me")
      .then(() => setChecking(false))
      .catch(() => {
        logout();
        setChecking(false);
      });
  }, [logout]);

  const login = useCallback(async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    setAuthToken(res.data.access_token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}