import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getAiConfidence } from "../../services/analyticsService";

const COLOR = { "Fraud AI": "#5B8CFF", "Behavioral AI": "#8B7CF6", Combined: "#22D3EE" };

export default function AIConfidenceChart() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAiConfidence().then((res) => {
      if (!mounted) return;
      setItems([
        { name: "Fraud AI", score: res.data.fraud ?? 0 },
        { name: "Behavioral AI", score: res.data.behavioral ?? 0 },
        { name: "Combined", score: res.data.combined ?? 0 },
      ]);
    });
    return () => { mounted = false; };
  }, []);

  if (!items) return <p className="py-8 text-center text-[12px] text-navy-400">Scoring…</p>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={items} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "#8B96AC", fontSize: 10.5 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: "#4C5A78", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} width={32} />
        <Tooltip contentStyle={{ background: "#0B1220", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 10, fontSize: 12 }} />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {items.map((it) => <Cell key={it.name} fill={COLOR[it.name]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}