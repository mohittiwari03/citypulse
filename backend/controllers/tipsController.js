import axios from "axios";

export const getTravelTips = async (req, res) => {
  const { city, temp, description, humidity, wind_speed } = req.query;

  if (!city) return res.status(400).json({ error: "City is required" });

  const weatherContext = `
City: ${city}
Temperature: ${temp}°C
Condition: ${description}
Humidity: ${humidity}%
Wind: ${wind_speed} m/s
`.trim();

  const prompt = `Based on this live weather in ${city}:
${weatherContext}

Give exactly 4 short, practical travel tips for someone visiting ${city} right now.
Format as a JSON array of objects with "icon" (single emoji) and "tip" (max 12 words).
Example: [{"icon":"🌂","tip":"Carry an umbrella — rain expected throughout the day"}]
Return ONLY valid JSON, no extra text.`;

  try {
    const { data } = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 12000,
      }
    );

    const raw = data.choices[0].message.content
      .replace(/```json|```/g, "")
      .trim();

    const tips = JSON.parse(raw);
    res.json({ city, tips });
  } catch (err) {
    console.error("Tips error:", err.message);
    res.status(500).json({ error: "Could not generate tips" });
  }
};
