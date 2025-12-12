// src/models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upload: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upload",
      required: true,
    },
    date: {
      type: Date,
      // some statements might not have parseable dates; keep optional
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true, // negative for spend, positive for refund/credit
    },
    category: {
      type: String,
      default: "Other",
    },
    rawLine: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
