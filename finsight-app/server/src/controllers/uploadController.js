// src/controllers/uploadController.js
import Upload from "../models/Upload.js";
import Transaction from "../models/Transaction.js";
import { extractTransactionsWithAI } from "../services/aiExtractor.js";

/**
 * POST /api/uploads/statement
 * field name: "statement"
 */
export const uploadAndParseStatement = async (req, res) => {
  try {
    // 1. Auth guard
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "User not authenticated. Please log in again." });
    }

    // 2. File validation
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { buffer, originalname, mimetype, size } = req.file;

    const isPdfType = mimetype === "application/pdf";
    const isPdfName = originalname.toLowerCase().endsWith(".pdf");
    if (!isPdfType && !isPdfName) {
      return res.status(400).json({ message: "Only PDF files are supported." });
    }

    // 3. Use AI to extract transactions from the PDF buffer
    const extracted = await extractTransactionsWithAI(buffer, {
      filename: originalname,
      userId: req.user.id,
    });

    if (!Array.isArray(extracted) || extracted.length === 0) {
      return res.status(400).json({
        message: "No transactions could be extracted from this statement.",
      });
    }

    // 4. Normalize transactions & compute summary
    const normalizedTx = [];
    let totalAmount = 0;
    const byCategory = {};

    for (const tx of extracted) {
      if (tx == null || typeof tx !== "object") continue;

      const rawAmount = Number(tx.amount);
      if (Number.isNaN(rawAmount)) continue;

      const amount = rawAmount;
      totalAmount += amount;

      // normalize date (string → Date) if present
      let dateValue = null;
      if (tx.date) {
        const parsed = Date.parse(tx.date);
        if (!Number.isNaN(parsed)) {
          dateValue = new Date(parsed);
        }
      }

      const description =
        tx.description && String(tx.description).trim().length > 0
          ? String(tx.description).trim()
          : "Transaction";

      const category =
        (tx.category && String(tx.category).trim()) || "Other";

      if (!byCategory[category]) byCategory[category] = 0;
      byCategory[category] += amount;

      normalizedTx.push({
        user: req.user.id,
        date: dateValue,
        description,
        amount,
        category,
        upload: null, // fill after we create Upload
        raw: tx.raw || null,
      });
    }

    if (normalizedTx.length === 0) {
      return res.status(400).json({
        message:
          "Transactions were detected, but none had a valid numeric amount.",
      });
    }

    // 5. Create Upload doc
    const storedName = `${Date.now()}-${originalname}`;

    const uploadDoc = await Upload.create({
      user: req.user.id,
      originalName: originalname,
      storedName,
      mimeType: mimetype || "application/pdf",
      size,
      status: "processed",
      summary: {
        totalTransactions: normalizedTx.length,
        totalAmount,
        byCategory,
      },
    });

    // 6. Persist transactions linked to this upload
    const uploadId = uploadDoc._id;
    const txToInsert = normalizedTx.map((t) => ({
      ...t,
      upload: uploadId,
    }));

    const txDocs = await Transaction.insertMany(txToInsert);

    // 7. Respond
    return res.status(201).json({
      message: "Statement uploaded and processed successfully.",
      upload: {
        id: uploadDoc._id,
        _id: uploadDoc._id,
        originalName: uploadDoc.originalName,
        storedName: uploadDoc.storedName,
        mimeType: uploadDoc.mimeType,
        size: uploadDoc.size,
        status: uploadDoc.status,
        summary: uploadDoc.summary,
        createdAt: uploadDoc.createdAt,
      },
      summary: uploadDoc.summary,
      transactions: txDocs,
    });
  } catch (err) {
    console.error("Upload/parse error:", err);
    return res.status(500).json({
      message: "Failed to process statement",
      error: err.message,
    });
  }
};

/**
 * GET /api/uploads
 * Return all uploads for the logged-in user (most recent first)
 */
export const getUserUploads = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "User not authenticated. Please log in again." });
    }

    const uploads = await Upload.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.json({ uploads });
  } catch (err) {
    console.error("Get uploads error:", err);
    return res.status(500).json({ message: "Failed to fetch uploads" });
  }
};

/**
 * GET /api/uploads/:uploadId/transactions
 * Return all transactions for this upload belonging to the logged-in user
 */
export const getUploadTransactions = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "User not authenticated. Please log in again." });
    }

    const { uploadId } = req.params;

    // Build query: if admin, find by ID only; if user, find by ID + user
    const uploadQuery = { _id: uploadId };
    if (req.user.role !== "admin") {
      uploadQuery.user = req.user.id;
    }

    // Ensure the upload belongs to this user (or user is admin)
    const upload = await Upload.findOne(uploadQuery);

    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }

    const txQuery = { upload: uploadId };
    if (req.user.role !== "admin") {
      txQuery.user = req.user.id;
    }

    const transactions = await Transaction.find(txQuery)
      .sort({ date: 1, createdAt: 1 })
      .select("-__v");

    return res.json({ transactions });
  } catch (err) {
    console.error("Get transactions error:", err);
    return res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

/**
 * DELETE /api/uploads/:uploadId
 * Delete an upload + all its transactions (for this user only)
 */
export const deleteUpload = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "User not authenticated. Please log in again." });
    }

    const { uploadId } = req.params;

    const query = { _id: uploadId };
    // If not admin, restrict to own upload
    if (req.user.role !== "admin") {
      query.user = req.user.id;
    }

    const upload = await Upload.findOne(query);

    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }

    // Delete related transactions first
    // Admin deletes all for that upload; user deletes only their own (redundant check but safe)
    const txQuery = { upload: uploadId };
    if (req.user.role !== "admin") {
      txQuery.user = req.user.id;
    }

    await Transaction.deleteMany(txQuery);

    // Delete the upload record
    await Upload.deleteOne({ _id: uploadId });

    return res.json({ message: "Upload deleted successfully." });
  } catch (err) {
    console.error("Delete upload error:", err);
    return res.status(500).json({ message: "Failed to delete upload" });
  }
};