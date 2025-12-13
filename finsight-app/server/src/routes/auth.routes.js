import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import admin from "../firebaseAdmin.js";

const router = express.Router();

// =======================
// JWT CREATOR
// =======================
function generateToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

// =======================
// REGISTER (FINAL FIXED)
// =======================
router.post(
  "/register",
  [
    body("title").isIn(["mr", "ms", "mrs", "dr", "prof"]),
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("phone").notEmpty(),
    body("countryCode").notEmpty(),
    body("age").isInt({ min: 18 }),
    body("gender").isIn(["male", "female", "other", "prefer-not-to-say"]),
    body("password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      console.log("REGISTER PAYLOAD:", req.body); // 🔍 keep for now

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const {
        title,
        name,
        email,
        phone,
        countryCode,
        age,
        gender,
        password,
        requestAdmin, // ✅ READ THIS
      } = req.body;

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing)
        return res.status(409).json({ message: "Email already exists" });

      const passwordHash = await bcrypt.hash(password, 10);

      // ✅ ROBUST BOOLEAN HANDLING
      const isAdminRequested =
        requestAdmin === true ||
        requestAdmin === "true" ||
        requestAdmin === 1 ||
        requestAdmin === "1";

      const user = await User.create({
        title,
        name,
        email: email.toLowerCase(),
        phone,
        countryCode,
        age,
        gender,
        passwordHash,

        role: "user",                 // ALWAYS user initially
        isAdminRequested,             // 🔥 THIS FIXES IT
        isActive: true,
      });

      const token = generateToken(user);

      res.status(201).json({
        message: "Registered",
        token,
        user,
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ message: "Registration failed" });
    }
  }
);


// =======================
// NORMAL LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid login" });

    if (!user.isActive) return res.status(403).json({ message: "Inactive account" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid login" });

    const token = generateToken(user);

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// =======================
// GET CURRENT USER
// =======================
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.sub);
    if (!user) return res.status(404).json({ message: "Not found" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// ================================
// GOOGLE LOGIN ROUTE
// ================================
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "No Google token provided" });
    }

    // 1️⃣ Verify Google token
    const decoded = await admin.auth().verifyIdToken(idToken);

    const email = decoded.email;
    const name = decoded.name || "Google User";
    const picture = decoded.picture;

    // 2️⃣ Check existing user
    let user = await User.findOne({ email });

    // 3️⃣ Create user if not exists
    if (!user) {
      user = await User.create({
        title: "mr",               // DEFAULT VALID VALUE
        name,
        email,
        phone: "0000000000",       // REQUIRED FIELD (Dummy)
        countryCode: "+1",         // REQUIRED FIELD
        age: 18,                   // MINIMUM VALID AGE
        gender: "other",

        passwordHash: "GOOGLE_AUTH_USER", // Required but not used

        googlePhoto: picture,
        role: "user",
        isActive: true,
        isAdminRequested: false
      });
    }

    // 4️⃣ Generate JWT
    const token = generateToken(user);

    return res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: picture,
        role: user.role,
      }
    });

  } catch (err) {
    console.error("Google login error:", err);
    return res.status(500).json({ message: "Google login failed" });
  }
});


export default router;
