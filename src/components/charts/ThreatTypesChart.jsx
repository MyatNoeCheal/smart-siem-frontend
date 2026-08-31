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

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={items} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" horizontal={false} />
        <XAxis type="number" tick={{ fill: "#4C5A78", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="type" width={110} tick={{ fill: "#8B96AC", fontSize: 10.5 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: "#0B1220", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 10, fontSize: 12 }} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}