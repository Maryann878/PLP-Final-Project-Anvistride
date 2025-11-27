import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";

// @desc    Get all activities for a user
// @route   GET /api/activities
// @access  Private
export const getActivities = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const { entity, type, limit = 50 } = req.query;
  const filter = { user: req.user.id };

  if (entity) filter.entity = entity;
  if (type) filter.type = type;

  // Validate and parse limit
  const limitNum = parseInt(limit);
  const validLimit = isNaN(limitNum) || limitNum <= 0 ? 50 : Math.min(limitNum, 1000); // Max 1000

  try {
    const activities = await Activity.find(filter)
      .sort({ createdAt: -1 })
      .limit(validLimit);
    res.status(200).json(activities || []);
  } catch (error) {
    console.error('[getActivities] Database error:', error);
    // Return empty array instead of throwing to prevent 500 error
    res.status(200).json([]);
  }
});

// @desc    Create activity
// @route   POST /api/activities
// @access  Private
export const createActivity = asyncHandler(async (req, res) => {
  const { type, entity, itemId, itemTitle, action } = req.body;

  if (!type || !entity || !itemId) {
    res.status(400);
    throw new Error("Type, entity, and itemId are required");
  }

  const activity = await Activity.create({
    user: req.user.id,
    type,
    entity,
    itemId,
    itemTitle: itemTitle || "",
    action: action || "",
  });

  res.status(201).json(activity);
});

// @desc    Clear activities
// @route   DELETE /api/activities
// @access  Private
export const clearActivities = asyncHandler(async (req, res) => {
  await Activity.deleteMany({ user: req.user.id });
  res.status(200).json({ message: "Activities cleared" });
});

