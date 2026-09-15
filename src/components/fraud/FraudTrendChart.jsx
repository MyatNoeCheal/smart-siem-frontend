import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FraudTrendChart({ data }) {
  if (!data?.length) return <EmptyChart />;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fraudGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(255 255 255 / 0.06)" />
        <XAxis dataKey="date" stroke="#6ea082" fontSize={11} />
        <YAxis stroke="#6ea082" fontSize={11} />
        <Tooltip
          contentStyle={{ background: '#08120c', border: '1px solid rgb(43 255 136 / 0.2)', borderRadius: 8, fontSize: 12 }}
        />
        <Area type="monotone" dataKey="fraud_count" stroke="#f43f5e" fill="url(#fraudGradient)" strokeWidth={2} name="Fraud Cases" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function EmptyChart() {
  return <div className="flex h-[240px] items-center justify-center text-xs text-navy-400">No trend data</div>;
}