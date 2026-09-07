import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldHalf, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/overview";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.status === 401 ? "Invalid username or password." : err.message || "Could not reach the backend.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="command-grid-bg flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="glass-panel w-full max-w-sm p-7">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-command-cyan/20 to-command-blue/20 ring-1 ring-command-cyan/30">
            <ShieldHalf className="h-5 w-5 text-command-cyan" />
          </div>
          <div>
            <p className="font-display text-[13px] font-semibold tracking-wide text-navy-50">SMART SIEM</p>
            <p className="font-mono text-[10px] tracking-widest text-navy-400">ANALYST SIGN-IN</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-navy-400">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full rounded-lg border border-white/[0.08] bg-navy-900/70 px-3 py-2.5 text-[13px] text-navy-50 outline-none focus:border-command-cyan/40"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-navy-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-white/[0.08] bg-navy-900/70 px-3 py-2.5 text-[13px] text-navy-50 outline-none focus:border-command-cyan/40"
            />
          </div>

          {error && <p className="text-[12px] text-risk-critical">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-command-cyan py-2.5 font-mono text-[12px] font-semibold uppercase tracking-wider text-navy-950 transition-opacity disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-navy-400">
          No account? Ask an admin, or run <code className="rounded bg-navy-800 px-1 py-0.5 font-mono">create_admin_user.py</code> once.
        </p>
      </div>
    </div>
  );
}