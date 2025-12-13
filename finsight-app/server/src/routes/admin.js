import express from "express";
import User from "../models/User.js";
import Upload from "../models/Upload.js";
import { auth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// 🔒 All admin routes require admin authentication
router.use(auth, requireAdmin);

/******************************
 * ADMIN DASHBOARD SUMMARY
 ******************************/
/**
 * @swagger
 * /api/admin/summary:
 *   get:
 *     summary: Get admin dashboard summary
 *     description: Get statistics for admin dashboard (total users and uploads)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: integer
 *                   description: Total number of users
 *                   example: 150
 *                 uploads:
 *                   type: integer
 *                   description: Total number of uploads
 *                   example: 523
 *       401:
 *         description: Unauthorized - No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token provided"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin access required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to load summary"
 */
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
/**
 * @swagger
 * /api/admin/requests:
 *   get:
 *     summary: Get pending admin requests
 *     description: Retrieve list of users who have requested admin access
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pending:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "507f1f77bcf86cd799439011"
 *                       name:
 *                         type: string
 *                         example: "Jane Smith"
 *                       email:
 *                         type: string
 *                         example: "jane.smith@example.com"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /api/admin/approve/{id}:
 *   patch:
 *     summary: Approve admin request
 *     description: Promote a user to admin role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to approve
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: User promoted to admin successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User promoted to admin"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       400:
 *         description: No admin request exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No admin request exists"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /api/admin/reject/{id}:
 *   patch:
 *     summary: Reject admin request
 *     description: Reject a user's admin access request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to reject
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Admin request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin request rejected"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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
