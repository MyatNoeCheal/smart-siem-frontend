import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Attaches the analyst's JWT (see auth.py) if one is stored, so this
// frontend can sit in front of your existing role-protected endpoints
// without any change to the backend.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("smart_siem_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const FORCE_MOCK = import.meta.env.VITE_FORCE_MOCK === "true";

export async function sendAssistantMessage({ message, history = [], focus = "overview" }) {
  const response = await apiClient.post("/assistant/chat", {
    message,
    history,
    focus,
  }, {
    // Ollama may need longer than the normal dashboard API timeout on CPU.
    timeout: 200000,
  });
  return response.data;
}
