// Talks to the local crp-siem-backend. Everything runs on localhost for
// the JARVIS voice demo -- see WIRE_UP_MAIN.md / SETUP.md.
const API_BASE = "http://localhost:8000";
const TOKEN_KEY = "jarvis-auth-token";
const USER_KEY = "jarvis-auth-user";

export function getStoredAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  if (!token || !userRaw) return null;
  try {
    return { token, user: JSON.parse(userRaw) };
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Same /auth/login endpoint the main SIEM dashboard already uses (see
 * auth.py) -- JARVIS is a second client of the same analyst accounts,
 * not a separate login system.
 */
export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Invalid username or password");
  }
  const data = await res.json();
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

async function authFetch(path, options = {}) {
  const stored = getStoredAuth();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (stored) headers["Authorization"] = `Bearer ${stored.token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    clearStoredAuth();
    throw new Error("Session expired -- please sign in again.");
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${detail}`);
  }
  return res.json();
}

export function apiGet(path) {
  return authFetch(path);
}

export function checkAssistantHealth() {
  return authFetch("/assistant/health");
}

/**
 * `history` is [{ role: "user" | "assistant", content }] in chronological
 * order -- the backend only keeps the last ~12 turns, so it's fine to
 * pass the whole conversation each time.
 */
export function sendAssistantMessage(message, history = [], currentPage = null) {
  return authFetch("/assistant/chat", {
    method: "POST",
    body: JSON.stringify({ message, history, current_page: currentPage }),
  });
  // -> { reply, action, tool_calls }
  // action.type === "navigate"        -> { target: "threats" }
  // action.type === "confirm_action"  -> { tool, args, summary }
}

/** Actually executes a write action the analyst just approved. */
export function confirmAssistantAction(tool, args) {
  return authFetch("/assistant/confirm", {
    method: "POST",
    body: JSON.stringify({ tool, args }),
  });
  // -> { reply, ok }
}
