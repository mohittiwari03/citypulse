import Search from "../models/Search.js";
import axios from "axios";

// ── POST /api/history  (called internally after a city search) ────────────────
export const saveSearch = async (req, res) => {
  const { city, weather, newsHeadlines } = req.body;

  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const doc = await Search.findOneAndUpdate(
      { city: city.toLowerCase() },
      { city: city.toLowerCase(), weather, newsHeadlines, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/history ──────────────────────────────────────────────────────────
export const getHistory = async (req, res) => {
  try {
    const searches = await Search.find()
      .sort({ updatedAt: -1 })
      .limit(20)
      .select("city weather newsHeadlines updatedAt");
    res.json(searches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/history/:id ───────────────────────────────────────────────────
export const deleteSearch = async (req, res) => {
  try {
    await Search.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
