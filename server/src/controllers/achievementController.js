import asyncHandler from "express-async-handler";
import Achievement from "../models/Achievement.js";

const buildFilter = (userId, query) => {
  const filter = { user: userId };
  if (query.visionId) filter.relatedVision = query.visionId;
  if (query.goalId) filter.relatedGoal = query.goalId;
  if (query.visibility) filter.visibility = query.visibility;
  return filter;
};

const findAchievementOrThrow = async (id, userId) => {
  const achievement = await Achievement.findById(id);
  if (!achievement || achievement.user.toString() !== userId) {
    const error = new Error("Achievement not found");
    error.statusCode = 404;
    throw error;
  }
  return achievement;
};

// @desc    List achievements
// @route   GET /api/achievements
// @access  Private
export const getAchievements = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.user.id, req.query);
  const achievements = await Achievement.find(filter).sort({ achievedOn: -1 });
  res.status(200).json(achievements);
});

// @desc    Create achievement
// @route   POST /api/achievements
// @access  Private
export const createAchievement = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error("Title is required");
  }

  const achievement = await Achievement.create({
    user: req.user.id,
    ...req.body,
  });

  res.status(201).json(achievement);
});

// @desc    Get achievement
// @route   GET /api/achievements/:id
// @access  Private
export const getAchievement = asyncHandler(async (req, res) => {
  const achievement = await findAchievementOrThrow(req.params.id, req.user.id);
  res.status(200).json(achievement);
});

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private
export const updateAchievement = asyncHandler(async (req, res) => {
  await findAchievementOrThrow(req.params.id, req.user.id);
  const updated = await Achievement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updated);
});

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private
export const deleteAchievement = asyncHandler(async (req, res) => {
  const achievement = await findAchievementOrThrow(req.params.id, req.user.id);
  await achievement.deleteOne();
  res.status(200).json({ message: "Achievement removed" });
});

