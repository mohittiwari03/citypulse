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
        <Sparkles size={16} className="text-gold" />
        <h2 className="font-bold text-ink">AI Travel Tips</h2>
        <span className="ml-auto text-xs font-mono text-muted bg-surface border border-border px-2 py-0.5 rounded-full">
          Mistral AI
        </span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted py-4">
          <Loader2 size={14} className="animate-spin text-gold" />
          <span className="font-mono text-xs">Generating tips for {weather.city}...</span>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 font-mono">{error}</p>
      )}

      {!loading && tips.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tips.map((t, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl bg-bg/50 border border-border
                         hover:border-gold/30 transition-colors animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="text-xl leading-none mt-0.5">{t.icon}</span>
              <p className="text-sm text-ink/80 leading-snug">{t.tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
