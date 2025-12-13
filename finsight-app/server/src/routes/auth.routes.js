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
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email and password. Optionally request admin access during registration.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - name
 *               - email
 *               - phone
 *               - countryCode
 *               - age
 *               - gender
 *               - password
 *             properties:
 *               title:
 *                 type: string
 *                 enum: [mr, ms, mrs, dr, prof]
 *                 example: "mr"
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               countryCode:
 *                 type: string
 *                 example: "+1"
 *               age:
 *                 type: integer
 *                 minimum: 18
 *                 example: 30
 *               gender:
 *                 type: string
 *                 enum: [male, female, other, prefer-not-to-say]
 *                 example: "male"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 format: password
 *                 example: "SecurePassword123!"
 *               requestAdmin:
 *                 type: boolean
 *                 description: Request admin access (pending approval)
 *                 example: false
 *           examples:
 *             normalUser:
 *               summary: Normal user registration
 *               value:
 *                 title: "mr"
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 phone: "1234567890"
 *                 countryCode: "+1"
 *                 age: 30
 *                 gender: "male"
 *                 password: "SecurePassword123!"
 *                 requestAdmin: false
 *             adminRequest:
 *               summary: User requesting admin access
 *               value:
 *                 title: "dr"
 *                 name: "Jane Smith"
 *                 email: "jane.smith@example.com"
 *                 phone: "9876543210"
 *                 countryCode: "+1"
 *                 age: 35
 *                 gender: "female"
 *                 password: "AdminPass456!"
 *                 requestAdmin: true
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registered"
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     isAdminRequested:
 *                       type: boolean
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "Invalid email format"
 *                       param:
 *                         type: string
 *                         example: "email"
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already exists"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration failed"
 */
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
      console.log("REGISTER PAYLOAD:", req.body);

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
        requestAdmin,
      } = req.body;

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing)
        return res.status(409).json({ message: "Email already exists" });

      const passwordHash = await bcrypt.hash(password, 10);

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
        role: "user",
        isAdminRequested,
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
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePassword123!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid login"
 *       403:
 *         description: Account is inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Inactive account"
 *       500:
 *         description: Server error
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid login" });

    if (!user.isActive)
      return res.status(403).json({ message: "Inactive account" });

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
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Retrieve current authenticated user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     isAdminRequested:
 *                       type: boolean
 *       401:
 *         description: Unauthorized - No token or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not found"
 */
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
/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Google OAuth login
 *     description: Authenticate user with Google ID token. Creates new account if user doesn't exist.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token from Firebase
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI3..."
 *     responses:
 *       200:
 *         description: Google login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Google login successful"
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     photo:
 *                       type: string
 *                       description: Google profile photo URL
 *                     role:
 *                       type: string
 *                       example: "user"
 *       400:
 *         description: No Google token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Google token provided"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Google login failed"
 */
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
        title: "mr",
        name,
        email,
        phone: "0000000000",
        countryCode: "+1",
        age: 18,
        gender: "other",
        passwordHash: "GOOGLE_AUTH_USER",
        googlePhoto: picture,
        role: "user",
        isActive: true,
        isAdminRequested: false,
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
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(500).json({ message: "Google login failed" });
  }
});

export default router;
