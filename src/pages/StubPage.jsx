import { useParams, Link } from "react-router-dom";

/**
 * Placeholder for every dashboard section JARVIS can navigate to
 * (threats, cases, fraud, etc.) that doesn't have a real React page yet.
 * Wire these up to your existing dashboard.html views (or rebuild them
 * here) as you get to them -- the point right now is that navigate_page
 * actually moves the browser, so the "Iron Man" demo works end to end.
 */
export default function StubPage() {
  const { page } = useParams();
  return (
    <div className="stub-page">
      <Link to="/overview" className="stub-back">&larr; Back to JARVIS</Link>
      <h1>{(page || "").replace("-", " ")}</h1>
      <p>This page isn't built out yet — JARVIS successfully navigated here though.</p>
    </div>
  );
}
