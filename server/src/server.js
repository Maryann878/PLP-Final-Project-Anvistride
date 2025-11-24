// server/src/server.js
import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { initializeSocket } from "./socket/socketServer.js";

dotenv.config();

// -----------------------------
// Environment checks
// -----------------------------
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

const missingEnvVars = [];
if (!mongoUri) missingEnvVars.push("MONGODB_URI (or MONGO_URI)");
if (!jwtSecret) missingEnvVars.push("JWT_SECRET");

if (missingEnvVars.length > 0) {
  console.error("\n❌ Missing required environment variables:");
  missingEnvVars.forEach((v) => console.error(`   - ${v}`));
  console.error("\n📋 On Railway: Project → Service → Variables → add the missing values.");
  console.error("\n💡 Local dev: create server/.env with JWT_SECRET and MONGODB_URI\n");
  // Exit early — better than starting a server that immediately crashes later.
  process.exit(1);
}

// For compatibility: if only MONGO_URI provided, set MONGODB_URI
if (!process.env.MONGODB_URI && process.env.MONGO_URI) {
  process.env.MONGODB_URI = process.env.MONGO_URI;
}

// -----------------------------
// Connect DB (non-blocking startup)
// -----------------------------
connectDB().catch((err) => {
  // connectDB should itself implement retries if desired; here we just log the initial failure.
  console.error("⚠️ Initial DB connection attempt failed:", err.message);
  console.log("🔁 The app will keep running and should reconnect in the background (check logs).");
});

// -----------------------------
// Create app & server
// -----------------------------
const app = express();
const httpServer = createServer(app);

// -----------------------------
// Basic request logger (helps debug incoming/front-end requests)
// -----------------------------
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Origin: ${req.headers.origin || "none"}`);
  next();
});

// -----------------------------
// Security headers
// -----------------------------
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// -----------------------------
// CORS configuration (safe & non-throwing)
// -----------------------------
// Allowed origins - include your Cloudflare Pages domain and local dev hosts.
// If you set CLIENT_URL in Railway, it will be included automatically.
const allowedOrigins = [
  process.env.CLIENT_URL,                  // optional production frontend URL from env
  "https://anvistride.pages.dev",          // your Cloudflare Pages URL
  "http://localhost:5173",                 // Vite default
  "http://localhost:3000"                  // CRA default
].filter(Boolean);

// If you use preview domains or subdomains that follow a pattern, you can tweak this regex.
const cloudflarePreviewRegex = /^https:\/\/[a-z0-9-]+\.pages\.dev$/;

// Use a safe origin callback that **does not throw** (throws become 500s).
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server, native apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || cloudflarePreviewRegex.test(origin)) {
      return callback(null, true);
    }

    // Log blocked origin for debugging; return false (no CORS headers) rather than throwing an error.
    console.warn(`⚠️ CORS origin not allowed: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
};

app.use(cors(corsOptions));
// Optionally respond to preflight requests across the board
app.options("*", cors(corsOptions));

// -----------------------------
// Body parsers
// -----------------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// -----------------------------
// Health / readiness endpoints (Railway uses these)
// -----------------------------
app.get("/", (req, res) => {
  res.status(200).json({ message: "Anvistride API is running 🚀" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  }[dbStatus] || "unknown";

  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: dbStatusText,
    uptime: process.uptime(),
  });
});

// -----------------------------
// Routes (mount after body parsers & CORS)
// -----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/chat", chatRoutes);

// -----------------------------
// Not-found + error middleware
// -----------------------------
app.use(notFound);
app.use(errorHandler);

// -----------------------------
// Socket.io initialization
// -----------------------------
initializeSocket(httpServer);

// -----------------------------
// Process-level uncaught error handlers (logs & graceful behavior)
// -----------------------------
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err && err.stack ? err.stack : err);
  // In production, exit to allow Railway to restart the service
  // In development, continue running for debugging
  if (process.env.NODE_ENV === 'production') {
    console.error("🔄 Exiting process to allow Railway to restart...");
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason && reason.stack ? reason.stack : reason);
  // In production, exit to allow Railway to restart the service
  // In development, continue running for debugging
  if (process.env.NODE_ENV === 'production') {
    console.error("🔄 Exiting process to allow Railway to restart...");
    process.exit(1);
  }
});

// -----------------------------
// Start server
// -----------------------------
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

httpServer.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
});
