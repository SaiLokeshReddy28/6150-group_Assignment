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
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // keep if you ever use CRA
  "https://finsight-backend-gwci.onrender.com", // ✅ BACKEND ITSELF (for Swagger UI)
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