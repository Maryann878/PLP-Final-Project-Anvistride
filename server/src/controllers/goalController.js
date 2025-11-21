import asyncHandler from "express-async-handler";
import Goal from "../models/Goal.js";

// @desc    Get all goals for a user
// @route   GET /api/goals
// @access  Private
export const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json(goals);
});

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Please provide both title and description");
  }

  const goal = await Goal.create({
    user: req.user.id,
    title,
    description,
  });

  res.status(201).json(goal);
});

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }

  // Check if the goal belongs to the logged-in user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized to update this goal");
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
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }

  // Check if the goal belongs to the logged-in user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized to delete this goal");
  }

  await goal.deleteOne();

  res.status(200).json({ message: "Goal removed" });
});
