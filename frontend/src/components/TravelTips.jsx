import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { fetchTips } from "../services/api";

export default function TravelTips({ weather }) {
  const [tips, setTips]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!weather) return;
    setLoading(true);
    setTips([]);
    setError("");

    fetchTips(weather)
      .then((data) => setTips(data.tips || []))
      .catch(() => setError("Could not load tips"))
      .finally(() => setLoading(false));
  }, [weather?.city]);

  if (!weather) return null;

  return (
    <div className="card p-5 animate-fade-up">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-blue-400" />
        <h2 className="font-semibold text-white">AI travel tips</h2>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted py-4">
          <Loader2 size={14} className="animate-spin text-blue-400" />
          <span className="text-xs">Generating tips for {weather.city}...</span>
        </div>
      )}

      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}

      {!loading && tips.length > 0 && (
        <div className="flex flex-col gap-3">
          {tips.map((t, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-900/35 border border-blue-500/10 hover:border-blue-500/25 transition-all duration-200 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <p className="text-sm text-white font-medium leading-relaxed">{t.tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
