import express from "express";
import {
  saveSearch,
  getHistory,
  deleteSearch,
} from "../controllers/historyController.js";

const router = express.Router();

router.post("/", saveSearch);
router.get("/", getHistory);
router.delete("/:id", deleteSearch);

export default router;
