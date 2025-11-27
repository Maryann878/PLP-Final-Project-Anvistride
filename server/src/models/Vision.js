import mongoose from "mongoose";

const visionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Vision title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Vision description is required"],
    },
    status: {
      type: String,
      enum: ["planning", "active", "paused", "completed", "evolved", "archived"],
      default: "planning",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    horizonYears: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    startDate: Date,
    targetDate: Date,
    tags: {
      type: [String],
      default: [],
    },
    focusArea: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

visionSchema.index({ user: 1, priority: 1 });
visionSchema.index({ user: 1, status: 1 });

const Vision = mongoose.model("Vision", visionSchema);

export default Vision;

