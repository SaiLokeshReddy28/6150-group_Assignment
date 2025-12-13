import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
 
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import insightsRoutes from "./routes/insightsRoutes.js";
 
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 5001;

// ---------- SWAGGER CONFIG ----------
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finsight API Documentation",
      version: "1.0.0",
      description: "Personal Finance Management API - Academic Project for Course 6105",
    },
    servers: [
      {
        url: "https://finsight-backend-gwci.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:5001",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "Authentication" },
      { name: "Admin" },
      { name: "Transactions" },
      { name: "Uploads" },
      { name: "Health" },
    ],
  },
  apis: ["./src/routes/*.js", "./src/index.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
 
// ---------- CORS MIDDLEWARE ----------
// NOTE: When you deploy to Vercel, you may have multiple domains (prod + previews).
// Set one of these on Render:
//   CLIENT_URL=https://<your-prod-vercel-domain>
//   ALLOWED_ORIGINS=https://a.vercel.app,https://b.vercel.app (optional extra list)
//   ALLOW_VERCEL_PREVIEWS=true (optional)

const allowedOrigins = new Set(
  [
    "http://localhost:5173", // Vite dev server
    "http://localhost:3000", // CRA (optional)
    "https://finsight-backend-gwci.onrender.com", // backend itself (Swagger)
    process.env.CLIENT_URL, // primary production frontend
    ...(process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
      : []),
  ].filter(Boolean)
);

const corsOptions = {
  origin(origin, callback) {
    // Allow tools like curl / Postman with no origin
    if (!origin) return callback(null, true);

    // Allow exact matches
    if (allowedOrigins.has(origin)) return callback(null, true);

    // Optional: allow Vercel preview URLs (recommended during development)
    if (
      process.env.ALLOW_VERCEL_PREVIEWS === "true" &&
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    console.warn("⚠️ Blocked by CORS, origin:", origin);
    console.log("✅ Allowed origins:", Array.from(allowedOrigins));
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  // If you are ONLY using JWT in the Authorization header (no cookies), you can set this to false.
  credentials: process.env.CORS_CREDENTIALS === "true",
};

app.use(cors(corsOptions));

// Preflight for all routes
app.options("*", cors(corsOptions));
 
// ---------- OTHER MIDDLEWARE ----------
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

// ---------- SWAGGER DOCUMENTATION ----------
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
app.use("/api/budgets", budgetRoutes);
app.use("/api/insights", insightsRoutes);
 
// ---------- HEALTH CHECK ----------
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