// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.substring(7); // after "Bearer "

    // IMPORTANT: must use the SAME secret you used in login/signup
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Your token has: sub, email, name
    // Normalise into a consistent shape for the rest of the app:
    req.user = {
      id: decoded.sub,        // <= this is the Mongo _id
      email: decoded.email,
      name: decoded.name,
      // keep original payload as well in case we need later
      _raw: decoded,
    };

    next();
  } catch (err) {
    console.error("JWT error in authMiddleware:", err.message);
    return res
      .status(401)
      .json({ message: "Invalid or expired token. Please log in again." });
  }
};