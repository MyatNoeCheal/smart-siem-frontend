import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AvatarCore from "../components/AvatarCore";
import ChatPanel from "../components/ChatPanel";
import SystemPanel from "../components/SystemPanel";
import { checkAssistantHealth, confirmAssistantAction, sendAssistantMessage } from "../lib/api";
import { useVoice } from "../lib/useVoice";

export default function Jarvis() {
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [health, setHealth] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [confirming, setConfirming] = useState(false);
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
    const normalizedText = text.trim().toLowerCase();
    if (pendingAction) {
      if (/^(confirm|confirmed|yes|approve|approved|do it|go ahead)$/.test(normalizedText)) {
        await runConfirm();
      } else if (/^(cancel|cancelled|no|deny|denied|stop)$/.test(normalizedText)) {
        runCancel();
      } else {
        const prompt = "Please say confirm to execute the pending action, or cancel to stop.";
        setMessages((prev) => [...prev, { role: "assistant", content: prompt }]);
        speak(prompt);
      }
      return;
    }

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
      if (data.action?.type === "confirm_action") {
        setPendingAction(data.action);
      }
      handleReply(data.reply, data.action);
    } catch (err) {
      const msg = "I couldn't reach my backend or the language model. Check that both are running locally.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setThinking(false);
    }
  }

  async function runConfirm() {
    if (!pendingAction || confirming) return;
    setConfirming(true);
    try {
      const data = await confirmAssistantAction(pendingAction.tool, pendingAction.args);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      speak(data.reply);
    } catch (err) {
      const message = `The action could not be completed: ${err.message}`;
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
      speak(message);
    } finally {
      setPendingAction(null);
      setConfirming(false);
    }
  }

  function runCancel() {
    const message = "Understood. I cancelled the pending action.";
    setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    setPendingAction(null);
    speak(message);
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
