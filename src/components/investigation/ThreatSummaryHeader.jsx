import StatusBadge from "../ui/StatusBadge";

function Field({ label, value }) {
  return (
    <div>
      <p className="font-mono text-[9.5px] uppercase tracking-wider text-navy-500">{label}</p>
      <p className="mt-0.5 truncate font-mono text-[13px] text-navy-50">{value ?? "—"}</p>
    </div>
  );
}

export default function ThreatSummaryHeader({ threat, investigationStatus }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
      <Field label="Threat ID" value={threat.id} />
      <Field label="Threat Type" value={threat.type} />
      <div>
        <p className="font-mono text-[9.5px] uppercase tracking-wider text-navy-500">Severity</p>
        <div className="mt-1"><StatusBadge level={threat.severity} /></div>
      </div>
      <Field label="Risk Score" value={`${threat.riskScore ?? "—"} / 100`} />
      <Field label="Confidence (estimated)" value={threat.confidence != null ? `${threat.confidence}%` : "—"} />
      <Field label="Detection Model" value={threat.detectionModel} />
      <div>
        <p className="font-mono text-[9.5px] uppercase tracking-wider text-navy-500">Status</p>
        <p className="mt-1 font-mono text-[12px] capitalize text-command-cyan">{investigationStatus.replace("_", " ")}</p>
      </div>
      <Field label="First Seen" value={threat.firstSeen ? new Date(threat.firstSeen).toLocaleString() : "—"} />
      <Field label="Last Seen" value={threat.lastSeen ? new Date(threat.lastSeen).toLocaleString() : "—"} />
    </div>
  );
}