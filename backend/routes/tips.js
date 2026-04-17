import express from "express";
import { getTravelTips } from "../controllers/tipsController.js";
const router = express.Router();
router.get("/", getTravelTips);
export default router;
