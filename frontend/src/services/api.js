import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (baseURL !== "http://localhost:5000/api" && !baseURL.endsWith("/api")) {
  baseURL = baseURL.replace(/\/$/, "") + "/api";
}

const api = axios.create({
  baseURL,
  timeout: 15000,
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("citypulse_user") || "null");
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// Intercept network/down errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response || error.code === "ERR_NETWORK" || error.message === "Network Error") {
      window.dispatchEvent(new CustomEvent("api-server-down"));
    }
    return Promise.reject(error);
  }
);

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

export const fetchHistory = async () => {
  const user = JSON.parse(localStorage.getItem("citypulse_user") || "null");
  if (user?.token) return api.get("/history").then(r => r.data);
  return JSON.parse(localStorage.getItem("citypulse_history") || "[]");
};

export const saveSearch = async (city, weather, newsHeadlines) => {
  const user = JSON.parse(localStorage.getItem("citypulse_user") || "null");
  if (user?.token) return api.post("/history", { city, weather, newsHeadlines }).then(r => r.data);

  let history = JSON.parse(localStorage.getItem("citypulse_history") || "[]");
  const existingIndex = history.findIndex(h => h.city.toLowerCase() === city.toLowerCase());
  
  const newEntry = {
    _id: existingIndex !== -1 ? history[existingIndex]._id : Date.now().toString(),
    city: city.toLowerCase(),
    weather,
    newsHeadlines,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex !== -1) {
    history[existingIndex] = newEntry;
  } else {
    history.push(newEntry);
  }
  history.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  history = history.slice(0, 20); // keep recent 20
  localStorage.setItem("citypulse_history", JSON.stringify(history));
  return newEntry;
};

export const deleteHistory = async (id) => {
  const user = JSON.parse(localStorage.getItem("citypulse_user") || "null");
  if (user?.token) return api.delete(`/history/${id}`).then(r => r.data);
  
  let history = JSON.parse(localStorage.getItem("citypulse_history") || "[]");
  history = history.filter(h => h._id !== id);
  localStorage.setItem("citypulse_history", JSON.stringify(history));
  return { message: "Deleted" };
};

export const sendChat = (message, city, chatId, history = []) => 
  api.post("/chat", { message, city, chatId, history }).then(r => r.data);

export const checkHealth = () => api.get("/health").then(r => r.data);
