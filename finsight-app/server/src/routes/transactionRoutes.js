import express from "express";
import { authMiddleware as protect } from "../middleware/authMiddleware.js";
import { getTransactions } from "../controllers/transactionController.js";

const router = express.Router();

// All routes here are protected
router.use(protect);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get user transactions
 *     description: Retrieve all transactions for the authenticated user with optional filtering and pagination
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of transactions to return
 *         example: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of transactions to skip (for pagination)
 *         example: 0
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transactions from this date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transactions until this date (YYYY-MM-DD)
 *         example: "2024-12-31"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *         example: "Food & Dining"
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [debit, credit]
 *         description: Filter by transaction type
 *         example: "debit"
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *         description: Minimum transaction amount
 *         example: 10.00
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *         description: Maximum transaction amount
 *         example: 1000.00
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in transaction description
 *         example: "grocery"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, amount, description]
 *           default: date
 *         description: Sort transactions by field
 *         example: "date"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *         example: "desc"
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "507f1f77bcf86cd799439011"
 *                       userId:
 *                         type: string
 *                         description: User who owns this transaction
 *                         example: "507f1f77bcf86cd799439011"
 *                       uploadId:
 *                         type: string
 *                         description: Upload this transaction came from
 *                         example: "507f1f77bcf86cd799439011"
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       description:
 *                         type: string
 *                         example: "Grocery Store Purchase"
 *                       amount:
 *                         type: number
 *                         example: 45.99
 *                       category:
 *                         type: string
 *                         example: "Food & Dining"
 *                       type:
 *                         type: string
 *                         enum: [debit, credit]
 *                         example: "debit"
 *                       balance:
 *                         type: number
 *                         example: 1234.56
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   description: Total number of transactions (without pagination)
 *                   example: 150
 *                 limit:
 *                   type: integer
 *                   example: 50
 *                 offset:
 *                   type: integer
 *                   example: 0
 *                 hasMore:
 *                   type: boolean
 *                   description: Whether there are more transactions to fetch
 *                   example: true
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token provided"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch transactions"
 */
router.get("/", getTransactions);

export default router;
