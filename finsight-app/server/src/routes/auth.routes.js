import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

import User from "../models/User.js";

const router = express.Router();

// Helper: generate JWT
function generateToken(user) {
  const payload = {
    sub: user._id,
    email: user.email,
    name: user.name
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });
}

// @route   POST /api/auth/register
router.post(
  "/register",
  [
    body("title").isIn(["mr", "ms", "mrs", "dr", "prof"]),
    body("name").isLength({ min: 3, max: 50 }),
    body("email").isEmail(),
    body("phone").notEmpty(),
    body("countryCode").notEmpty(),
    body("age").isInt({ min: 18, max: 120 }),
    body("gender").isIn(["male", "female", "other", "prefer-not-to-say"]),
    body("password").isLength({ min: 8 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        name,
        email,
        phone,
        countryCode,
        age,
        gender,
        password
      } = req.body;

      // Check existing
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res
          .status(409)
          .json({ message: "An account with this email already exists." });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        title,
        name,
        email: email.toLowerCase(),
        phone,
        countryCode,
        age,
        gender,
        passwordHash
      });

      const token = generateToken(user);

      return res.status(201).json({
        message: "User registered successfully.",
        token,
        user: {
          id: user._id,
          title: user.title,
          name: user.name,
          email: user.email,
          phone: user.phone,
          countryCode: user.countryCode,
          age: user.age,
          gender: user.gender
        }
      });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ message: "Server error during registration." });
    }
  }
);

// @route   POST /api/auth/login
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid email or password." });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid email or password." });
      }

      const token = generateToken(user);

      return res.json({
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          title: user.title,
          name: user.name,
          email: user.email,
          phone: user.phone,
          countryCode: user.countryCode,
          age: user.age,
          gender: user.gender
        }
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error during login." });
    }
  }
);

// @route   GET /api/auth/me  (for session check later)
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    const user = await User.findById(payload.sub).select(
      "_id title name email phone countryCode age gender"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ user });
  } catch (err) {
    console.error("Me route error:", err);
    return res.status(500).json({ message: "Server error." });
  }
});

export default router;
