import { useState } from "react";
import clsx from "clsx";
import { BrainCircuit, MessageSquare } from "lucide-react";
import AIInsights from "./AIInsights";
import AIAssistant from "./AIAssistant";

const TABS = [
  { key: "insights", label: "Model Insights", icon: BrainCircuit },
  { key: "chat", label: "AI Assistant", icon: MessageSquare },
];

export default function AIInsightsHub() {
  const [tab, setTab] = useState("insights");

  return (
    <div>
      <div className="mb-5 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              "flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-[11.5px] font-semibold uppercase tracking-wider transition-colors",
              tab === t.key
                ? "border-command-cyan/30 bg-command-cyan/10 text-command-cyan"
                : "border-white/[0.06] bg-navy-800/60 text-navy-400 hover:text-navy-100"
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "insights" ? <AIInsights /> : <AIAssistant />}
    </div>
  );
}