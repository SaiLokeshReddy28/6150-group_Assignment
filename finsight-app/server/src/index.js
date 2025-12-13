import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ----------------------
// CORS CONFIGURATION
// ----------------------
const allowedOrigins = [
  "http://localhost:5173",   // Vite dev server
  "https://finsight-app-sigma.vercel.app/",   // CRA fallback
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman, curl (no-origin requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Preflight
app.options("*", cors());

// ----------------------
// MIDDLEWARE
// ----------------------
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

// ----------------------
// ROUTES
// ----------------------
app.use("/api/auth", authRoutes);        // Login / Signup
app.use("/api/uploads", uploadRoutes);   // Document uploads
app.use("/api/admin", adminRoutes);      // Admin dashboard APIs

// ----------------------
// HEALTH CHECK
// ----------------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Finsight API is running" });
});

// ----------------------
// CONNECT DATABASE + START SERVER
// ----------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
