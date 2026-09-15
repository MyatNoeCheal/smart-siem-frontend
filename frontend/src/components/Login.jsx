import { useState } from "react";
import { login } from "../lib/api";

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await login(username, password);
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="jarvis-login-overlay">
      <form className="jarvis-login-card" onSubmit={submit}>
        <div className="jarvis-login-title">JARVIS</div>
        <div className="jarvis-login-sub">Analyst sign-in &middot; same account as the SIEM dashboard</div>

        <label className="jarvis-login-label">Username</label>
        <input
          className="jarvis-login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <label className="jarvis-login-label">Password</label>
        <input
          className="jarvis-login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <div className="jarvis-login-error">{error}</div>}

        <button type="submit" className="jarvis-login-btn" disabled={busy}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
