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
          {/* Search input with integrated geolocation */}
          <div className="relative flex-1 flex items-center">
            <button
              type="button"
              onClick={detectLocation}
              disabled={loading || geoLoad}
              title="Use my location"
              className="absolute left-4 z-10 text-muted hover:text-white transition-colors"
            >
              {geoLoad ? (
                <Loader2 size={18} className="animate-spin text-blue-400" />
              ) : (
                <LocateFixed size={18} />
              )}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter any city — Mumbai, London, Tokyo..."
              className="input-field pl-12 pr-32 h-14 text-base rounded-2xl"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white font-semibold py-2 px-5 h-10 rounded-xl flex items-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
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
            className="text-xs font-medium px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-150"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
