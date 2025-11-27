import asyncHandler from "express-async-handler";
import Goal from "../models/Goal.js";
import Vision from "../models/Vision.js";

const findGoalOrThrow = async (goalId, userId) => {
  const goal = await Goal.findById(goalId);
  if (!goal || goal.user.toString() !== userId) {
    const error = new Error("Goal not found");
    error.statusCode = 404;
    throw error;
  }
  return goal;
};

const ensureVisionOwnership = async (visionId, userId) => {
  if (!visionId) return;
  const vision = await Vision.findById(visionId);
  if (!vision || vision.user.toString() !== userId) {
    const error = new Error("Vision not found");
    error.statusCode = 404;
    throw error;
  }
};

// @desc    Get all goals for a user
// @route   GET /api/goals
// @access  Private
export const getGoals = asyncHandler(async (req, res) => {
  const { status, visionId } = req.query;
  const filter = { user: req.user.id };
  if (status) filter.status = status;
  if (visionId) filter.vision = visionId;

  const goals = await Goal.find(filter).sort({ priority: -1, updatedAt: -1 });
  res.status(200).json(goals);
});

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = asyncHandler(async (req, res) => {
  const { title, description, vision } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Please provide both title and description");
  }

  await ensureVisionOwnership(vision, req.user.id);

  const goal = await Goal.create({
    user: req.user.id,
    ...req.body,
  });

  res.status(201).json(goal);
});

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = asyncHandler(async (req, res) => {
  await findGoalOrThrow(req.params.id, req.user.id);

  if (req.body.vision) {
    await ensureVisionOwnership(req.body.vision, req.user.id);
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await findGoalOrThrow(req.params.id, req.user.id);
  await goal.deleteOne();

  res.status(200).json({ message: "Goal removed" });
});
