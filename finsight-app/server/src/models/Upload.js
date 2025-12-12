import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    storedName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
    // later, when we parse PDF, we can fill these optional fields:
    summary: {
      // e.g. { month: "2025-09", totalSpent: 1234, categories: {...} }
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Upload = mongoose.model("Upload", uploadSchema);

export default Upload;
