import axios from "axios";

export const getNews = async (req, res) => {
  const { city } = req.query;

  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const { data } = await axios.post(
      "https://api.tavily.com/search",
      {
        api_key: process.env.TAVILY_API_KEY,
        query: `latest news in ${city}`,
        search_depth: "basic",
        max_results: 6,
        include_answer: false,
      },
      { timeout: 10000 }
    );

    const articles = (data.results || []).map((r) => ({
      title: r.title || "No title",
      url: r.url || "",
      snippet: (r.content || "").slice(0, 220),
      source: (() => {
        try {
          return new URL(r.url).hostname.replace("www.", "");
        } catch {
          return r.url || "";
        }
      })(),
      published: r.published_date || null,
    }));

    res.json({ city, articles });
  } catch (err) {
    const msg = err.response?.data?.message || "Could not fetch news";
    res.status(err.response?.status || 500).json({ error: msg });
  }
};
