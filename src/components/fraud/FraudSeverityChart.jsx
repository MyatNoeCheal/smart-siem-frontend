import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = { Low: '#33D69F', Medium: '#F5D547', High: '#F5A623', Critical: '#FB4B5D' };

export default function FraudSeverityChart({ data }) {
  if (!data?.length) return <div className="flex h-[240px] items-center justify-center text-xs text-navy-400">No data</div>;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#6EA082'} stroke="#08120C" />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: '#08120c', border: '1px solid rgb(43 255 136 / 0.2)', borderRadius: 8, fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}