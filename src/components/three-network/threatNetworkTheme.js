export const NODE_TYPES = {
  internet: { label: "Internet", color: "#5B8CFF", geometry: "icosahedron" },
  server: { label: "Server", color: "#22D3EE", geometry: "box" },
  user: { label: "User", color: "#8B7CF6", geometry: "sphere" },
  application: { label: "Application", color: "#33D69F", geometry: "octahedron" },
  database: { label: "Database", color: "#F5D547", geometry: "cylinder" },
};

// pulse = scale amplitude, speed = pulse frequency, glow = halo opacity
export const THREAT_LEVELS = {
  normal: { color: null, pulse: 0, speed: 0, glow: 0 },
  suspicious: { color: "#F5A623", pulse: 0.09, speed: 1.6, glow: 0.18 },
  critical: { color: "#FB4B5D", pulse: 0.22, speed: 3.1, glow: 0.32 },
};

export const LAYER_LABELS = [
  { key: "internet", y: 7, label: "INTERNET" },
  { key: "server", y: 3.5, label: "SERVERS" },
  { key: "user", y: 0, label: "USERS" },
  { key: "application", y: -3.5, label: "APPLICATIONS" },
  { key: "database", y: -7, label: "DATABASE" },
];