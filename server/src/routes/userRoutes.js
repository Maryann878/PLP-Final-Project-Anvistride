// server/src/routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// @route GET /api/users/me
// @desc Get current user data
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

// @route GET /api/users/search
// @desc Search users by name or email
router.get("/search", protect, asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ message: "Search query must be at least 2 characters" });
  }

  const searchRegex = new RegExp(q.trim(), "i");
  const users = await User.find({
    $or: [
      { name: searchRegex },
      { email: searchRegex },
    ],
    _id: { $ne: req.user.id }, // Exclude current user
  })
    .select("_id name email")
    .limit(20);

  res.status(200).json(
    users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    }))
  );
}));

export default router;
