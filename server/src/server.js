// server/src/server.js
import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import visionRoutes from "./routes/visionRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import recycleBinRoutes from "./routes/recycleBinRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { initializeSocket } from "./socket/socketServer.js";

dotenv.config();

// -----------------------------
// Environment checks
// -----------------------------
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

// Debug: Log available environment variables (for troubleshooting)
if (process.env.NODE_ENV === 'development') {
  console.log("\n🔍 Environment Variables Debug:");
  console.log("   - PORT:", process.env.PORT || "not set (will use 5000)");
  console.log("   - NODE_ENV:", process.env.NODE_ENV || "not set");
  console.log("   - MONGODB_URI:", mongoUri ? "✅ set" : "❌ not set");
  console.log("   - MONGO_URI:", process.env.MONGO_URI ? "✅ set" : "❌ not set");
  console.log("   - JWT_SECRET:", jwtSecret ? "✅ set" : "❌ not set");
  console.log("   - CLIENT_URL:", process.env.CLIENT_URL || "not set");
}

const missingEnvVars = [];
if (!mongoUri) missingEnvVars.push("MONGODB_URI (or MONGO_URI)");
if (!jwtSecret) missingEnvVars.push("JWT_SECRET");

if (missingEnvVars.length > 0) {
  console.error("\n❌ Missing required environment variables:");
  missingEnvVars.forEach((v) => console.error(`   - ${v}`));
  console.error("\n📋 On Railway: Project → Service → Variables → add the missing values.");
  console.error("   Go to: Railway Dashboard → Your Project → Your Service → Variables tab");
  console.error("\n💡 Local dev: create server/.env with JWT_SECRET and MONGODB_URI");
  console.error("\n🔍 Debug Info:");
  console.error("   - Working Directory:", process.cwd());
  console.error("   - Node Version:", process.version);
  console.error("   - Platform:", process.platform);
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
  console.error("⚠️ Full error:", err);
  console.log("🔁 The app will keep running and should reconnect in the background (check logs).");
  console.log("⚠️ WARNING: API endpoints will fail until database is connected!");
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
  // Special logging for profile routes
  if (req.originalUrl.includes('/profile')) {
    console.log(`🔍 PROFILE ROUTE REQUEST: ${req.method} ${req.originalUrl}`);
  }
  next();
});

// -----------------------------
// Security headers with Helmet.js
// -----------------------------
// Using Helmet for comprehensive security headers
// CSP is disabled initially to ensure Socket.IO WebSocket connections work
// You can enable CSP later with proper configuration for your app
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for Socket.IO compatibility - enable later with proper config
  crossOriginEmbedderPolicy: false, // Needed for Socket.IO WebSocket connections
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
}));

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
// CORS middleware already handles OPTIONS requests automatically
// No need for explicit app.options("*") in Express 5

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
app.use("/api/profile", profileRoutes);
app.use("/api/visions", visionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/recycle", recycleBinRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/notifications", notificationRoutes);
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
