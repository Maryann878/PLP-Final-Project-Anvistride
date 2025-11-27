import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";
import Goal from "../models/Goal.js";

const ensureGoalOwnership = async (goalId, userId) => {
  if (!goalId) return;
  const goal = await Goal.findById(goalId);
  if (!goal || goal.user.toString() !== userId) {
    const error = new Error("Goal not found");
    error.statusCode = 404;
    throw error;
  }
};

// build query filter
const buildFilter = (userId, { status, goalId, standalone }) => {
  const filter = { user: userId };
  if (status) filter.status = status;
  if (goalId) filter.goal = goalId;
  if (standalone === "true") filter.isStandalone = true;
  if (standalone === "false") filter.isStandalone = false;
  return filter;
};

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.user.id, req.query);
  const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
  res.status(200).json(tasks);
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, goal: goalId } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Task title is required");
  }

  if (goalId) {
    await ensureGoalOwnership(goalId, req.user.id);
  }

  const task = await Task.create({
    user: req.user.id,
    isStandalone: !goalId,
    ...req.body,
  });

  res.status(201).json(task);
});

const findTaskOrThrow = async (id, userId) => {
  const task = await Task.findById(id);
  if (!task || task.user.toString() !== userId) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }
  return task;
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = asyncHandler(async (req, res) => {
  const task = await findTaskOrThrow(req.params.id, req.user.id);
  res.status(200).json(task);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const { goal: goalId } = req.body;
  const task = await findTaskOrThrow(req.params.id, req.user.id);

  if (goalId && goalId.toString() !== (task.goal || "").toString()) {
    await ensureGoalOwnership(goalId, req.user.id);
  }

  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      isStandalone: !req.body.goal,
    },
    { new: true }
  );

  res.status(200).json(updated);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await findTaskOrThrow(req.params.id, req.user.id);
  await task.deleteOne();
  res.status(200).json({ message: "Task removed" });
});

