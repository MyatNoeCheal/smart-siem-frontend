function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] py-2.5 last:border-0">
      <span className="text-[12px] text-navy-400">{label}</span>
      <span className="max-w-[60%] truncate text-right font-mono text-[12.5px] text-navy-50">{value ?? "—"}</span>
    </div>
  );
}

export default function ThreatDetailsPanel({ threat }) {
  return (
    <div>
      <Row label="Entity" value={threat.ip} />
      <Row label="Source" value={threat.ip} />
      <Row label="Destination" value="Application Server" />
      <Row label="Event Type" value={threat.type} />
      <Row label="IP Address" value={threat.ip} />
      <Row label="User" value={threat.userId || "unauthenticated / not attributed"} />
      <Row label="Timestamp" value={threat.lastSeen ? new Date(threat.lastSeen).toLocaleString() : "—"} />
      <Row label="Risk Score" value={`${threat.riskScore ?? "—"} / 100`} />
      <Row label="AI Model" value={threat.detectionModel} />
      <Row label="Confidence" value={threat.confidence != null ? `${threat.confidence}% (estimated)` : "—"} />
    </div>
  );
}