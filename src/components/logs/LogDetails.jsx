import { ShieldAlert } from "lucide-react";

export default function LogDetails({ log }) {
  return (
    <div className="border-t border-white/[0.06] bg-navy-950/40 px-4 py-4">
      {log.anomaly && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-risk-critical/30 bg-risk-critical/10 px-3 py-2">
          <ShieldAlert className="h-4 w-4 text-risk-critical" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-risk-critical">
            Threat Detected — flagged as anomalous by the detection engine
          </span>
        </div>
      )}

      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Event ID", log.id],
          ["Category", log.category || "—"],
          ["Risk Score", log.riskScore ?? "—"],
          ["Destination", log.destination || "not tracked for this event type"],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="font-mono text-[9.5px] uppercase tracking-wider text-navy-500">{label}</p>
            <p className="mt-0.5 font-mono text-[12px] text-navy-50">{String(value)}</p>
          </div>
        ))}
      </div>

      <p className="mb-1.5 font-mono text-[9.5px] uppercase tracking-wider text-navy-500">Full Event JSON</p>
      <pre className="max-h-64 overflow-auto rounded-lg border border-white/[0.06] bg-navy-950/70 p-3 font-mono text-[11px] leading-relaxed text-navy-100/85">
        {JSON.stringify(log.raw, null, 2)}
      </pre>
    </div>
  );
}