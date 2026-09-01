export default function ThreatTimeline({ events, source }) {
  if (!events?.length) {
    return <p className="py-6 text-center text-[12.5px] text-navy-400">No timeline events available.</p>;
  }

  return (
    <div>
      <p className="mb-3 font-mono text-[9.5px] uppercase tracking-wider text-navy-500">
        {source === "live" ? "Reconstructed from real log events for this IP" : "Reconstructed sequence (no matching logs found)"}
      </p>
      <div className="space-y-0">
        {events.map((e, i) => (
          <div key={e.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="h-2 w-2 shrink-0 rounded-full bg-command-cyan" />
              {i < events.length - 1 && <span className="w-px flex-1 bg-white/[0.08]" />}
            </div>
            <div className="pb-4">
              <p className="font-mono text-[11px] text-navy-500">
                {e.timestamp ? new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
              </p>
              <p className="text-[13px] text-navy-100">{e.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}