import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getBudget,
  getBudgetSummary,
  upsertBudget,
} from "../controllers/budgetController.js";

const router = express.Router();

// Apply auth middleware to all budget routes
router.use(authMiddleware);

// Define routes
router.get("/", getBudget);
router.get("/summary", getBudgetSummary);
router.post("/", upsertBudget);

export default router;
