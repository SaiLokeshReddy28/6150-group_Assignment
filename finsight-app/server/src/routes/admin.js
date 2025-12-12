// server/src/routes/admin.routes.js
import express from "express";
import User from "../models/User.js";
import Upload from "../models/Upload.js";
import { auth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(auth, requireAdmin);

/******************************
 * DASHBOARD SUMMARY
 ******************************/
router.get("/summary", async (req, res) => {
  try {
    const [userCount, uploadCount, latestUploads] = await Promise.all([
      User.countDocuments(),
      Upload.countDocuments(),
      Upload.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "email"),
    ]);

    res.json({
      users: userCount,
      uploads: uploadCount,
      latestUploads,
    });
  } catch (err) {
    console.error("Admin summary error:", err);
    res.status(500).json({ error: "Failed to load summary" });
  }
});

/******************************
 * USER LISTING
 ******************************/
router.get("/users", async (req, res) => {
  try {
    const { search, role, isActive } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    if (role) filter.role = role;
    if (isActive !== undefined && isActive !== "")
      filter.isActive = isActive === "true";

    const users = await User.find(filter)
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (err) {
    console.error("Admin users error:", err);
    res.status(500).json({ error: "Failed to load users" });
  }
});

/******************************
 * UPDATE USER ROLE
 ******************************/
router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-passwordHash");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ error: "Failed to update role" });
  }
});

/******************************
 * UPDATE USER STATUS
 ******************************/
router.patch("/users/:id/status", async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: !!isActive },
      { new: true }
    ).select("-passwordHash");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

/******************************
 * GET ALL UPLOADS
 ******************************/
router.get("/uploads", async (req, res) => {
  try {
    const { status, userId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (userId) filter.user = userId;

    const uploads = await Upload.find(filter)
      .populate("user", "email")
      .sort({ createdAt: -1 });

    res.json({ uploads });
  } catch (err) {
    console.error("Admin uploads error:", err);
    res.status(500).json({ error: "Failed to load uploads" });
  }
});

/******************************
 * DELETE UPLOAD
 ******************************/
router.delete("/uploads/:id", async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ error: "Upload not found" });

    await upload.deleteOne();
    res.status(204).send();
  } catch (err) {
    console.error("Delete upload error:", err);
    res.status(500).json({ error: "Failed to delete upload" });
  }
});

/******************************
 * ADMIN REQUESTS — CORRECTED
 ******************************/
router.get("/requests", async (req, res) => {
  try {
    const pending = await User.find({
      isAdminRequested: true,
      role: "user",
    })
      .select("name email createdAt")
      .sort({ createdAt: -1 });

    return res.json({ pending });
  } catch (err) {
    console.error("Error loading admin requests:", err);
    res.status(500).json({ error: "Failed to load admin requests" });
  }
});

/******************************
 * APPROVE ADMIN REQUEST
 ******************************/
router.patch("/approve/:id", async (req, res) => {
  try {
    const approverId = req.user._id;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.isAdminRequested)
      return res.status(400).json({ error: "This user has no admin request" });

    user.role = "admin";
    user.isAdminRequested = false;
    user.approvedBy = approverId;

    await user.save();

    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve admin request" });
  }
});

/******************************
 * REJECT ADMIN REQUEST
 ******************************/
router.patch("/reject/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    user.isAdminRequested = false;
    user.approvedBy = null;

    await user.save();

    res.json({ message: "Admin request rejected", user });
  } catch (err) {
    console.error("Reject request error:", err);
    res.status(500).json({ error: "Failed to reject admin request" });
  }
});

export default router;
