import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = { Low: '#34d399', Medium: '#facc15', High: '#fb923c', Critical: '#f43f5e' };

export default function FraudSeverityChart({ data }) {
  if (!data?.length) return <div className="h-[240px] flex items-center justify-center text-slate-500 text-xs">No data</div>;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#64748b'} stroke="#0f172a" />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}