// server/src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON payloads

// ========================
// 👇 Example Routes
// ========================
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Anvistride API 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


// ========================
// 🧩 Error Handling Middleware
// ========================
app.use(notFound);
app.use(errorHandler);

// ========================
// 🚀 Start Server
// ========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
