import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
 
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
 
// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/transactions", transactionRoutes);
 
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
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
