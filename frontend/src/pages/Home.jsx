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
    <div className="flex items-center gap-1.5 text-xs font-medium text-white/70 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm"
         style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
      {icon}{label}
    </div>
  );
}

export default function Home() {
  const { city, weather, news, forecast, loading, error, search } = useCity();

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 relative">
      {/* Animated weather background */}

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Hero - Hidden when showing search results */}
        {!weather && (
          <div className="text-center mb-10 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10
                            text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4"
                 style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              <Zap size={11} />
              Powered by Mistral AI + Real-Time APIs
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-3 leading-tight text-white">
              Your City,{" "}
              <span className="text-blue-300">Intelligently</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-6">
              Real-time weather, live news, and an AI assistant — all for any city in the world.
            </p>
            <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
              <FeaturePill icon={<Cloud size={11} />}     label="Live Weather" />
              <FeaturePill icon={<Newspaper size={11} />}  label="Top News" />
              <FeaturePill icon={<Bot size={11} />}        label="AI Chat" />
            </div>
          </div>
<<<<<<< HEAD
        )}
=======
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
>>>>>>> 525512e06bc11e8dc77691d1a8ed065dfb501ff4

        {/* Search */}
        <SearchBar onSearch={search} loading={loading} />

        {/* Error */}
        {error && (
          <div className="mt-6 max-w-md mx-auto text-center text-sm text-danger
                          bg-red-50 rounded-xl px-4 py-3"
               style={{ border: "1px solid rgba(239,68,68,0.15)" }}>
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
            <div className="w-20 h-20 rounded-3xl bg-white
                            flex items-center justify-center mx-auto mb-4 shadow-card">
              <Cloud size={32} className="text-muted" />
            </div>
            <p className="text-muted text-sm">Search any city above to get started</p>
          </div>
        )}
      </div>

      {/* Floating AI Chat */}
      <ChatBot city={city} />
    </div>
  );
}
