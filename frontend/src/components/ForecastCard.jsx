import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, Area, AreaChart,
} from "recharts";
import { TrendingUp } from "lucide-react";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs font-mono shadow-xl">
      <p className="text-muted mb-1">{label}</p>
      <p className="text-gold">↑ {payload[1]?.value}°C</p>
      <p className="text-teal">↓ {payload[0]?.value}°C</p>
    </div>
  );
}

export default function ForecastCard({ forecast }) {
  if (!forecast?.length) return null;

  const chartData = forecast.map((d) => ({
    day: d.day,
    min: d.min,
    max: d.max,
    avg: d.avg,
  }));

  return (
    <div className="card p-5 animate-fade-up">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-gold" />
        <h2 className="font-bold text-ink">5-Day Forecast</h2>
      </div>

      {/* Day icons row */}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {forecast.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 p-2
                                  rounded-xl bg-bg/50 border border-border">
            <span className="text-xs font-mono text-muted">{d.day}</span>
            <img
              src={`https://openweathermap.org/img/wn/${d.icon}.png`}
              alt={d.description}
              className="w-8 h-8"
            />
            <span className="text-xs font-bold text-gold">{d.max}°</span>
            <span className="text-xs text-muted">{d.min}°</span>
          </div>
        ))}
      </div>

      {/* Recharts temperature chart */}
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#e8b84b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#e8b84b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#2dd4bf" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "#4a6075", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#4a6075", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#1e2d3d" }} />
            <Area type="monotone" dataKey="min" stroke="#2dd4bf" strokeWidth={2} fill="url(#minGrad)" dot={false} />
            <Area type="monotone" dataKey="max" stroke="#e8b84b" strokeWidth={2} fill="url(#maxGrad)"
              dot={{ fill: "#e8b84b", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
