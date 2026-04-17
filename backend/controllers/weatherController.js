import axios from "axios";

export const getWeather = async (req, res) => {
  const { city } = req.query;

  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const { data } = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
        },
        timeout: 8000,
      }
    );

    const weather = {
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      visibility: Math.round((data.visibility || 0) / 1000),
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    };

    res.json(weather);
  } catch (err) {
    const msg = err.response?.data?.message || "Could not fetch weather";
    res.status(err.response?.status || 500).json({ error: msg });
  }
};
