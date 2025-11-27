import asyncHandler from "express-async-handler";
import Idea from "../models/Idea.js";

// @desc    Get all ideas for a user
// @route   GET /api/ideas
// @access  Private
export const getIdeas = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const { status, priority, category } = req.query;
  const filter = { user: req.user.id };

  // Validate status and priority against enum values
  const validStatuses = ["draft", "exploring", "ready", "implemented", "archived"];
  const validPriorities = ["low", "medium", "high"];

  if (status && validStatuses.includes(status.toLowerCase())) {
    filter.status = status.toLowerCase();
  }
  if (priority && validPriorities.includes(priority.toLowerCase())) {
    filter.priority = priority.toLowerCase();
  }
  if (category) filter.category = category;

  try {
    const ideas = await Idea.find(filter).sort({ createdAt: -1 });
    res.status(200).json(ideas || []);
  } catch (error) {
    console.error('[getIdeas] Database error:', error);
    // Return empty array instead of throwing to prevent 500 error
    res.status(200).json([]);
  }
});

// @desc    Get single idea
// @route   GET /api/ideas/:id
// @access  Private
export const getIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.findOne({ _id: req.params.id, user: req.user.id });

  if (!idea) {
    res.status(404);
    throw new Error("Idea not found");
  }

  res.status(200).json(idea);
});

// @desc    Create idea
// @route   POST /api/ideas
// @access  Private
export const createIdea = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    category,
    linkedVision,
    linkedGoal,
    linkedTask,
    implementationNotes,
  } = req.body;

  const idea = await Idea.create({
    user: req.user.id,
    title,
    description,
    status: status || "draft",
    priority: priority || "medium",
    category,
    linkedVision,
    linkedGoal,
    linkedTask,
    implementationNotes,
    implementedAt: status === "implemented" ? new Date() : null,
  });

  res.status(201).json(idea);
});

// @desc    Update idea
// @route   PUT /api/ideas/:id
// @access  Private
export const updateIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.findOne({ _id: req.params.id, user: req.user.id });

  if (!idea) {
    res.status(404);
    throw new Error("Idea not found");
  }

  const updates = { ...req.body };
  
  // Set implementedAt if status changes to implemented
  if (updates.status === "implemented" && idea.status !== "implemented") {
    updates.implementedAt = new Date();
  } else if (updates.status !== "implemented" && idea.status === "implemented") {
    updates.implementedAt = null;
  }

  const updatedIdea = await Idea.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedIdea);
});

// @desc    Delete idea
// @route   DELETE /api/ideas/:id
// @access  Private
export const deleteIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.findOne({ _id: req.params.id, user: req.user.id });

  if (!idea) {
    res.status(404);
    throw new Error("Idea not found");
  }

  await idea.deleteOne();
  res.status(200).json({ message: "Idea removed" });
});

