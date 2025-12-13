import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

// --- Helpers ---
const monthRegex = /^(\d{4})-(\d{1,2})$/;

const normalizeMonth = (value) => {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  const match = monthRegex.exec(trimmed);
  if (!match) return null;
  const [, year, month] = match;
  return `${year}-${month.padStart(2, "0")}`;
};

const currentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthRange = (monthKey) => {
  const [yearStr, monthStr] = monthKey.split("-");
  const year = Number(yearStr);
  const monthIdx = Number(monthStr) - 1;
  const start = new Date(year, monthIdx, 1);
  const end = new Date(year, monthIdx + 1, 1);
  return { start, end };
};

// --- Controllers ---

export const upsertBudget = async (req, res) => {
  try {
    console.log("👉 upsertBudget called with:", req.body);
    if (!req.user || !req.user.id) {
      console.warn("User not authenticated in upsertBudget");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const {
      month,
      totalLimit,
      currency,
      notes,
      categories,
      manualIncome,
    } = req.body;
    const normalizedMonth = normalizeMonth(month) || currentMonthKey();
    const userId = req.user.id;

    // Validate categories
    const cleanCategories = Array.isArray(categories)
      ? categories
        .map((c) => ({
          name: String(c.name || "").trim(),
          limit: Math.max(Number(c.limit) || 0, 0),
        }))
        .filter((c) => c.name)
      : [];

    const updateData = {
      user: userId,
      month: normalizedMonth,
      totalLimit: Math.max(Number(totalLimit) || 0, 0),
      currency: (currency || "USD").toUpperCase(),
      notes: notes ? String(notes).trim() : "",
      categories: cleanCategories,
      manualIncome: Math.max(Number(manualIncome) || 0, 0),
    };

    console.log("Querying for:", { user: userId, month: normalizedMonth });
    const budget = await Budget.findOneAndUpdate(
      { user: userId, month: normalizedMonth },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    console.log("✅ Budget saved successfully:", budget._id);
    return res.status(200).json({ budget });
  } catch (err) {
    console.error("❌ upsertBudget Error:", err);
    return res.status(500).json({
      message: err.message || "Failed to save budget",
      details: err.toString(),
    });
  }
};

export const getBudget = async (req, res) => {
  try {
    const normalizedMonth = normalizeMonth(req.query.month) || currentMonthKey();
    const budget = await Budget.findOne({
      user: req.user.id,
      month: normalizedMonth,
    });
    return res.json({ month: normalizedMonth, budget });
  } catch (err) {
    console.error("getBudget Error:", err);
    return res.status(500).json({ message: "Failed to fetch budget" });
  }
};

export const getBudgetSummary = async (req, res) => {
  try {
    const month = normalizeMonth(req.query.month) || currentMonthKey();
    const { start, end } = getMonthRange(month);
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Aggregations
    const [spendTotals] = await Transaction.aggregate([
      { $match: { user: userObjectId, date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: null,
          income: { $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] } },
          expenses: {
            $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] },
          },
        },
      },
    ]);

    const byCategory = await Transaction.aggregate([
      { $match: { user: userObjectId, date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { $ifNull: ["$category", "Other"] },
          spentRaw: {
            $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          spent: { $abs: "$spentRaw" },
        },
      },
      { $sort: { spent: -1 } },
    ]);

    // 2. Fetch Budget
    const budget = await Budget.findOne({
      user: req.user.id,
      month,
    }).lean();

    // 3. Merge Match
    const totalSpent = Math.abs(spendTotals?.expenses || 0);
    const totalIncome = spendTotals?.income || 0;
    const manualIncome = budget?.manualIncome || 0;
    const effectiveIncome = manualIncome > 0 ? manualIncome : totalIncome;
    const totalLimit =
      budget?.totalLimit ||
      budget?.categories?.reduce((s, c) => s + (c.limit || 0), 0) ||
      0;

    const catMap = new Map(byCategory.map((c) => [c.name, c.spent]));

    const mergedCategories = (budget?.categories || []).map((cat) => {
      const spent = catMap.get(cat.name) || 0;
      const percent =
        cat.limit > 0 ? Math.round((spent / cat.limit) * 100) : null;
      return {
        name: cat.name,
        limit: cat.limit,
        spent,
        remaining: Math.max(cat.limit - spent, 0),
        percentUsed: percent !== null ? Math.min(percent, 999) : null,
      };
    });

    const definedNames = new Set((budget?.categories || []).map((c) => c.name));
    const uncategorized = byCategory.filter((c) => !definedNames.has(c.name));

    const percentUsedTotal =
      totalLimit > 0
        ? Math.min(Math.round((totalSpent / totalLimit) * 100), 999)
        : null;

    return res.json({
      month,
      currency: budget?.currency || "USD",
      summary: {
        totalLimit,
        totalSpent,
        totalIncome: effectiveIncome,
        actualIncome: totalIncome,
        manualIncome,
        remaining: Math.max(totalLimit - totalSpent, 0),
        percentUsed: percentUsedTotal,
      },
      categories: mergedCategories,
      uncategorized,
      notes: budget?.notes || "",
    });
  } catch (err) {
    console.error("Budget summary error:", err);
    return res.status(500).json({ message: "Failed to build summary" });
  }
};
