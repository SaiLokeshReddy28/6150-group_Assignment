import express from "express";
import { authMiddleware as protect } from "../middleware/authMiddleware.js";
import { getInsights } from "../controllers/insightsController.js";

const router = express.Router();

router.use(protect);

router.get("/", getInsights);

export default router;
