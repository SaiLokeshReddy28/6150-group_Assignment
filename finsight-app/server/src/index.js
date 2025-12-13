import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
 
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
 
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 5001;
 
// ---------- CORS MIDDLEWARE ----------
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // keep if you ever use CRA
  process.env.CLIENT_URL, // Production frontend (Vercel)
].filter(Boolean); // Remove undefined values
 
app.use(
  cors({
    origin(origin, callback) {
      // Allow tools like curl / Postman with no origin
      if (!origin) return callback(null, true);
 
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn("⚠️ Blocked by CORS, origin:", origin);
      console.log("✅ Allowed origins:", allowedOrigins);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
 
// Preflight for all routes
app.options("*", cors());
 
// ---------- OTHER MIDDLEWARE ----------
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

// ---------- SWAGGER DOCUMENTATION ----------
/**
 * @swagger
 * /:
 *   get:
 *     summary: API Root
 *     description: Welcome message and links to documentation
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome to Finsight API"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 documentation:
 *                   type: string
 *                   example: "/api-docs"
 */
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Finsight API",
    version: "1.0.0",
    documentation: "/api-docs",
    health: "/api/health",
  });
});

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Finsight API Documentation",
  })
);

// Swagger JSON endpoint
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
 
// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/transactions", transactionRoutes);
 
// ---------- HEALTH CHECK ----------
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running and connected to database
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 message:
 *                   type: string
 *                   example: "Finsight API is running"
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Finsight API is running" });
});
 
// ---------- DB CONNECT + START ----------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });