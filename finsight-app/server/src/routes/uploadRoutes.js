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
router.post(
  "/statement",
  authMiddleware,
  upload.single("statement"), // form-data field name
  uploadAndParseStatement
);

// GET /api/uploads
router.get("/", authMiddleware, getUserUploads);

// GET /api/uploads/:uploadId/transactions
router.get("/:uploadId/transactions", authMiddleware, getUploadTransactions);

// DELETE /api/uploads/:uploadId
router.delete("/:uploadId", authMiddleware, deleteUpload);

export default router;
