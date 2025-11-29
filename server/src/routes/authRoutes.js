// server/src/routes/authRoutes.js
import express from "express";
import asyncHandler from "express-async-handler";
import { 
  registerUser, 
  loginUser, 
  getMe, 
  verifyEmail, 
  resendVerificationEmail 
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRegister, validateLogin } from "../middleware/validationMiddleware.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Apply rate limiting to authentication routes only
// Wrap async controllers with asyncHandler to catch any unhandled promise rejections
router.post("/register", authLimiter, validateRegister, asyncHandler(registerUser));
router.post("/login", authLimiter, validateLogin, asyncHandler(loginUser));
router.post("/verify-email", authLimiter, asyncHandler(verifyEmail));
router.post("/resend-verification", authLimiter, asyncHandler(resendVerificationEmail));
router.get("/me", protect, asyncHandler(getMe));

export default router;
