import mongoose from "mongoose";

let isConnected = false;
let retryTimeout = null; // Track retry timeout to prevent memory leaks

const connectDB = async () => {
  // If already connected, return
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return;
  }

  // Clear any existing retry timeout to prevent multiple retries
  if (retryTimeout) {
    clearTimeout(retryTimeout);
    retryTimeout = null;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.error("❌ MongoDB URI is not defined in environment variables");
      throw new Error("MongoDB URI is not defined");
    }

    const options = {
      serverSelectionTimeoutMS: 10000, // Increased to 10s for Railway/Atlas
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 10000, // Connection timeout
    };

    await mongoose.connect(mongoURI, options);
    isConnected = true;
    console.log("✅ MongoDB Connected");
    console.log("✅ Database Name:", mongoose.connection.db?.databaseName || "unknown");
    console.log("✅ Connection State:", mongoose.connection.readyState === 1 ? "connected" : "not connected");
    
    // Clear retry timeout on successful connection
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      retryTimeout = null;
    }
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error("❌ MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn("⚠️ MongoDB disconnected");
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log("✅ MongoDB reconnected");
      isConnected = true;
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:");
    console.error("   Error message:", error.message);
    console.error("   Error name:", error.name);
    console.error("   Error code:", error.code);
    if (error.stack) console.error("   Stack:", error.stack);
    // Don't exit - let the server start and retry connection
    isConnected = false;
    // Retry connection after 5 seconds (only if not already retrying)
    if (!retryTimeout) {
      retryTimeout = setTimeout(() => {
        retryTimeout = null; // Clear reference before retry
        console.log("🔄 Retrying MongoDB connection...");
        connectDB();
      }, 5000);
    }
  }
};

export default connectDB;
