import express from "express";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected
router.route("/")
  .get(protect, getGoals)     // GET /api/goals → fetch all goals
  .post(protect, createGoal); // POST /api/goals → create a new goal

router.route("/:id")
  .put(protect, updateGoal)   // PUT /api/goals/:id → update a goal
  .delete(protect, deleteGoal); // DELETE /api/goals/:id → delete a goal

export default router;
