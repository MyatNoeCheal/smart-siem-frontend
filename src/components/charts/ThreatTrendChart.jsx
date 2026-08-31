import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ThreatTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="eventsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5B8CFF" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#5B8CFF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="anomaliesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FB4B5D" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#FB4B5D" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis
          dataKey="hour"
          tick={{ fill: "#4C5A78", fontSize: 10, fontFamily: "IBM Plex Mono" }}
          axisLine={false}
          tickLine={false}
          interval={3}
        />
        <YAxis
          tick={{ fill: "#4C5A78", fontSize: 10, fontFamily: "IBM Plex Mono" }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          contentStyle={{
            background: "#0B1220",
            border: "1px solid rgba(148,163,184,0.15)",
            borderRadius: 10,
            fontSize: 12,
          }}
          labelStyle={{ color: "#8B96AC" }}
        />
        <Area
          type="monotone"
          dataKey="events"
          stroke="#5B8CFF"
          strokeWidth={2}
          fill="url(#eventsGradient)"
          name="Events"
        />
        <Area
          type="monotone"
          dataKey="anomalies"
          stroke="#FB4B5D"
          strokeWidth={2}
          fill="url(#anomaliesGradient)"
          name="Anomalies"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}