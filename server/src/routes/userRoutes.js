// server/src/routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route GET /api/users/me
// @desc Get current user data
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

export default router;
