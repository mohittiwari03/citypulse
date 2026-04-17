import { useState, useCallback } from "react";
import { fetchWeather, fetchNews, fetchForecast, saveSearch } from "../services/api";
import toast from "react-hot-toast";

export function useCity() {
  const [city, setCity]         = useState("");
  const [weather, setWeather]   = useState(null);
  const [news, setNews]         = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const search = useCallback(async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);
    setNews([]);
    setForecast([]);

    try {
      const [weatherData, newsData, forecastData] = await Promise.all([
        fetchWeather(query),
        fetchNews(query),
        fetchForecast(query),
      ]);

      setCity(query);
      setWeather(weatherData);
      setNews(newsData.articles || []);
      setForecast(forecastData.forecast || []);

      const headlines = (newsData.articles || []).slice(0, 3).map(a => a.title);
      await saveSearch(query, weatherData, headlines).catch(() => {});
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong. Try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { city, weather, news, forecast, loading, error, search };
}
