import { useRef } from "react";
import {
  Droplets, Wind, Eye, Thermometer, MapPin, Sunrise, Sunset, Share2, Loader2,
} from "lucide-react";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

// ── Condition colour themes ──────────────────────────────────────────────────
function getTheme(icon = "") {
  const code = icon.replace("d", "").replace("n", "");
  if (["09", "10"].includes(code)) return { accent: "#60a5fa", label: "Rainy",   glow: "rgba(96,165,250,0.08)"  };
  if (["11"].includes(code))       return { accent: "#a78bfa", label: "Stormy",  glow: "rgba(167,139,250,0.08)" };
  if (["13"].includes(code))       return { accent: "#e0f2fe", label: "Snowy",   glow: "rgba(224,242,254,0.08)" };
  if (["50"].includes(code))       return { accent: "#94a3b8", label: "Misty",   glow: "rgba(148,163,184,0.08)" };
  if (["02","03","04"].includes(code)) return { accent: "#cbd5e1", label: "Cloudy", glow: "rgba(203,213,225,0.06)" };
  return { accent: "#e8b84b", label: "Clear", glow: "rgba(232,184,75,0.08)" };
}

function StatBox({ icon, label, value, accent }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-xl bg-bg/50 border border-border">
      <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "#4a6075" }}>
        {icon}{label}
      </div>
      <span className="text-sm font-semibold" style={{ color: "#c8d8e8" }}>{value}</span>
    </div>
  );
}

function formatTime(unix) {
  if (!unix) return "—";
  return new Date(unix * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function WeatherCard({ data }) {
  const cardRef = useRef(null);

  if (!data) return null;

  const theme   = getTheme(data.icon);
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

  async function handleShare() {
    if (!cardRef.current) return;
    const toastId = toast.loading("Generating image...");
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0f1720",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link    = document.createElement("a");
      link.download = `citypulse-${data.city.toLowerCase()}.png`;
      link.href     = canvas.toDataURL("image/png");
      link.click();
      toast.success("Card downloaded!", { id: toastId });
    } catch {
      toast.error("Could not generate image", { id: toastId });
    }
  }

  return (
    <div
      ref={cardRef}
      className="card p-6 animate-fade-up h-full relative overflow-hidden"
      style={{ borderColor: `${theme.accent}33` }}
    >
      {/* Condition glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${theme.glow}, transparent 70%)` }}
      />

      {/* Condition badge + Share */}
      <div className="flex items-center justify-between mb-4 relative">
        <span
          className="text-xs font-mono px-2.5 py-1 rounded-full border"
          style={{ color: theme.accent, borderColor: `${theme.accent}44`, background: `${theme.accent}11` }}
        >
          {theme.label}
        </span>
        <button
          onClick={handleShare}
          title="Download as PNG"
          className="flex items-center gap-1.5 text-xs font-mono text-muted
                     hover:text-gold transition-colors border border-border
                     hover:border-gold px-2.5 py-1 rounded-full"
        >
          <Share2 size={11} /> Share
        </button>
      </div>

      {/* City + Icon */}
      <div className="flex items-start justify-between mb-1 relative">
        <div>
          <div className="flex items-center gap-1.5 text-muted text-sm mb-1">
            <MapPin size={13} />
            <span className="font-mono">{data.country}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-ink leading-tight">{data.city}</h2>
          <p className="text-muted text-sm mt-0.5 capitalize">{data.description}</p>
        </div>
        <img src={iconUrl} alt={data.description} className="w-16 h-16 -mt-2 drop-shadow-lg" />
      </div>

      {/* Temperature */}
      <div className="flex items-end gap-3 mb-5 pb-5 border-b border-border relative">
        <span className="text-5xl sm:text-7xl font-extrabold leading-none" style={{ color: theme.accent }}>
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4 relative">
        <StatBox icon={<Droplets size={12} />} label="Humidity"   value={`${data.humidity}%`}       accent={theme.accent} />
        <StatBox icon={<Wind size={12} />}     label="Wind"       value={`${data.wind_speed} m/s`}   accent={theme.accent} />
        <StatBox icon={<Eye size={12} />}      label="Visibility" value={`${data.visibility} km`}    accent={theme.accent} />
        <StatBox icon={<Thermometer size={12} />} label="Feels Like" value={`${data.feels_like}°C`} accent={theme.accent} />
      </div>

      {/* Sunrise / Sunset */}
      {(data.sunrise || data.sunset) && (
        <div className="flex justify-between pt-3 border-t border-border text-sm relative">
          <div className="flex items-center gap-1.5 text-muted">Sunrise
            <Sunrise size={14} style={{ color: theme.accent }} />
            <span className="font-mono">{formatTime(data.sunrise)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted">Sunset 
            <Sunset size={14} className="text-teal" />
            <span className="font-mono">{formatTime(data.sunset)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
