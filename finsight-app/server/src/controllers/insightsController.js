import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

const monthRegex = /^(\d{4})-(\d{1,2})$/;

const normalizeMonth = (value) => {
  if (!value || typeof value !== "string") return null;
  const match = monthRegex.exec(value.trim());
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

export const getInsights = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const month = normalizeMonth(req.query.month) || currentMonthKey();
    const { start: startCurrent, end: endCurrent } = getMonthRange(month);

    const prevDate = new Date(startCurrent);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const previousMonth = `${prevDate.getFullYear()}-${String(
      prevDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const { start: startPrev, end: endPrev } = getMonthRange(previousMonth);

    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    const [currentTotals] = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startCurrent, $lt: endCurrent },
        },
      },
      {
        $group: {
          _id: null,
          income: {
            $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] },
          },
          expenses: {
            $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] },
          },
        },
      },
    ]);

    const [previousTotals] = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startPrev, $lt: endPrev },
        },
      },
      {
        $group: {
          _id: null,
          expenses: {
            $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] },
          },
        },
      },
    ]);

    const categoriesCurrent = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startCurrent, $lt: endCurrent },
        },
      },
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

    const categoriesPrev = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startPrev, $lt: endPrev },
        },
      },
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
    ]);

    const prevCategoryMap = new Map(
      categoriesPrev.map((cat) => [cat.name, cat.spent])
    );

    const seenCategories = new Set();
    const categoryComparison = categoriesCurrent.map((cat) => {
      seenCategories.add(cat.name);
      const prevSpent = prevCategoryMap.get(cat.name) || 0;
      return {
        name: cat.name,
        current: cat.spent,
        previous: prevSpent,
        change: cat.spent - prevSpent,
        percent:
          prevSpent > 0 ? Math.round(((cat.spent - prevSpent) / prevSpent) * 100) : null,
      };
    });

    categoriesPrev.forEach((cat) => {
      if (seenCategories.has(cat.name)) return;
      categoryComparison.push({
        name: cat.name,
        current: 0,
        previous: cat.spent,
        change: -cat.spent,
        percent: -100,
      });
    });

    const merchantHighlights = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startCurrent, $lt: endCurrent },
          amount: { $lt: 0 },
        },
      },
      {
        $group: {
          _id: { $ifNull: ["$description", "Transaction"] },
          count: { $sum: 1 },
          spentRaw: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          transactions: "$count",
          spent: { $abs: "$spentRaw" },
        },
      },
      { $sort: { spent: -1 } },
      { $limit: 5 },
    ]);

    const recurringMerchants = merchantHighlights.filter(
      (merchant) => merchant.transactions >= 3
    );

    const startTrend = new Date(startCurrent);
    startTrend.setMonth(startTrend.getMonth() - 5);

    const rawTrend = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startTrend, $lt: endCurrent },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          income: {
            $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] },
          },
          expenses: {
            $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] },
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

    const trendMap = new Map();
    rawTrend.forEach((item) => {
      const key = `${item.year}-${String(item.month).padStart(2, "0")}`;
      trendMap.set(key, item);
    });

    const filledTrend = [];
    const currentStart = new Date(startCurrent);
    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(currentStart);
      date.setMonth(date.getMonth() - offset);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const dataset = trendMap.get(key);
      filledTrend.push({
        month: key,
        income: dataset?.income || 0,
        expenses: dataset?.expenses || 0,
      });
    }

    const alerts = [];
    categoryComparison
      .filter((cat) => cat.percent !== null && cat.percent >= 20 && cat.current > 100)
      .slice(0, 3)
      .forEach((cat) => {
        alerts.push(
          `Spending in ${cat.name} increased by ${cat.percent}% month-over-month.`
        );
      });

    const totalSpentCurrent = Math.abs(currentTotals?.expenses || 0);
    const totalIncomeCurrent = currentTotals?.income || 0;

    if (totalIncomeCurrent > 0 && totalSpentCurrent > totalIncomeCurrent * 1.2) {
      alerts.push("Monthly spending exceeds income by more than 20%.");
    }

    if (recurringMerchants.length === 0 && alerts.length === 0) {
      alerts.push("Great job! No unusual spending patterns detected this month.");
    }

    return res.json({
      month,
      previousMonth,
      cashflow: {
        income: totalIncomeCurrent,
        expenses: totalSpentCurrent,
        previousExpenses: Math.abs(previousTotals?.expenses || 0),
      },
      monthlyTrend: filledTrend,
      categories: categoryComparison,
      topMerchants: merchantHighlights,
      recurringMerchants,
      alerts,
    });
  } catch (err) {
    console.error("Insights error:", err);
    return res.status(500).json({ message: "Failed to build insights" });
  }
};
