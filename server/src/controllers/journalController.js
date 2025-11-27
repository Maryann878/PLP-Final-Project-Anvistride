import asyncHandler from "express-async-handler";
import JournalEntry from "../models/JournalEntry.js";

const findEntryOrThrow = async (id, userId) => {
  const entry = await JournalEntry.findById(id);
  if (!entry || entry.user.toString() !== userId) {
    const error = new Error("Journal entry not found");
    error.statusCode = 404;
    throw error;
  }
  return entry;
};

// @desc    List journal entries
// @route   GET /api/journal
// @access  Private
export const getJournalEntries = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const filter = { user: req.user.id };

  if (from || to) {
    filter.entryDate = {};
    if (from) filter.entryDate.$gte = new Date(from);
    if (to) filter.entryDate.$lte = new Date(to);
  }

  const entries = await JournalEntry.find(filter).sort({ entryDate: -1 });
  res.status(200).json(entries);
});

// @desc    Create journal entry
// @route   POST /api/journal
// @access  Private
export const createJournalEntry = asyncHandler(async (req, res) => {
  const entry = await JournalEntry.create({
    user: req.user.id,
    ...req.body,
  });
  res.status(201).json(entry);
});

// @desc    Get journal entry
// @route   GET /api/journal/:id
// @access  Private
export const getJournalEntry = asyncHandler(async (req, res) => {
  const entry = await findEntryOrThrow(req.params.id, req.user.id);
  res.status(200).json(entry);
});

// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
export const updateJournalEntry = asyncHandler(async (req, res) => {
  await findEntryOrThrow(req.params.id, req.user.id);
  const updated = await JournalEntry.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updated);
});

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
export const deleteJournalEntry = asyncHandler(async (req, res) => {
  const entry = await findEntryOrThrow(req.params.id, req.user.id);
  await entry.deleteOne();
  res.status(200).json({ message: "Journal entry removed" });
});

