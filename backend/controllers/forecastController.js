import axios from "axios";

export const getForecast = async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const { data } = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: { q: city, appid: process.env.OPENWEATHER_API_KEY, units: "metric" },
        timeout: 8000,
      }
    );

    // Group 3-hour slots by day → pick noon slot, aggregate min/max
    const days = {};
    for (const item of data.list) {
      const date = item.dt_txt.split(" ")[0];
      if (!days[date]) {
        days[date] = { temps: [], icons: [], descriptions: [] };
      }
      days[date].temps.push(item.main.temp);
      days[date].icons.push(item.weather[0].icon);
      days[date].descriptions.push(item.weather[0].description);
    }

    const forecast = Object.entries(days)
      .slice(0, 5)
      .map(([date, d]) => ({
        date,
        min:  Math.round(Math.min(...d.temps)),
        max:  Math.round(Math.max(...d.temps)),
        avg:  Math.round(d.temps.reduce((a, b) => a + b, 0) / d.temps.length),
        icon: d.icons[Math.floor(d.icons.length / 2)],
        description: d.descriptions[Math.floor(d.descriptions.length / 2)],
        day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      }));

    res.json({ city: data.city.name, forecast });
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.message || "Forecast unavailable",
    });
  }
};
