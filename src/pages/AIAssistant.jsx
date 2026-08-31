import { useMemo, useState } from "react";
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  CornerDownLeft,
  Loader2,
  Radar,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  TriangleAlert,
} from "lucide-react";
import clsx from "clsx";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import StatusBadge from "../components/ui/StatusBadge";
import { sendAssistantMessage } from "../api/client";

const QUICK_PROMPTS = [
  "Brief me on the most urgent threat in the SIEM right now.",
  "Correlate recent critical alerts with risky users or IPs.",
  "Draft a 5-step investigation plan for the latest anomaly.",
  "What should I verify before marking alerts as false positive?",
];

const STARTER_REPLY =
  "Online. I can read SIEM posture, alerts, logs, entity risk, and predictive risk. Ask me for a threat brief, correlation, case notes, or an investigation plan.";

function AssistantBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={clsx("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[880px] rounded-lg px-4 py-3 text-[13px] leading-6 shadow-glow",
          isUser
            ? "bg-command-cyan/15 text-navy-50 ring-1 ring-command-cyan/30"
            : "bg-navy-900/70 text-navy-100 ring-1 ring-white/[0.06]"
        )}
      >
        <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-navy-400">
          {isUser ? <TerminalSquare className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5 text-command-cyan" />}
          {isUser ? "Analyst" : "OpenJarvis"}
        </div>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function SignalTile({ icon: Icon, label, value, tone = "text-navy-50" }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-navy-900/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] text-navy-400">{label}</p>
        <Icon className={clsx("h-4 w-4", tone)} />
      </div>
      <p className={clsx("mt-3 font-display text-2xl font-semibold", tone)}>{value}</p>
    </div>
  );
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: STARTER_REPLY },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);

  const context = lastResult?.context;
  const totals = context?.totals || {};
  const provider = lastResult?.provider || "ready";

  const providerLabel = useMemo(() => {
    if (provider === "qwen") return "QWEN LIVE";
    if (provider === "local-fallback") return "LOCAL SOC MODE";
    return "READY";
  }, [provider]);

  const ask = async (text) => {
    const message = text.trim();
    if (!message || loading) return;

    const nextMessages = [...messages, { role: "user", content: message }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const result = await sendAssistantMessage({
        message,
        history: messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .slice(-8),
        focus: "ai-insights",
      });
      setLastResult(result);
      setMessages([...nextMessages, { role: "assistant", content: result.reply }]);
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        "Assistant backend is unreachable. Check FastAPI, JWT login, and /assistant/chat.";
      setError(detail);
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: `I could not reach the assistant service. ${detail}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    ask(input);
  };

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        subtitle="OpenJarvis behavior layer powered by Qwen and live SIEM context"
        actions={
          <StatusBadge level={provider === "qwen" ? "live" : "mock"}>
            {providerLabel}
          </StatusBadge>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <GlassPanel className="flex min-h-[660px] flex-col p-0">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command-cyan/10 ring-1 ring-command-cyan/25">
                <BrainCircuit className="h-5 w-5 text-command-cyan" />
              </div>
              <div>
                <h2 className="font-display text-[15px] font-semibold text-navy-50">
                  OpenJarvis SOC Console
                </h2>
                <p className="text-[12px] text-navy-400">
                  Read-only analysis, correlation, and response planning
                </p>
              </div>
            </div>
            <Sparkles className="h-4 w-4 text-command-violet" />
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((message, index) => (
              <AssistantBubble key={`${message.role}-${index}`} message={message} />
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-[13px] text-navy-400">
                <Loader2 className="h-4 w-4 animate-spin text-command-cyan" />
                OpenJarvis is correlating live SIEM context
              </div>
            )}
          </div>

          <div className="border-t border-white/[0.06] p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => ask(prompt)}
                  disabled={loading}
                  className="rounded-lg border border-white/[0.06] bg-navy-900/55 px-3 py-2 text-left text-[12px] text-navy-100 hover:border-command-cyan/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask for a threat brief, IOC correlation, or case plan..."
                className="min-h-11 flex-1 rounded-lg border border-white/[0.08] bg-navy-950/80 px-4 text-[13px] text-navy-50 outline-none placeholder:text-navy-500 focus:border-command-cyan/40"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-command-cyan px-4 text-[13px] font-semibold text-navy-950 transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
              >
                <CornerDownLeft className="h-4 w-4" />
                Send
              </button>
            </form>
            {error && <p className="mt-3 text-[12px] text-risk-high">{error}</p>}
          </div>
        </GlassPanel>

        <div className="space-y-5">
          <GlassPanel>
            <h2 className="mb-4 font-display text-[14px] font-semibold text-navy-50">
              Live Context
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <SignalTile icon={Radar} label="Open Alerts" value={totals.open_alerts ?? "--"} tone="text-command-cyan" />
              <SignalTile icon={TriangleAlert} label="Critical" value={totals.critical_events ?? "--"} tone="text-risk-critical" />
              <SignalTile icon={ShieldCheck} label="Anomalies" value={totals.anomalies ?? "--"} tone="text-risk-high" />
              <SignalTile icon={CheckCircle2} label="Events" value={totals.events ?? "--"} tone="text-risk-low" />
            </div>
          </GlassPanel>

          <GlassPanel>
            <h2 className="mb-3 font-display text-[14px] font-semibold text-navy-50">
              Response Guardrails
            </h2>
            <div className="space-y-3 text-[13px] leading-6 text-navy-100/75">
              <p>Assistant actions are read-only by default.</p>
              <p>Use it to summarize incidents, explain evidence, draft notes, and recommend triage steps.</p>
              <p>Containment, deletion, and case updates stay behind explicit analyst approval.</p>
            </div>
          </GlassPanel>

          <GlassPanel>
            <h2 className="mb-3 font-display text-[14px] font-semibold text-navy-50">
              Qwen Setup
            </h2>
            <div className="space-y-2 font-mono text-[11px] text-navy-100/75">
              <p>QWEN_API_KEY=...</p>
              <p>QWEN_MODEL=qwen-plus</p>
              <p>QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1</p>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
