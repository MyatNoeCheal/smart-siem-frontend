import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getThreatTypeBreakdown } from "../../services/analyticsService";

const COLORS = ["#5B8CFF", "#22D3EE", "#8B7CF6", "#F5A623", "#FB4B5D", "#F5D547", "#33D69F", "#4C5A78"];

export default function ThreatTypesChart() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let mounted = true;
    getThreatTypeBreakdown().then((res) => mounted && setItems(res.data));
    return () => { mounted = false; };
  }, []);

  if (items === null) return <p className="py-8 text-center text-[12px] text-navy-400">Loading…</p>;
  if (!items.length) return <p className="py-8 text-center text-[12px] text-navy-400">No threat types recorded yet.</p>;

  const chartData = items.map((it) => ({ type: it.type, "Occurrences": it.count }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fill: "#8B96AC", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="type" width={110} tick={{ fill: "#8B96AC", fontSize: 10.5 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(148,163,184,0.08)" }}
          contentStyle={{ background: "#0B1220", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 8, fontSize: 11, padding: "6px 10px" }}
          labelStyle={{ color: "#8B96AC", marginBottom: 2 }}
          itemStyle={{ color: "#22D3EE", padding: 0 }}
        />
        <Bar dataKey="Occurrences" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}