import express from "express";
import {
  saveSearch,
  getHistory,
  deleteSearch,
} from "../controllers/historyController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, saveSearch);
router.get("/", protect, getHistory);
router.delete("/:id", protect, deleteSearch);

export default router;
