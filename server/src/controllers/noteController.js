import asyncHandler from "express-async-handler";
import Note from "../models/Note.js";

const buildFilter = (userId, query) => {
  const filter = { user: userId };
  if (query.tag) filter.tags = query.tag;
  if (query.pinned) filter.pinned = query.pinned === "true";
  if (query.visionId) filter.relatedVision = query.visionId;
  if (query.goalId) filter.relatedGoal = query.goalId;
  if (query.taskId) filter.relatedTask = query.taskId;
  return filter;
};

const findNoteOrThrow = async (id, userId) => {
  const note = await Note.findById(id);
  if (!note || note.user.toString() !== userId) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }
  return note;
};

// @desc    List notes
// @route   GET /api/notes
// @access  Private
export const getNotes = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.user.id, req.query);
  const notes = await Note.find(filter).sort({ pinned: -1, updatedAt: -1 });
  res.status(200).json(notes);
});

// @desc    Create note
// @route   POST /api/notes
// @access  Private
export const createNote = asyncHandler(async (req, res) => {
  if (!req.body.content) {
    res.status(400);
    throw new Error("Note content is required");
  }

  const note = await Note.create({
    user: req.user.id,
    ...req.body,
  });

  res.status(201).json(note);
});

// @desc    Get note
// @route   GET /api/notes/:id
// @access  Private
export const getNote = asyncHandler(async (req, res) => {
  const note = await findNoteOrThrow(req.params.id, req.user.id);
  res.status(200).json(note);
});

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = asyncHandler(async (req, res) => {
  await findNoteOrThrow(req.params.id, req.user.id);

  const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updated);
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await findNoteOrThrow(req.params.id, req.user.id);
  await note.deleteOne();
  res.status(200).json({ message: "Note removed" });
});

