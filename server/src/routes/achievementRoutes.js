import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createAchievement,
  deleteAchievement,
  getAchievement,
  getAchievements,
  updateAchievement,
} from "../controllers/achievementController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAchievements).post(createAchievement);
router
  .route("/:id")
  .get(getAchievement)
  .put(updateAchievement)
  .delete(deleteAchievement);

export default router;

