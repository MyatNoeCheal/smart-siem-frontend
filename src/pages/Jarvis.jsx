import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AvatarCore from "../components/AvatarCore";
import ChatPanel from "../components/ChatPanel";
import SystemPanel from "../components/SystemPanel";
import { checkAssistantHealth, sendAssistantMessage } from "../lib/api";
import { useVoice } from "../lib/useVoice";

export default function Jarvis() {
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [health, setHealth] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Current page name, derived from the route, sent to the backend so
  // JARVIS knows what the analyst is already looking at.
  const currentPage = location.pathname.replace("/", "") || "overview";

  useEffect(() => {
    checkAssistantHealth().then(setHealth).catch(() => setHealth({ ollama_reachable: false }));
  }, []);

  const handleReply = useCallback(
    (reply, action) => {
      if (action?.type === "navigate" && action.target) {
        navigate(`/${action.target}`);
      }
      speak(reply);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate]
  );

  async function handleUserMessage(text) {
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);
    try {
      const data = await sendAssistantMessage(
        text,
        [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        currentPage
      );
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      handleReply(data.reply, data.action);
    } catch (err) {
      const msg = "I couldn't reach my backend or the language model. Check that both are running locally.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setThinking(false);
    }
  }

  const { supported, listening, speaking, interimText, startListening, stopListening, speak } =
    useVoice({ onFinalTranscript: handleUserMessage });

  function toggleMic() {
    listening ? stopListening() : startListening();
  }

  return (
    <div className="jarvis-page">
      <header className="jarvis-header">
        <div>
          <div className="jarvis-title">JARVIS</div>
          <div className="jarvis-subtitle">AI Assistant &middot; Smart SIEM</div>
        </div>
        <nav className="jarvis-nav">
          {["overview", "threats", "cases", "fraud", "ai-insights"].map((p) => (
            <button
              key={p}
              className={`jarvis-nav-btn ${currentPage === p ? "is-active" : ""}`}
              onClick={() => navigate(`/${p}`)}
            >
              {p.replace("-", " ")}
            </button>
          ))}
        </nav>
      </header>

      <main className="jarvis-main">
        <ChatPanel
          messages={messages}
          onSend={handleUserMessage}
          listening={listening}
          onMicClick={toggleMic}
          micSupported={supported}
          interimText={interimText}
        />

        <div className="jarvis-avatar-col">
          <AvatarCore listening={listening} speaking={speaking} thinking={thinking} />
          <p className="jarvis-tagline">
            "I can <em>analyze, respond and act.</em><br />Your security, my priority."
          </p>
        </div>

        <SystemPanel health={health} />
      </main>
    </div>
  );
}
