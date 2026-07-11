import express from "express";
import { chat, getChatHistory } from "../controllers/chatController.js";
import protect, { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", optionalAuth, chat);
router.get("/:id", protect, getChatHistory);

export default router;
