import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function ThreatSeverityChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-[150px] w-[150px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={70} paddingAngle={3} stroke="none">
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0B1220", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 10, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-semibold text-navy-50">{total}</span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-navy-400">Total</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
              <span className="text-navy-100/80">{d.name}</span>
            </div>
            <span className="font-mono text-navy-400">{total ? Math.round((d.value / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}