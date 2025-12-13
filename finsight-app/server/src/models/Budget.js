import mongoose from "mongoose";

const categoryBudgetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    limit: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String, // YYYY-MM
      required: true,
      trim: true,
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    totalLimit: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    categories: {
      type: [categoryBudgetSchema],
      default: [],
    },
    manualIncome: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

budgetSchema.index({ user: 1, month: 1 }, { unique: true });

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
