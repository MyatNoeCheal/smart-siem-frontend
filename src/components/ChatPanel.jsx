import { useEffect, useRef, useState } from "react";

export default function ChatPanel({ messages, onSend, listening, onMicClick, micSupported, interimText }) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, interimText]);

  function submit(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }

  return (
    <div className="jarvis-chat">
      <div className="jarvis-chat-log" ref={scrollRef}>
        {messages.length === 0 && (
          <p className="jarvis-hint">I'm here to help. What can I do for you?</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`jarvis-bubble jarvis-bubble-${m.role}`}>
            <div className="jarvis-bubble-label">{m.role === "user" ? "You" : "JARVIS"}</div>
            <div className="jarvis-bubble-text">{m.content}</div>
          </div>
        ))}
        {interimText && (
          <div className="jarvis-bubble jarvis-bubble-user jarvis-bubble-interim">
            <div className="jarvis-bubble-label">You</div>
            <div className="jarvis-bubble-text">{interimText}…</div>
          </div>
        )}
      </div>

      <form className="jarvis-input-row" onSubmit={submit}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a command…"
          className="jarvis-input"
        />
        <button
          type="button"
          onClick={onMicClick}
          className={`jarvis-mic-btn ${listening ? "is-active" : ""}`}
          disabled={!micSupported}
          title={micSupported ? "Talk to JARVIS" : "Voice input isn't supported in this browser"}
          aria-label="Toggle microphone"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
          </svg>
        </button>
        <button type="submit" className="jarvis-send-btn" aria-label="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
