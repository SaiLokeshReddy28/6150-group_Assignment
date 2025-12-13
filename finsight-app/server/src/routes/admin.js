import express from "express";
import User from "../models/User.js";
import Upload from "../models/Upload.js";
import { auth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// 🔐 All admin routes require admin authentication
router.use(auth, requireAdmin);

/******************************
 * ADMIN DASHBOARD SUMMARY
 ******************************/
router.get("/summary", async (req, res) => {
  try {
    const [users, uploads] = await Promise.all([
      User.countDocuments(),
      Upload.countDocuments(),
    ]);

    res.json({ users, uploads });
  } catch (err) {
    console.error("Admin summary error:", err);
    res.status(500).json({ message: "Failed to load summary" });
  }
});

/******************************
 * ADMIN ACCESS REQUESTS
 ******************************/
router.get("/requests", async (req, res) => {
  try {
    const pending = await User.find({
      isAdminRequested: true,
      role: "user",
    })
      .select("name email createdAt")
      .sort({ createdAt: -1 });

    res.json({ pending });
  } catch (err) {
    console.error("Admin requests error:", err);
    res.status(500).json({ message: "Failed to load admin requests" });
  }
});

/******************************
 * APPROVE ADMIN REQUEST
 ******************************/
router.patch("/approve/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isAdminRequested)
      return res.status(400).json({ message: "No admin request exists" });

    user.role = "admin";
    user.isAdminRequested = false;
    user.approvedBy = req.user._id;

    await user.save();

    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Approval failed" });
  }
});

/******************************
 * REJECT ADMIN REQUEST
 ******************************/
router.patch("/reject/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isAdminRequested = false;
    user.approvedBy = null;

    await user.save();

    res.json({ message: "Admin request rejected" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Rejection failed" });
  }
});

export default router;
