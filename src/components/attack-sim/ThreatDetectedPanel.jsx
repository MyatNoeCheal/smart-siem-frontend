
import { ShieldAlert, X } from "lucide-react";

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour12: false }) + " · " + d.toLocaleDateString("en-US");
}

export default function ThreatDetectedPanel({ threat, onDismiss }) {
  if (!threat) return null;

  const fields = [
    { label: "User", value: threat.user },
    { label: "Risk Score", value: `${threat.riskScore} / 100` },
    { label: "AI Model", value: threat.aiModel },
    { label: "Confidence", value: `${Math.round(threat.confidence * 100)}%` },
    { label: "Timestamp", value: formatTimestamp(threat.timestamp) },
  ];

  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-risk-critical/30 bg-gradient-to-r from-risk-critical/[0.08] via-navy-800/70 to-navy-800/70 shadow-glow">
      <div className="flex flex-wrap items-start justify-between gap-4 p-5">
        <div className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 animate-pulse items-center justify-center rounded-full bg-risk-critical/15 ring-1 ring-risk-critical/40">
            <ShieldAlert className="h-5 w-5 text-risk-critical" />
          </span>
          <div>
            <p className="font-display text-[16px] font-bold tracking-tight text-risk-critical">
              CRITICAL THREAT DETECTED
            </p>
            <p className="mt-0.5 text-[13px] text-navy-100/80">{threat.threatType}</p>

            <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1.5 sm:grid-cols-3">
              {fields.map((f) => (
                <div key={f.label}>
                  <p className="font-mono text-[9.5px] uppercase tracking-wider text-navy-400">{f.label}</p>
                  <p className="font-mono text-[12.5px] text-navy-50">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="rounded-md p-1.5 text-navy-400 hover:bg-white/[0.06] hover:text-navy-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}