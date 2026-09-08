// Talks to the local crp-siem-backend. Everything runs on localhost for
// the JARVIS voice demo, so this is intentionally not configurable via
// env vars the way a hosted deployment would be -- see WIRE_UP_MAIN.md.
const API_BASE = "http://localhost:8000";

export async function checkAssistantHealth() {
  const res = await fetch(`${API_BASE}/assistant/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

/**
 * Sends one message to JARVIS. `history` is a plain array of
 * { role: "user" | "assistant", content: string } in chronological order
 * (the last ~12 are kept server-side, so it's fine to pass the whole
 * conversation).
 */
export async function sendAssistantMessage(message, history = [], currentPage = null) {
  const res = await fetch(`${API_BASE}/assistant/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, current_page: currentPage }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Assistant request failed: ${res.status} ${detail}`);
  }
  return res.json(); // { reply, action, tool_calls }
}
