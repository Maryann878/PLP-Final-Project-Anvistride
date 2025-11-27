import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";

const router = express.Router();

// Test route without auth to verify routing works
router.get("/test", (req, res) => {
  console.log("✅ Profile route test endpoint hit!");
  res.json({ message: "Profile routes are working!", path: req.path, originalUrl: req.originalUrl });
});

// Debug middleware to log all profile route requests
router.use((req, res, next) => {
  console.log(`🔵 [Profile Route] ${req.method} ${req.path} - Full URL: ${req.originalUrl}`);
  next();
});

router.use(protect);

router.route("/me")
  .get((req, res, next) => {
    console.log("✅ [Profile Route] GET /me handler called");
    next();
  }, getMyProfile)
  .put((req, res, next) => {
    console.log("✅ [Profile Route] PUT /me handler called");
    next();
  }, updateMyProfile);

export default router;

