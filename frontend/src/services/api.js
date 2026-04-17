import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 15000,
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("citypulse_user") || "null");
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const fetchWeather  = (city) => api.get("/weather",  { params: { city } }).then(r => r.data);
export const fetchNews     = (city) => api.get("/news",     { params: { city } }).then(r => r.data);
export const fetchForecast = (city) => api.get("/forecast", { params: { city } }).then(r => r.data);

export const fetchTips = (weather) =>
  api.get("/tips", {
    params: {
      city:        weather.city,
      temp:        weather.temp,
      description: weather.description,
      humidity:    weather.humidity,
      wind_speed:  weather.wind_speed,
    },
  }).then(r => r.data);

export const sendChat       = (message, city, chatId) => api.post("/chat", { message, city, chatId }).then(r => r.data);
export const saveSearch     = (city, weather, newsHeadlines) => api.post("/history", { city, weather, newsHeadlines }).then(r => r.data);
export const fetchHistory   = () => api.get("/history").then(r => r.data);
export const deleteHistory  = (id) => api.delete(`/history/${id}`).then(r => r.data);
