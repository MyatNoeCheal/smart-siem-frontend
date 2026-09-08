const VOICE_EXAMPLES = [
  "Show me today's threat summary",
  "Open the threats page",
  "Are there any escalating entities right now?",
  "Show me the fraud summary",
  "Mark that alert as investigating",
  "Go to settings",
];

export default function SystemPanel({ health }) {
  const ollamaUp = health?.ollama_reachable;
  const modelReady = health?.model_pulled;

  return (
    <aside className="jarvis-side">
      <div className="jarvis-panel">
        <div className="jarvis-panel-title">Voice Command Examples</div>
        <ul className="jarvis-command-list">
          {VOICE_EXAMPLES.map((cmd) => (
            <li key={cmd}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              {cmd}
            </li>
          ))}
        </ul>
      </div>

      <div className="jarvis-panel">
        <div className="jarvis-panel-title">
          AI Status
          <span className={`jarvis-status-pill ${ollamaUp ? "is-online" : "is-offline"}`}>
            {ollamaUp === undefined ? "checking…" : ollamaUp ? "online" : "offline"}
          </span>
        </div>
        <div className="jarvis-status-rows">
          <div className="jarvis-status-row">
            <span>Ollama engine</span>
            <span className={ollamaUp ? "ok" : "bad"}>{ollamaUp ? "Reachable" : "Unreachable"}</span>
          </div>
          <div className="jarvis-status-row">
            <span>Model</span>
            <span className={modelReady ? "ok" : "bad"}>
              {health?.model || "—"} {modelReady === false ? "(not pulled)" : ""}
            </span>
          </div>
        </div>
        {ollamaUp === false && (
          <p className="jarvis-status-hint">
            Start Ollama locally (`ollama serve`) and make sure the backend is running on
            localhost:8000 — JARVIS needs both to answer.
          </p>
        )}
      </div>
    </aside>
  );
}
