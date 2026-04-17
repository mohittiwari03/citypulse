import axios from "axios";
import Chat from "../models/Chat.js";

// ── call Mistral directly ─────────────────────────────────────────────────────
async function askMistral(messages) {
  const { data } = await axios.post(
    "https://api.mistral.ai/v1/chat/completions",
    {
      model: "mistral-small-latest",
      messages,
      temperature: 0.7,
      max_tokens: 600,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    }
  );
  return data.choices[0].message.content;
}

// ── fetch weather context ─────────────────────────────────────────────────────
async function fetchWeatherContext(city) {
  try {
    const { data } = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: { q: city, appid: process.env.OPENWEATHER_API_KEY, units: "metric" },
        timeout: 6000,
      }
    );
    return `Weather in ${data.name}: ${data.weather[0].description}, ${Math.round(data.main.temp)}°C, humidity ${data.main.humidity}%, wind ${data.wind.speed} m/s.`;
  } catch {
    return "";
  }
}

// ── fetch news context ────────────────────────────────────────────────────────
async function fetchNewsContext(city) {
  try {
    const { data } = await axios.post(
      "https://api.tavily.com/search",
      {
        api_key: process.env.TAVILY_API_KEY,
        query: `latest news in ${city}`,
        search_depth: "basic",
        max_results: 3,
      },
      { timeout: 8000 }
    );
    const headlines = (data.results || []).map((r) => r.title).filter(Boolean);
    return headlines.length
      ? `Recent headlines for ${city}: ${headlines.join(" | ")}`
      : "";
  } catch {
    return "";
  }
}

// ── POST /api/chat ────────────────────────────────────────────────────────────
export const chat = async (req, res) => {
  const { message, city = "", chatId, history = [] } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

  // Build context from live data
  const contextParts = [];
  if (city) {
    const [weatherCtx, newsCtx] = await Promise.all([
      fetchWeatherContext(city),
      fetchNewsContext(city),
    ]);
    if (weatherCtx) contextParts.push(weatherCtx);
    if (newsCtx) contextParts.push(newsCtx);
  }

  const systemContent =
    "You are CityPulse, a smart city assistant with real-time weather and news data. " +
    "Be concise, helpful, and conversational.\n\n" +
    (contextParts.length ? "Live data:\n" + contextParts.join("\n") : "");

  try {
    let mistralMessages;
    let newChatId = null;
    let chatDoc = null;

    if (req.user) {
      // User is logged in, use DB
      if (chatId) {
        chatDoc = await Chat.findOne({ _id: chatId, user: req.user._id });
      }
      if (!chatDoc) {
        chatDoc = new Chat({ city, messages: [], user: req.user._id });
      }

      chatDoc.messages.push({ role: "user", content: message });
      mistralMessages = [
        { role: "system", content: systemContent },
        ...chatDoc.messages.map((m) => ({ role: m.role, content: m.content })),
      ];
    } else {
      // Guest, use provided history
      mistralMessages = [
        { role: "system", content: systemContent },
        ...history.map((m) => ({ role: m.role, content: m.content })),
      ];
    }

    const reply = await askMistral(mistralMessages);

    if (req.user && chatDoc) {
      chatDoc.messages.push({ role: "assistant", content: reply });
      await chatDoc.save();
      newChatId = chatDoc._id;
    }

    res.json({ reply, chatId: newChatId });
  } catch (err) {
    console.error("Mistral error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI service unavailable" });
  }
};

// ── GET /api/chat/:id ─────────────────────────────────────────────────────────
export const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
