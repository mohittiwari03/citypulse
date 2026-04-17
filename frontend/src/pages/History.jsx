import { useEffect, useState } from "react";
import { fetchHistory, deleteHistory } from "../services/api";
import { History, Trash2, Cloud, MapPin, Loader2, Newspaper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function HistoryCard({ item, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="card p-4 flex flex-col gap-3 animate-fade-up hover:border-gold/40 transition-all">
      {/* City + Date */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-muted text-xs font-mono mb-1">
            <MapPin size={11} />
            {item.weather?.country || "—"}
          </div>
          <h3 className="text-lg font-extrabold text-ink capitalize">{item.city}</h3>
          <p className="text-xs text-muted font-mono mt-0.5">
            {new Date(item.updatedAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <button
          onClick={() => onDelete(item._id)}
          className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/10
                     transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Weather snapshot */}
      {item.weather && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-bg/60 border border-border">
          {item.weather.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${item.weather.icon}.png`}
              alt={item.weather.description}
              className="w-10 h-10"
            />
          )}
          <div>
            <p className="text-xl font-extrabold text-gold">{item.weather.temp}°C</p>
            <p className="text-xs text-muted capitalize">{item.weather.description}</p>
          </div>
          <div className="ml-auto text-right text-xs font-mono text-muted">
            <p>💧 {item.weather.humidity}%</p>
            <p>💨 {item.weather.wind_speed} m/s</p>
          </div>
        </div>
      )}

      {/* News headlines */}
      {item.newsHeadlines?.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted font-mono mb-1.5">
            <Newspaper size={11} />
            Top headlines
          </div>
          <ul className="space-y-1">
            {item.newsHeadlines.slice(0, 2).map((h, i) => (
              <li key={i} className="text-xs text-ink/70 leading-snug line-clamp-1 pl-2
                                     border-l-2 border-gold/30">
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchHistory()
      .then(setSearches)
      .catch(() => toast.error("Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    try {
      await deleteHistory(id);
      setSearches((prev) => prev.filter((s) => s._id !== id));
      toast.success("Removed from history");
    } catch {
      toast.error("Could not delete");
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 animate-fade-up">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30
                          flex items-center justify-center">
            <History size={18} className="text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-ink">Search History</h1>
            <p className="text-muted text-sm font-mono">
              {searches.length} cities saved in MongoDB
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-gold" />
          </div>
        )}

        {/* Empty */}
        {!loading && searches.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border
                            flex items-center justify-center mx-auto mb-4">
              <Cloud size={24} className="text-muted" />
            </div>
            <p className="text-muted font-mono text-sm">
              No searches yet. Go search a city!
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && searches.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searches.map((item) => (
              <HistoryCard key={item._id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
