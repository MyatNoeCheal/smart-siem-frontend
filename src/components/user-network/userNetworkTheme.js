export const RISK_LEVELS = {
  low: { color: "#33D69F", pulse: 0, speed: 0, glow: 0 },
  medium: { color: "#F5D547", pulse: 0.07, speed: 1.1, glow: 0.14 },
  high: { color: "#F5A623", pulse: 0.13, speed: 1.8, glow: 0.24 },
  critical: { color: "#FB4B5D", pulse: 0.22, speed: 3.0, glow: 0.34 },
};

export const EDGE_TYPES = {
  email: { color: "#22D3EE", label: "Email" },
  login: { color: "#5B8CFF", label: "Login" },
  file_access: { color: "#8B7CF6", label: "File Access" },
  application: { color: "#33D69F", label: "Application" },
  server: { color: "#F5A623", label: "Server Access" },
  shared_ip: { color: "#4C5A78", label: "Shared IP (inferred)" },
};

export const RISK_FILTERS = ["all", "low", "medium", "high", "critical"];