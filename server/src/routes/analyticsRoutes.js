// server/src/routes/analyticsRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route("/").get(getAnalytics);

export default router;

