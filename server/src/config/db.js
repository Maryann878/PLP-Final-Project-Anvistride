import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.error("❌ MongoDB URI is not defined in environment variables");
      throw new Error("MongoDB URI is not defined");
    }

    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    await mongoose.connect(mongoURI, options);
    isConnected = true;
    console.log("✅ MongoDB Connected");
    
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
    console.error("❌ MongoDB Connection Failed:", error.message);
    // Don't exit - let the server start and retry connection
    isConnected = false;
    // Retry connection after 5 seconds
    setTimeout(() => {
      console.log("🔄 Retrying MongoDB connection...");
      connectDB();
    }, 5000);
  }
};

export default connectDB;
