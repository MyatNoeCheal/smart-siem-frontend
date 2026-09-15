import { useEffect, useState } from "react";
import { Bot, Loader2, Mic, Send, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmAssistantAction, sendAssistantMessage } from "../lib/api";
import { useVoice } from "../lib/useVoice";

const CONFIRM_WORDS = /^(confirm|confirmed|yes|approve|approved|do it|go ahead)$/;
const CANCEL_WORDS = /^(cancel|cancelled|no|deny|denied|stop)$/;

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname.replace(/^\//, "") || "overview";
  const { supported, listening, speaking, interimText, startListening, stopListening, speak } = useVoice({
    onFinalTranscript: handleInput,
  });

  useEffect(() => {
    if (!open) return;
    const log = document.getElementById("assistant-widget-log");
    log?.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [messages, interimText, open]);

  async function handleInput(text) {
    const normalized = text.trim().toLowerCase();
    if (pendingAction) {
      if (CONFIRM_WORDS.test(normalized)) return runConfirm();
      if (CANCEL_WORDS.test(normalized)) return runCancel();
      const prompt = "Please say confirm to execute the action, or cancel to stop.";
      addAssistantMessage(prompt);
      speak(prompt);
      return;
    }

    const userMessage = { role: "user", content: text };
    setMessages((previous) => [...previous, userMessage]);
    setThinking(true);
    try {
      const data = await sendAssistantMessage(
        text,
        [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        currentPage
      );
      setMessages((previous) => [...previous, { role: "assistant", content: data.reply }]);
      if (data.action?.type === "navigate" && data.action.target) navigate(`/${data.action.target}`);
      if (data.action?.type === "confirm_action") setPendingAction(data.action);
      speak(data.reply);
    } catch (error) {
      const message = error.message || "I could not reach the assistant backend.";
      addAssistantMessage(message);
      speak(message);
    } finally {
      setThinking(false);
    }
  }

  function addAssistantMessage(content) {
    setMessages((previous) => [...previous, { role: "assistant", content }]);
  }

  async function runConfirm() {
    if (!pendingAction || confirming) return;
    setConfirming(true);
    try {
      const data = await confirmAssistantAction(pendingAction.tool, pendingAction.args);
      addAssistantMessage(data.reply);
      speak(data.reply);
    } catch (error) {
      const message = `The action could not be completed: ${error.message}`;
      addAssistantMessage(message);
      speak(message);
    } finally {
      setPendingAction(null);
      setConfirming(false);
    }
  }

  function runCancel() {
    const message = "Understood. I cancelled the pending action.";
    addAssistantMessage(message);
    setPendingAction(null);
    speak(message);
  }

  function submit(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || thinking || confirming) return;
    setDraft("");
    handleInput(text);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <section className="flex h-[min(30rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-command-blue/30 bg-navy-950/95 shadow-2xl backdrop-blur-xl">
          <header className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg luxury-gradient text-white">
                <Bot className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-navy-50">JARVIS</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-navy-400">
                  {thinking || confirming ? "Working" : listening ? "Listening" : "Ready"}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-navy-400 hover:bg-white/[0.06] hover:text-navy-50" aria-label="Close JARVIS">
              <X className="h-4 w-4" />
            </button>
          </header>

          <div id="assistant-widget-log" className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && <p className="text-sm text-navy-400">Ask about threats, fraud, risk, or say “open threats”.</p>}
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${message.role === "user" ? "ml-auto bg-command-cyan/20 text-navy-50" : "bg-white/[0.06] text-navy-100"}`}>
                {message.content}
              </div>
            ))}
            {interimText && <div className="rounded-xl bg-command-cyan/10 px-3 py-2 text-sm text-navy-400">{interimText}...</div>}
          </div>

          <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/[0.08] p-3">
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask JARVIS..." className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-navy-50 outline-none placeholder:text-navy-400 focus:border-command-cyan/40" />
            <button type="button" onClick={() => (listening ? stopListening() : startListening())} disabled={!supported || thinking || confirming} className={`rounded-lg p-2 ${listening ? "bg-risk-critical text-white" : "bg-white/[0.06] text-navy-100"}`} aria-label="Toggle microphone" title={supported ? "Speak to JARVIS" : "Voice input is not supported in this browser"}>
              <Mic className="h-4 w-4" />
            </button>
            <button type="submit" disabled={!draft.trim() || thinking || confirming} className="rounded-lg p-2 luxury-gradient text-white disabled:opacity-40" aria-label="Send message">
              {thinking || confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </section>
      )}

      <button onClick={() => setOpen((value) => !value)} className="flex h-12 w-12 items-center justify-center rounded-full luxury-gradient text-white shadow-lg ring-2 ring-white/20" aria-label={open ? "Close JARVIS" : "Open JARVIS"} title="Speak to JARVIS">
        {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </button>
    </div>
  );
}
