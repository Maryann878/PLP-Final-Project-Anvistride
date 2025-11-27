import asyncHandler from "express-async-handler";
import RecycleItem from "../models/RecycleItem.js";
import Vision from "../models/Vision.js";
import Goal from "../models/Goal.js";
import Task from "../models/Task.js";
import Idea from "../models/Idea.js";
import Note from "../models/Note.js";
import JournalEntry from "../models/JournalEntry.js";
import Achievement from "../models/Achievement.js";

// Map type to model
const getModelByType = (type) => {
  const models = {
    vision: Vision,
    goal: Goal,
    task: Task,
    idea: Idea,
    note: Note,
    journal: JournalEntry,
    achievement: Achievement,
  };
  return models[type];
};

// @desc    Create recycle item (when item is deleted)
// @route   POST /api/recycle
// @access  Private
export const createRecycleItem = asyncHandler(async (req, res) => {
  const { type, entityId, data, parentId, parentType, originalLocation } = req.body;

  if (!type || !entityId || !data) {
    res.status(400);
    throw new Error("Type, entityId, and data are required");
  }

  const item = await RecycleItem.create({
    user: req.user.id,
    type,
    entityId,
    data,
    parentId: parentId || null,
    parentType: parentType || null,
    originalLocation: originalLocation || null,
  });

  res.status(201).json(item);
});

// @desc    Get all recycle items for a user
// @route   GET /api/recycle
// @access  Private
export const getRecycleItems = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = { user: req.user.id };

  if (type) filter.type = type;

  const items = await RecycleItem.find(filter).sort({ createdAt: -1 });
  res.status(200).json(items);
});

// @desc    Get single recycle item
// @route   GET /api/recycle/:id
// @access  Private
export const getRecycleItem = asyncHandler(async (req, res) => {
  const item = await RecycleItem.findOne({ _id: req.params.id, user: req.user.id });

  if (!item) {
    res.status(404);
    throw new Error("Recycle item not found");
  }

  res.status(200).json(item);
});

// @desc    Restore item from recycle bin
// @route   POST /api/recycle/:id/restore
// @access  Private
export const restoreItem = asyncHandler(async (req, res) => {
  const item = await RecycleItem.findOne({ _id: req.params.id, user: req.user.id });

  if (!item) {
    res.status(404);
    throw new Error("Recycle item not found");
  }

  const Model = getModelByType(item.type);
  if (!Model) {
    res.status(400);
    throw new Error("Invalid item type");
  }

  // Restore the item by creating it in the original collection
  const restoredData = {
    ...item.data,
    user: req.user.id,
    _id: undefined, // Let MongoDB generate new ID
  };

  // Remove MongoDB-specific fields
  delete restoredData.__v;
  delete restoredData.createdAt;
  delete restoredData.updatedAt;

  const restored = await Model.create(restoredData);

  // Delete from recycle bin
  await item.deleteOne();

  res.status(200).json({
    message: "Item restored successfully",
    restored: restored,
  });
});

// @desc    Permanently delete item from recycle bin
// @route   DELETE /api/recycle/:id
// @access  Private
export const deleteRecycleItem = asyncHandler(async (req, res) => {
  const item = await RecycleItem.findOne({ _id: req.params.id, user: req.user.id });

  if (!item) {
    res.status(404);
    throw new Error("Recycle item not found");
  }

  await item.deleteOne();
  res.status(200).json({ message: "Item permanently deleted" });
});

// @desc    Clear all recycle items
// @route   DELETE /api/recycle
// @access  Private
export const clearRecycleBin = asyncHandler(async (req, res) => {
  await RecycleItem.deleteMany({ user: req.user.id });
  res.status(200).json({ message: "Recycle bin cleared" });
});

