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
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName] && !process.env[varName.replace('MONGODB_URI', 'MONGO_URI')]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please set these variables in your Railway environment settings.');
  process.exit(1);
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
  "https://anvistride.pages.dev", // Cloudflare Pages
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean); // Remove any undefined values

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Normalize origin (remove trailing slash)
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    
    // Check if origin is in allowed list (exact match or normalized)
    if (allowedOrigins.includes(origin) || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      // Log for debugging
      console.warn(`CORS blocked origin: ${origin}`);
      console.warn(`Allowed origins:`, allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400 // 24 hours
};

// Handle preflight requests - must be before CORS middleware
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    
    // Check if origin is allowed
    if (!origin) {
      return res.status(200).end();
    }
    
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    const isAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes(normalizedOrigin);
    
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Max-Age', '86400');
      return res.status(200).end();
    }
    
    return res.status(403).end();
  }
  next();
});

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --- Health Check Routes (Required for Railway) ---
app.get("/", (req, res) => {
  res.status(200).json({ message: "Anvistride API is running 🚀" });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
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

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
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
