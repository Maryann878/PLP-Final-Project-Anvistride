// server/src/server.js
import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { initializeSocket } from "./socket/socketServer.js";

dotenv.config();

// Validate required environment variables
// Check for both MONGODB_URI and MONGO_URI (Railway sometimes uses MONGO_URI)
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

const missingEnvVars = [];
if (!mongoUri) {
  missingEnvVars.push('MONGODB_URI (or MONGO_URI)');
}
if (!jwtSecret) {
  missingEnvVars.push('JWT_SECRET');
}

if (missingEnvVars.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n📋 To fix this on Railway:');
  console.error('   1. Go to your Railway project dashboard');
  console.error('   2. Click on your service → Variables tab');
  console.error('   3. Add the following environment variables:');
  console.error('      - JWT_SECRET: (any secure random string, e.g., generate with: openssl rand -base64 32)');
  console.error('      - MONGODB_URI: (your MongoDB connection string)');
  console.error('\n💡 For local development, create a .env file in the server/ directory with:');
  console.error('   JWT_SECRET=your-secret-key-here');
  console.error('   MONGODB_URI=mongodb://localhost:27017/anvistride\n');
  process.exit(1);
}

// Set MONGODB_URI if MONGO_URI was provided (for compatibility)
if (!process.env.MONGODB_URI && process.env.MONGO_URI) {
  process.env.MONGODB_URI = process.env.MONGO_URI;
}

// Connect DB
connectDB();

// Express app
const app = express();
const httpServer = createServer(app);

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// --- FIXED CORS (Railway/Vercel/Cloudflare Safe) ---
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://anvistride.pages.dev",
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

const cloudflarePreviewRegex = /^https:\/\/[a-z0-9-]+\.anvistride\.pages\.dev$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        cloudflarePreviewRegex.test(origin)
      ) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --- Health Check Routes (Required for Railway) ---
app.get("/", (req, res) => {
  res.status(200).json({ message: "Anvistride API is running 🚀" });
});

app.get("/health", (req, res) => {
  // Respond immediately - don't wait for DB connection
  // This ensures Railway healthcheck passes even during startup
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Also keep your API health endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/chat", chatRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

// Socket.io
initializeSocket(httpServer);

// Start Server
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all interfaces for Railway/Docker

httpServer.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
});




// server/src/server.js
// import express from "express";
// import { createServer } from "http";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import goalRoutes from "./routes/goalRoutes.js";
// import chatRoutes from "./routes/chatRoutes.js";
// import { initializeSocket } from "./socket/socketServer.js";

// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// // Initialize Express app
// const app = express();

// // Create HTTP server for Socket.IO
// const httpServer = createServer(app);

// // Middleware
// // Security headers
// app.use((req, res, next) => {
//   res.setHeader('X-Content-Type-Options', 'nosniff');
//   res.setHeader('X-Frame-Options', 'DENY');
//   res.setHeader('X-XSS-Protection', '1; mode=block');
//   res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
//   next();
// });

// // CORS configuration - allow all origins in development, restrict in production
// const allowedOrigins = process.env.NODE_ENV === 'production' 
//   ? (process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [])
//   : ['http://localhost:5173', 'http://localhost:3000', '*'];

// app.use(cors({
//   origin: (origin, callback) => {
//     // Allow requests with no origin (mobile apps, curl, etc.)
//     if (!origin || process.env.NODE_ENV !== 'production') {
//       return callback(null, true);
//     }
    
//     if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Body parser with size limit
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // ========================
// // 👇 Routes
// // ========================
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Welcome to the Anvistride API 🚀" });
// });

// // Health check endpoint for deployment platforms
// app.get("/api/health", (req, res) => {
//   res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
// });



// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/goals", goalRoutes);
// app.use("/api/chat", chatRoutes);


// // ========================
// // 🧩 Error Handling Middleware
// // ========================
// app.use(notFound);
// app.use(errorHandler);

// // ========================
// // 🔌 Initialize Socket.IO
// // ========================
// initializeSocket(httpServer);

// // ========================
// // 🚀 Start Server
// // ========================
// const PORT = process.env.PORT || 5000;

// httpServer.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
//   console.log(`🔌 Socket.IO initialized`);
// });
