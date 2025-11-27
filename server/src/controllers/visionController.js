import asyncHandler from "express-async-handler";
import Vision from "../models/Vision.js";

const requireFields = (body, fields) => {
  const missing = fields.filter((field) => !body[field]);
  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
};

// @desc    List visions
// @route   GET /api/visions
// @access  Private
export const getVisions = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { user: req.user.id };
  if (status) filter.status = status;

  const visions = await Vision.find(filter).sort({ updatedAt: -1 });
  res.status(200).json(visions);
});

// @desc    Create vision
// @route   POST /api/visions
// @access  Private
export const createVision = asyncHandler(async (req, res) => {
  requireFields(req.body, ["title", "description"]);

  const vision = await Vision.create({
    user: req.user.id,
    ...req.body,
  });

  res.status(201).json(vision);
});

// helpers
const findVisionOrThrow = async (id, userId) => {
  const vision = await Vision.findById(id);
  if (!vision || vision.user.toString() !== userId) {
    const error = new Error("Vision not found");
    error.statusCode = 404;
    throw error;
  }
  return vision;
};

// @desc    Get single vision
// @route   GET /api/visions/:id
// @access  Private
export const getVision = asyncHandler(async (req, res) => {
  const vision = await findVisionOrThrow(req.params.id, req.user.id);
  res.status(200).json(vision);
});

// @desc    Update vision
// @route   PUT /api/visions/:id
// @access  Private
export const updateVision = asyncHandler(async (req, res) => {
  await findVisionOrThrow(req.params.id, req.user.id);
  const updated = await Vision.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updated);
});

// @desc    Delete vision
// @route   DELETE /api/visions/:id
// @access  Private
export const deleteVision = asyncHandler(async (req, res) => {
  const vision = await findVisionOrThrow(req.params.id, req.user.id);
  await vision.deleteOne();
  res.status(200).json({ message: "Vision removed" });
});

