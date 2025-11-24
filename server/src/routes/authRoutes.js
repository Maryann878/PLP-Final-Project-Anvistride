// server/src/routes/authRoutes.js
import express from "express";
import asyncHandler from "express-async-handler";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRegister, validateLogin } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Wrap async controllers with asyncHandler to catch any unhandled promise rejections
router.post("/register", validateRegister, asyncHandler(registerUser));
router.post("/login", validateLogin, asyncHandler(loginUser));
router.get("/me", protect, asyncHandler(getMe));

export default router;
