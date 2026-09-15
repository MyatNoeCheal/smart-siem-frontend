import { Outlet, useNavigate, useLocation } from "react-router-dom";
import JarvisWidget from "./JarvisWidget";
import { clearStoredAuth } from "../lib/api";

const NAV_PAGES = ["overview", "threats", "cases", "fraud", "ai-insights"];

export default function Layout({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.replace("/", "") || "overview";

  return (
    <div className="app-shell">
      <header className="jarvis-header">
        <div>
          <div className="jarvis-title">SMART SIEM</div>
          <div className="jarvis-subtitle">JARVIS-assisted SOC dashboard</div>
        </div>
        <nav className="jarvis-nav">
          {NAV_PAGES.map((p) => (
            <button
              key={p}
              className={`jarvis-nav-btn ${currentPage === p ? "is-active" : ""}`}
              onClick={() => navigate(`/${p}`)}
            >
              {p.replace("-", " ")}
            </button>
          ))}
        </nav>
        <div className="jarvis-user-chip">
          <span>{currentUser?.display_name || currentUser?.username}</span>
          <button className="jarvis-logout-btn" onClick={onLogout}>Sign out</button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <JarvisWidget />
    </div>
  );
}
