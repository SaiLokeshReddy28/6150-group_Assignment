import Transaction from "../models/Transaction.js";

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
