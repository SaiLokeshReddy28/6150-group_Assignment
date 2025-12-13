import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";

/**
 * GET /api/transactions
 * Fetch all transactions for the logged-in user, sorted by date (desc)
 */
export const getTransactions = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ date: -1, createdAt: -1 })
            .select("-__v");

        return res.json({ transactions });
    } catch (err) {
        console.error("Get transactions error:", err);
        return res.status(500).json({ message: "Failed to fetch transactions" });
    }
};

/**
 * GET /api/transactions/dashboard
 * Provide summary data for dashboard cards + charts
 */
export const getDashboardStats = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthKey = `${startOfMonth.getFullYear()}-${String(
      startOfMonth.getMonth() + 1
    ).padStart(2, "0")}`;

    const [globalTotals] = await Transaction.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$amount" },
          totalIncome: {
            $sum: {
              $cond: [{ $gt: ["$amount", 0] }, "$amount", 0],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $lt: ["$amount", 0] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    const [monthlyTotals] = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          monthlyIncome: {
            $sum: {
              $cond: [{ $gt: ["$amount", 0] }, "$amount", 0],
            },
          },
          monthlyExpenses: {
            $sum: {
              $cond: [{ $lt: ["$amount", 0] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: { $ifNull: ["$category", "Other"] },
          spentRaw: {
            $sum: {
              $cond: [{ $lt: ["$amount", 0] }, "$amount", 0],
            },
          },
          incomeRaw: {
            $sum: {
              $cond: [{ $gt: ["$amount", 0] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          spent: { $abs: "$spentRaw" },
          income: "$incomeRaw",
        },
      },
      { $sort: { spent: -1 } },
    ]);

    const startTrend = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    let monthlyTrend = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startTrend, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          income: {
            $sum: {
              $cond: [{ $gt: ["$amount", 0] }, "$amount", 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $lt: ["$amount", 0] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          income: 1,
          expenses: { $abs: "$expenses" },
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    // Ensure we always return the last 6 months (fill zeros if missing)
    const trendMap = new Map();
    monthlyTrend.forEach((item) => {
      const key = `${item.year}-${String(item.month).padStart(2, "0")}`;
      trendMap.set(key, item);
    });

    const filledTrend = [];
    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(startOfMonth);
      date.setMonth(date.getMonth() - offset);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const existing = trendMap.get(key);
      filledTrend.push({
        month: key,
        income: existing?.income || 0,
        expenses: existing?.expenses || 0,
      });
    }

    const recentTransactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .select("-__v");

    const currentBudget = await Budget.findOne({
      user: req.user.id,
      month: monthKey,
    }).lean();

    const totalBudgetLimit =
      currentBudget?.totalLimit ||
      currentBudget?.categories?.reduce((sum, cat) => sum + (cat.limit || 0), 0) ||
      0;

    const monthlyExpenseValue = Math.abs(monthlyTotals?.monthlyExpenses || 0);

    const manualIncome = currentBudget?.manualIncome || 0;
    const derivedMonthlyIncome =
      manualIncome > 0 ? manualIncome : monthlyTotals?.monthlyIncome || 0;

    const budgetUsage =
      totalBudgetLimit > 0
        ? {
            limit: totalBudgetLimit,
            spent: monthlyExpenseValue,
            remaining: Math.max(totalBudgetLimit - monthlyExpenseValue, 0),
            percent: Math.min(
              Math.round((monthlyExpenseValue / totalBudgetLimit) * 100),
              999
            ),
          }
        : null;

    return res.json({
      summary: {
        totalBalance: globalTotals?.totalBalance || 0,
        totalIncome: globalTotals?.totalIncome || 0,
        totalExpenses: Math.abs(globalTotals?.totalExpenses || 0),
        monthlyIncome: derivedMonthlyIncome,
        monthlyIncomeSource: manualIncome > 0 ? "manual" : "actual",
        manualMonthlyIncome: manualIncome,
        actualMonthlyIncome: monthlyTotals?.monthlyIncome || 0,
        monthlySpending: monthlyExpenseValue,
        budgetUsage,
      },
      categories: categoryBreakdown,
      monthlyTrend: filledTrend,
      recentTransactions,
      budget: currentBudget || null,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return res.status(500).json({ message: "Failed to build dashboard stats" });
  }
};
