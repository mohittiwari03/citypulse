import { useRef } from "react";
import { Thermometer } from "lucide-react";

// ── Condition colour themes (on dark card) ─────────────────────────────────
function getTheme(icon = "") {
  const code = icon.replace("d", "").replace("n", "");
  if (["09", "10"].includes(code)) return { accent: "#60a5fa", label: "Rainy",   glow: "rgba(96,165,250,0.15)" };
  if (["11"].includes(code))       return { accent: "#a78bfa", label: "Stormy",  glow: "rgba(167,139,250,0.15)" };
  if (["13"].includes(code))       return { accent: "#93c5fd", label: "Snowy",   glow: "rgba(147,197,253,0.15)" };
  if (["50"].includes(code))       return { accent: "#94a3b8", label: "Misty",   glow: "rgba(148,163,184,0.12)" };
  if (["02","03","04"].includes(code)) return { accent: "#94a3b8", label: "Cloudy", glow: "rgba(148,163,184,0.10)" };
  return { accent: "#fde047", label: "Clear", glow: "rgba(253,224,71,0.15)" };
}

export default function WeatherCard({ data }) {
  const cardRef = useRef(null);

  if (!data) return null;

  const theme   = getTheme(data.icon);
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

  return (
    <div
      ref={cardRef}
      className="card-dark p-6 animate-fade-up h-full relative overflow-hidden flex flex-col justify-between"
    >
      {/* Condition glow */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${theme.glow}, transparent 70%)` }}
      />

      <div className="relative flex flex-col gap-4">
        {/* Condition badge */}
        <div>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full inline-block"
            style={{
              color: theme.accent,
              border: `1px solid ${theme.accent}33`,
              background: `${theme.accent}15`,
            }}
          >
            {theme.label}
          </span>
        </div>

        {/* Location Info (Format: country · city) */}
        <div className="text-sm font-medium text-white/50 tracking-wide mt-1">
          {data.country} · {data.city}
        </div>

      {/* Temperature */}
      <div className="flex items-end gap-3 mb-5 pb-5 border-b border-border relative">
        <span className="text-7xl font-extrabold leading-none" style={{ color: theme.accent }}>
          {data.temp}°
        </span>
        <div className="mb-2">
          <p className="text-muted text-xs font-mono">CELSIUS</p>
          <p className="text-ink text-sm flex items-center gap-1">
            <Thermometer size={13} style={{ color: theme.accent }} />
            Feels {data.feels_like}°C
          </p>
        </div>
      </div>

        {/* Feels Like description */}
        <div className="text-sm font-medium text-white/60">
          Feels like {data.feels_like}°C
        </div>

        {/* Stats Grid - 2 columns for Humidity and Wind */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xs text-white/40 font-medium">Humidity</span>
            <span className="text-lg font-semibold text-white mt-1">{data.humidity}%</span>
          </div>
          <div className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xs text-white/40 font-medium">Wind</span>
            <span className="text-lg font-semibold text-white mt-1">{data.wind_speed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
