// server/src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendVerificationEmail, sendPasswordResetEmail, isEmailConfigured } from "../utils/emailService.js";

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
      return res.status(409).json({ 
        message: "An account with this email already exists. Please log in instead.",
        code: "EMAIL_EXISTS"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token only if email service is configured
    const emailServiceEnabled = isEmailConfigured();
    const verificationToken = emailServiceEnabled 
      ? crypto.randomBytes(32).toString('hex')
      : null;
    const verificationExpires = verificationToken 
      ? Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      : null;

    // Create user
    const newUser = await User.create({
      name: username,
      email,
      password: hashedPassword,
      isEmailVerified: !emailServiceEnabled, // ✅ Auto-verify if no email service
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // Try to send verification email (non-blocking)
    if (verificationToken) {
      sendVerificationEmail(email, verificationToken, username).catch(err => {
        console.error('Failed to send verification email:', err);
        // ✅ Registration still succeeds even if email fails
      });
    }

    // ✅ Always return token - don't block users
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: emailServiceEnabled
        ? "Registration successful. Please check your email to verify your account."
        : "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isEmailVerified: newUser.isEmailVerified,
        createdAt: newUser.createdAt,
      },
      token, // ✅ Still return token for immediate login
      requiresVerification: !!verificationToken,
    });
  } catch (error) {
    // Always log full error details for Railway debugging
    console.error("❌ Registration error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue,
    });
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error",
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    // Check for MongoDB duplicate key errors
    if (error.code === 11000 || error.name === 'MongoServerError') {
      const field = Object.keys(error.keyPattern || {})[0];
      console.error("❌ MongoDB duplicate key error:", field, error.keyValue);
      if (field === 'email') {
        return res.status(409).json({ 
          message: "An account with this email already exists. Please log in instead.",
          code: "EMAIL_EXISTS"
        });
      }
      return res.status(400).json({ 
        message: "Duplicate entry",
        field: field
      });
    }
    
    // Check for MongoDB connection errors
    if (error.name === 'MongooseError' || error.message?.includes('Mongo') || error.message?.includes('connection')) {
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
    
    // Generic error - log everything for debugging
    console.error("❌ Unexpected registration error:", error);
    res.status(500).json({ 
      message: "Server error during registration",
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
        return res.status(401).json({ 
          message: "No account found with this email address.",
          code: "USER_NOT_FOUND"
        });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Password mismatch for user:', email);
        }
        return res.status(401).json({ 
          message: "Incorrect password. Please try again.",
          code: "INVALID_PASSWORD"
        });
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
      // Always log full error details for Railway debugging
      console.error("❌ Login error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      
      // Provide more specific error messages
      if (error.name === 'JsonWebTokenError') {
        console.error("❌ JWT error:", error.message);
        return res.status(500).json({ message: "Token generation failed" });
      }
      
      // Check for MongoDB connection errors
      if (error.name === 'MongoServerError' || error.name === 'MongooseError' || error.message?.includes('Mongo') || error.message?.includes('connection')) {
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
      
      // Generic error - log everything for debugging
      console.error("❌ Unexpected login error:", error);
      res.status(500).json({ 
        message: "Server error during login",
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

// @desc Verify email address
// @route POST /api/auth/verify-email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        message: "Verification token is required",
        code: "TOKEN_REQUIRED"
      });
    }

    // Find user with valid verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired verification token",
        code: "INVALID_TOKEN"
      });
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Generate and return token
    const authToken = generateToken(user._id);

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: true,
        createdAt: user.createdAt,
      },
      token: authToken,
    });
  } catch (error) {
    console.error("❌ Email verification error:", error);
    res.status(500).json({ 
      message: "Server error during email verification",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc Resend verification email
// @route POST /api/auth/resend-verification
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: "Email address is required",
        code: "EMAIL_REQUIRED"
      });
    }

    // Check if email service is configured
    if (!isEmailConfigured()) {
      return res.status(503).json({ 
        message: "Email service is not configured",
        code: "EMAIL_SERVICE_UNAVAILABLE"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({ 
        message: "If an account exists with this email, a verification email has been sent."
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ 
        message: "Email address is already verified",
        code: "ALREADY_VERIFIED"
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Update user with new token
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken, user.name);

    if (!emailResult.success) {
      return res.status(500).json({ 
        message: "Failed to send verification email. Please try again later.",
        code: "EMAIL_SEND_FAILED"
      });
    }

    res.status(200).json({
      message: "Verification email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("❌ Resend verification error:", error);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc Request password reset
// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: "Email address is required",
        code: "EMAIL_REQUIRED"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    // Don't reveal if email exists for security
    // Always return success message even if user doesn't exist
    if (!user) {
      return res.status(200).json({ 
        message: "If an account exists with this email, a password reset link has been sent."
      });
    }

    // Check if email service is configured
    if (!isEmailConfigured()) {
      return res.status(503).json({ 
        message: "Email service is not configured",
        code: "EMAIL_SERVICE_UNAVAILABLE"
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    // Update user with reset token
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);

    if (!emailResult.success) {
      return res.status(500).json({ 
        message: "Failed to send password reset email. Please try again later.",
        code: "EMAIL_SEND_FAILED"
      });
    }

    res.status(200).json({
      message: "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc Reset password with token
// @route POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({ 
        message: "Reset token is required",
        code: "TOKEN_REQUIRED"
      });
    }

    if (!password) {
      return res.status(400).json({ 
        message: "Password is required",
        code: "PASSWORD_REQUIRED"
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long",
        code: "PASSWORD_TOO_SHORT"
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired reset token",
        code: "INVALID_TOKEN"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

  