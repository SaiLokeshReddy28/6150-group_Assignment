import express from "express";
import { authMiddleware as protect } from "../middleware/authMiddleware.js";
import { getTransactions } from "../controllers/transactionController.js";

const router = express.Router();

// All routes here are protected
router.use(protect);

router.get("/", getTransactions);

export default router;
