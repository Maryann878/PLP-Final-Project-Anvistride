// server/src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc Register new user
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name: username,
      email,
      password: hashedPassword,
    });

    // Return token
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error stack:", error.stack);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error",
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    // Check for MongoDB connection errors
    if (error.name === 'MongoServerError' || error.name === 'MongooseError' || error.message?.includes('Mongo')) {
      console.error("❌ Database connection issue:", error.message);
      return res.status(500).json({ 
        message: "Database connection error. Please try again.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Check for network/timeout errors
    if (error.message?.includes('timeout') || error.message?.includes('ECONNREFUSED')) {
      console.error("❌ Database connection timeout:", error.message);
      return res.status(500).json({ 
        message: "Database connection timeout. Please try again.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// @desc Login user
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Login attempt - email:', email, 'password provided:', !!password);
      }
  
      // Check if JWT_SECRET is configured
      if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET is not defined in environment variables");
        return res.status(500).json({ message: "Server configuration error" });
      }
  
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        if (process.env.NODE_ENV === 'development') {
          console.log('User not found for email:', email);
        }
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Password mismatch for user:', email);
        }
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error stack:", error.stack);
      
      // Provide more specific error messages
      if (error.name === 'JsonWebTokenError') {
        return res.status(500).json({ message: "Token generation failed" });
      }
      
      // Check for MongoDB connection errors
      if (error.name === 'MongoServerError' || error.name === 'MongooseError' || error.message?.includes('Mongo')) {
        console.error("❌ Database connection issue:", error.message);
        return res.status(500).json({ 
          message: "Database connection error. Please try again.",
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
      
      // Check for network/timeout errors
      if (error.message?.includes('timeout') || error.message?.includes('ECONNREFUSED')) {
        console.error("❌ Database connection timeout:", error.message);
        return res.status(500).json({ 
          message: "Database connection timeout. Please try again.",
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
      
      res.status(500).json({ 
        message: "Server error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
  };

// ✅ Get current logged-in user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

  