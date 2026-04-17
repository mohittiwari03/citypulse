import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

import weatherRoutes  from "./routes/weather.js";
import newsRoutes     from "./routes/news.js";
import chatRoutes     from "./routes/chat.js";
import historyRoutes  from "./routes/history.js";
import forecastRoutes from "./routes/forecast.js";
import tipsRoutes     from "./routes/tips.js";
import authRoutes     from "./routes/auth.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/weather",  weatherRoutes);
app.use("/api/news",     newsRoutes);
app.use("/api/chat",     chatRoutes);
app.use("/api/history",  historyRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api/tips",     tipsRoutes);
app.use("/api/auth",     authRoutes);

app.get("/", (req, res) => res.send("CityPulse API running ✅"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
