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
 * GET SINGLE USER (VIEW)
 ******************************/
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Failed to load user" });
  }
});

/******************************
 * DEACTIVATE USER
 ******************************/
router.patch("/users/:id/status", async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = isActive;
    await user.save();

    res.json({ message: "User status updated", user });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});


/******************************
 * ACTIVATE USER
 ******************************/
router.patch("/users/:id/activate", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = true;
    await user.save();

    res.json({ message: "User activated", user });
  } catch (err) {
    console.error("Activate error:", err);
    res.status(500).json({ message: "Failed to activate user" });
  }
});


/******************************
 * GET ALL USERS (WITH FILTERS)
 ******************************/
router.get("/users", async (req, res) => {
  try {
    const { search, role, isActive } = req.query;

    const query = {};

    // 🔍 Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 🎭 Filter by role
    if (role) {
      query.role = role;
    }

    // ✅ Filter by active / inactive
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const users = await User.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/******************************
 * ADMIN UPLOADS MANAGEMENT
 ******************************/

/**
 * LIST + SEARCH UPLOADS
 * GET /api/admin/uploads
 */
router.get("/uploads", async (req, res) => {
  try {
    const { search, type, isActive } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { filename: { $regex: search, $options: "i" } },
        { originalName: { $regex: search, $options: "i" } },
      ];
    }

    if (type) {
      query.mimeType = { $regex: type, $options: "i" };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const uploads = await Upload.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ uploads });
  } catch (err) {
    console.error("Admin uploads error:", err);
    res.status(500).json({ message: "Failed to load uploads" });
  }
});

/**
 * STEP 3️⃣ VIEW SINGLE UPLOAD
 * GET /api/admin/uploads/:id
 */
router.get("/uploads/:id", async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id)
      .populate("user", "name email");

    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }

    res.json({ upload });
  } catch (err) {
    res.status(500).json({ message: "Failed to load upload" });
  }
});

/**
 * STEP 4️⃣ DEACTIVATE UPLOAD
 * PATCH /api/admin/uploads/:id/deactivate
 */
router.patch("/uploads/:id/deactivate", async (req, res) => {
  try {
    await Upload.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Upload deactivated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to deactivate upload" });
  }
});

// DELETE AN UPLOAD (ADMIN)
router.delete("/uploads/:id", async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }

    await upload.deleteOne();

    res.json({ message: "Upload deleted successfully" });
  } catch (err) {
    console.error("Delete upload error:", err);
    res.status(500).json({ message: "Failed to delete upload" });
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
