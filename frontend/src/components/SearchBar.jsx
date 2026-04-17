import { useState } from "react";
import { Search, Loader2, LocateFixed } from "lucide-react";
import toast from "react-hot-toast";

const SUGGESTIONS = ["Mumbai","Delhi","Bangalore","London","New York","Tokyo","Paris","Dubai"];

export default function SearchBar({ onSearch, loading }) {
  const [input, setInput]   = useState("");
  const [geoLoad, setGeoLoad] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setGeoLoad(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${coords.latitude}&lon=${coords.longitude}&limit=1&appid=eb94b40fb313ce74aefe7c2f2be53afa`
          );
          const data = await res.json();
          const city = data[0]?.name || "Unknown";
          setInput(city);
          onSearch(city);
        } catch {
          toast.error("Could not detect city");
        } finally {
          setGeoLoad(false);
        }
      },
      () => { toast.error("Location access denied"); setGeoLoad(false); }
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-up">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center gap-2">
          {/* Geolocation button */}
          <button
            type="button"
            onClick={detectLocation}
            disabled={loading || geoLoad}
            title="Use my location"
            className="shrink-0 w-14 h-14 rounded-2xl border border-border bg-surface
                       flex items-center justify-center text-muted
                       hover:border-gold hover:text-gold active:scale-95
                       transition-all disabled:opacity-40"
          >
            {geoLoad
              ? <Loader2 size={18} className="animate-spin" />
              : <LocateFixed size={18} />}
          </button>

          {/* Search input */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter any city — Mumbai, London, Tokyo..."
              className="input-field pl-11 pr-32 h-14 text-base rounded-2xl"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-gold py-2 px-5 rounded-xl
                         flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </form>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setInput(s); onSearch(s); }}
            disabled={loading}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border
                       text-muted hover:text-gold hover:border-gold transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
