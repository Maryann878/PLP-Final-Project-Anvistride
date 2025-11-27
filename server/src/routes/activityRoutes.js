import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getActivities,
  createActivity,
  clearActivities,
} from "../controllers/activityController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getActivities).post(createActivity).delete(clearActivities);

export default router;

