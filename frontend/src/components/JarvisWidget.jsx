import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AvatarCoreMini from "./AvatarCoreMini";
import ChatPanel from "./ChatPanel";
import ConfirmBar from "./ConfirmBar";
import { sendAssistantMessage, confirmAssistantAction } from "../lib/api";
import { useVoice } from "../lib/useVoice";

const CONFIRM_WORDS = ["confirm", "yes", "do it", "go ahead", "proceed", "affirmative"];
const CANCEL_WORDS = ["cancel", "no", "stop", "don't", "negative", "abort"];

function matchesAny(text, words) {
  const t = text.toLowerCase();
  return words.some((w) => t.includes(w));
}

/**
 * Mounted ONCE in Layout.jsx (outside <Outlet/>), so its state -- the
 * conversation, whether it's listening, any pending confirm action --
 * survives page navigation. Previously this lived inside the Overview
 * page itself, which meant JARVIS vanished the moment it navigated you
 * anywhere else. This is the fix for that.
 */
export default function JarvisWidget() {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.replace("/", "") || "overview";

  const { supported, listening, speaking, interimText, startListening, stopListening, speak } =
    useVoice({ onFinalTranscript: handleTranscript });

  function toggleMic() {
    listening ? stopListening() : startListening();
  }

  function handleTranscript(text) {
    if (pendingAction) {
      if (matchesAny(text, CONFIRM_WORDS)) return runConfirm();
      if (matchesAny(text, CANCEL_WORDS)) return runCancel();
    }
    handleUserMessage(text);
  }

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

      if (data.action?.type === "navigate" && data.action.target) {
        navigate(`/${data.action.target}`);
        setPendingAction(null);
      } else if (data.action?.type === "confirm_action") {
        setPendingAction({ tool: data.action.tool, args: data.action.args, summary: data.action.summary });
      } else {
        setPendingAction(null);
      }
      speak(data.reply);
    } catch (err) {
      const msg = err.message.includes("Session expired")
        ? err.message
        : "I couldn't reach my backend or the language model. Check that both are running locally.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setThinking(false);
    }
  }

  async function runConfirm() {
    if (!pendingAction) return;
    setConfirming(true);
    try {
      const data = await confirmAssistantAction(pendingAction.tool, pendingAction.args);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      speak(data.reply);
    } catch (err) {
      const msg = "That action failed to run: " + err.message;
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
      speak(msg);
    } finally {
      setPendingAction(null);
      setConfirming(false);
    }
  }

  function runCancel() {
    const msg = "Understood -- I've cancelled that.";
    setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    speak(msg);
    setPendingAction(null);
  }

  if (!open) {
    return (
      <button className="jarvis-fab" onClick={() => setOpen(true)} aria-label="Open JARVIS">
        <AvatarCoreMini listening={listening} speaking={speaking} thinking={thinking} />
        {pendingAction && <span className="jarvis-fab-pip" />}
      </button>
    );
  }

  return (
    <div className="jarvis-dock">
      <div className="jarvis-dock-header">
        <div className="jarvis-dock-avatar"><AvatarCoreMini listening={listening} speaking={speaking} thinking={thinking} /></div>
        <div className="jarvis-dock-title">
          <div>JARVIS</div>
          <div className="jarvis-dock-sub">{thinking ? "Thinking…" : listening ? "Listening…" : speaking ? "Speaking…" : "Standing by"}</div>
        </div>
        <button className="jarvis-dock-collapse" onClick={() => setOpen(false)} aria-label="Minimize JARVIS">
          &minus;
        </button>
      </div>

      <ConfirmBar pendingAction={pendingAction} onConfirm={runConfirm} onCancel={runCancel} busy={confirming} />

      <ChatPanel
        messages={messages}
        onSend={handleUserMessage}
        listening={listening}
        onMicClick={toggleMic}
        micSupported={supported}
        interimText={interimText}
      />
    </div>
  );
}
