import {
  ResponsiveContainer, XAxis, YAxis,
  Tooltip, CartesianGrid, Area, AreaChart,
} from "recharts";
import { CalendarDays } from "lucide-react";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 border border-white/10 backdrop-blur-xl px-3 py-2 text-xs font-mono rounded-xl shadow-2xl">
      <p className="text-muted mb-1">{label}</p>
      <p className="text-blue-400">↑ {payload[1]?.value}°C</p>
      <p className="text-indigo-400">↓ {payload[0]?.value}°C</p>
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
        <CalendarDays size={18} className="text-blue-400" />
        <h2 className="font-semibold text-white">5-day forecast</h2>
      </div>

      {/* Day icons row */}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {forecast.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xs font-medium text-white/55">{d.day}</span>
            <img
              src={`https://openweathermap.org/img/wn/${d.icon}.png`}
              alt={d.description}
              className="w-8 h-8 drop-shadow-md"
            />
            <span className="text-xs font-bold text-white">{d.max}°</span>
          </div>
        ))}
      </div>

      {/* Recharts temperature chart */}
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#818cf8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.05)" }} />
            <Area type="monotone" dataKey="min" stroke="#818cf8" strokeWidth={2} fill="url(#minGrad)" dot={false} />
            <Area type="monotone" dataKey="max" stroke="#3b82f6" strokeWidth={2} fill="url(#maxGrad)"
              dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
