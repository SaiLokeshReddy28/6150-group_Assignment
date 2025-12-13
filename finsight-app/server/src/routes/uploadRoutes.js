// src/routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  uploadAndParseStatement,
  getUserUploads,
  getUploadTransactions,
  deleteUpload,
} from "../controllers/uploadController.js";

const router = express.Router();

// memory storage for now (no disk persistence)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

// POST /api/uploads/statement
/**
 * @swagger
 * /api/uploads/statement:
 *   post:
 *     summary: Upload bank statement PDF
 *     description: Upload and parse a bank statement PDF file. The file will be processed using AI to extract transactions automatically.
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - statement
 *             properties:
 *               statement:
 *                 type: string
 *                 format: binary
 *                 description: Bank statement PDF file (max 10MB)
 *     responses:
 *       201:
 *         description: Upload successful and processing started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload successful"
 *                 upload:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     userId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     fileName:
 *                       type: string
 *                       example: "statement_jan_2024.pdf"
 *                     originalName:
 *                       type: string
 *                       example: "Bank_Statement_January.pdf"
 *                     uploadDate:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                       enum: [processing, completed, failed]
 *                       example: "processing"
 *                     fileSize:
 *                       type: integer
 *                       description: File size in bytes
 *                       example: 1048576
 *       400:
 *         description: Invalid file or missing file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               noFile:
 *                 summary: No file uploaded
 *                 value:
 *                   message: "No file uploaded"
 *               invalidType:
 *                 summary: Invalid file type
 *                 value:
 *                   message: "Only PDF files are allowed"
 *               tooLarge:
 *                 summary: File too large
 *                 value:
 *                   message: "File size exceeds 10MB limit"
 *       401:
 *         description: Unauthorized
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
 *                   example: "Upload failed"
 */
router.post(
  "/statement",
  authMiddleware,
  upload.single("statement"), // form-data field name
  uploadAndParseStatement
);

// GET /api/uploads
/**
 * @swagger
 * /api/uploads:
 *   get:
 *     summary: Get user uploads
 *     description: Retrieve all uploads for the authenticated user with optional filtering and pagination
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [processing, completed, failed]
 *         description: Filter by upload status
 *         example: "completed"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of uploads to return
 *         example: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of uploads to skip (for pagination)
 *         example: 0
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [uploadDate, fileName, status]
 *           default: uploadDate
 *         description: Sort uploads by field
 *         example: "uploadDate"
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
 *         description: Uploads retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploads:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "507f1f77bcf86cd799439011"
 *                       userId:
 *                         type: string
 *                         example: "507f1f77bcf86cd799439011"
 *                       fileName:
 *                         type: string
 *                         example: "statement_jan_2024.pdf"
 *                       originalName:
 *                         type: string
 *                         example: "Bank_Statement_January.pdf"
 *                       uploadDate:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                         enum: [processing, completed, failed]
 *                         example: "completed"
 *                       transactionCount:
 *                         type: integer
 *                         example: 42
 *                       fileSize:
 *                         type: integer
 *                         example: 1048576
 *                 total:
 *                   type: integer
 *                   description: Total number of uploads
 *                   example: 15
 *                 limit:
 *                   type: integer
 *                   example: 20
 *                 offset:
 *                   type: integer
 *                   example: 0
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getUserUploads);

// GET /api/uploads/:uploadId/transactions
/**
 * @swagger
 * /api/uploads/{uploadId}/transactions:
 *   get:
 *     summary: Get transactions from specific upload
 *     description: Retrieve all transactions extracted from a specific uploaded statement
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uploadId
 *         required: true
 *         schema:
 *           type: string
 *         description: Upload ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 upload:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     fileName:
 *                       type: string
 *                     uploadDate:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                     transactionCount:
 *                       type: integer
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       uploadId:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       description:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       category:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [debit, credit]
 *                       balance:
 *                         type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Upload not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload not found"
 *       500:
 *         description: Server error
 */
router.get("/:uploadId/transactions", authMiddleware, getUploadTransactions);

// DELETE /api/uploads/:uploadId
/**
 * @swagger
 * /api/uploads/{uploadId}:
 *   delete:
 *     summary: Delete upload
 *     description: Delete an uploaded statement and all associated transactions
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uploadId
 *         required: true
 *         schema:
 *           type: string
 *         description: Upload ID to delete
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Upload deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload deleted successfully"
 *                 deletedTransactions:
 *                   type: integer
 *                   description: Number of transactions deleted
 *                   example: 42
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized to delete this upload"
 *       404:
 *         description: Upload not found
 *       500:
 *         description: Server error
 */
router.delete("/:uploadId", authMiddleware, deleteUpload);

export default router;
