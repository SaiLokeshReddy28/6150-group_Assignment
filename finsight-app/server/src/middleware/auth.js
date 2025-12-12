import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Auth middleware: verifies JWT and loads req.user
export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    // ✅ Decode JWT (your token uses `sub`)
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // ⬅️ FIXED: use payload.sub, not payload.userId
    const user = await User.findById(payload.sub).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "User account is inactive" });
    }

    req.user = user; // attach logged-in user
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ✅ Admin-only middleware
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
