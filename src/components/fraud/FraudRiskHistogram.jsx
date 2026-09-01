import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

function binColor(range) {
  const start = parseInt(range.split("-")[0], 10);
  if (start >= 85) return "#FB4B5D";
  if (start >= 60) return "#F5A623";
  if (start >= 30) return "#F5D547";
  return "#33D69F";
}

export default function FraudRiskHistogram({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="range" tick={{ fill: "#4C5A78", fontSize: 9, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#4C5A78", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
        <Tooltip contentStyle={{ background: "#0B1220", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 10, fontSize: 12 }} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {data.map((d) => <Cell key={d.range} fill={binColor(d.range)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}