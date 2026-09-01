import StatusBadge from "../ui/StatusBadge";

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] py-2.5 last:border-0">
      <span className="text-[12px] text-navy-400">{label}</span>
      <span className="font-mono text-[12.5px] text-navy-50">{value ?? "—"}</span>
    </div>
  );
}

export default function UserDetailPanel({ user, source, loading }) {
  if (loading) return <p className="py-8 text-center text-[12.5px] text-navy-400">Scoring user…</p>;
  if (!user) return <p className="py-8 text-center text-[12.5px] text-navy-400">Click a node in the network to inspect a user.</p>;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-[15px] font-semibold text-navy-50">{user.userId}</p>
        <StatusBadge level={user.riskLevel}>{user.riskLevel}</StatusBadge>
      </div>
      <Row label="Risk Score" value={`${user.riskScore ?? "—"} / 100`} />
      <Row label="Threat Level" value={user.riskLevel} />
      <Row label="Total Events" value={user.totalEvents} />
      <Row label="Email Activity" value={user.emailActivity} />
      <Row label="Login Activity" value={user.loginActivity} />
      <Row label="File Activity" value={user.fileActivity} />
      <Row label="Last Activity" value={user.lastActivity ? new Date(user.lastActivity).toLocaleString() : "—"} />
      <Row label="AI Anomaly Score" value={user.aiAnomalyScore != null ? `${user.aiAnomalyScore} / 100` : "not enough sequence history"} />
      <p className="mt-3 font-mono text-[9.5px] uppercase tracking-wider text-navy-500">
        {source === "live" ? "live behavior + hybrid-risk model" : "mock — no live data for this user"}
      </p>
    </div>
  );
}