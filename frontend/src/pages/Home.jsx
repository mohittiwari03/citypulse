import { Cloud, Newspaper, Bot, Zap } from "lucide-react";
import SearchBar        from "../components/SearchBar";
import WeatherCard      from "../components/WeatherCard";
import NewsCard         from "../components/NewsCard";
import ForecastCard     from "../components/ForecastCard";
import TravelTips       from "../components/TravelTips";
import ChatBot          from "../components/ChatBot";
import Loader           from "../components/Loader";
import WeatherBackground from "../components/WeatherBackground";
import { useCity }      from "../hooks/useCity";

function FeaturePill({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-mono text-muted border border-border px-3 py-1.5 rounded-full">
      {icon}{label}
    </div>
  );
}

export default function Home() {
  const { city, weather, news, forecast, loading, error, search } = useCity();

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 relative">
      {/* Animated weather background */}
      <WeatherBackground icon={weather?.icon} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Hero */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30
                          text-gold text-xs font-mono px-3 py-1.5 rounded-full mb-4">
            <Zap size={11} />
            Powered by Mistral AI + Real-Time APIs
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3 leading-tight">
            Your City,{" "}
            <span className="text-gold">Intelligently</span>
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto mb-6">
            Real-time weather, live news, and an AI assistant — all for any city in the world.
          </p>
          <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
            <FeaturePill icon={<Cloud size={11} />}     label="Live Weather" />
            <FeaturePill icon={<Newspaper size={11} />}  label="Top News" />
            <FeaturePill icon={<Bot size={11} />}        label="AI Chat" />
          </div>
        </div>

        {/* Search */}
        <SearchBar onSearch={search} loading={loading} />

        {/* Error */}
        {error && (
          <div className="mt-6 max-w-md mx-auto text-center text-sm text-red-400
                          bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Skeleton */}
        {loading && <Loader />}

        {/* Results */}
        {!loading && weather && (
          <div className="mt-8 space-y-6">

            {/* Row 1 — Weather + News */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <WeatherCard data={weather} />
              </div>
              <div className="lg:col-span-2">
                <NewsCard articles={news} city={city} />
              </div>
            </div>

            {/* Row 2 — Forecast + Travel Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ForecastCard forecast={forecast} />
              <TravelTips   weather={weather} />
            </div>

          </div>
        )}

        {/* Empty state */}
        {!loading && !weather && !error && (
          <div className="mt-16 text-center">
            <div className="w-20 h-20 rounded-3xl bg-surface border border-border
                            flex items-center justify-center mx-auto mb-4">
              <Cloud size={32} className="text-muted" />
            </div>
            <p className="text-muted font-mono text-sm">Search any city above to get started</p>
          </div>
        )}
      </div>

      {/* Floating AI Chat */}
      <ChatBot city={city} />
    </div>
  );
}
