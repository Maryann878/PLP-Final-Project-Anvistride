import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    vision: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vision",
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please add a title for your goal"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a short description"],
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed", "paused"],
      default: "not_started",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    deadline: Date,
    completedAt: Date,
    tags: {
      type: [String],
      default: [],
    },
    metrics: {
      type: [
        {
          label: String,
          target: Number,
          current: {
            type: Number,
            default: 0,
          },
          unit: String,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
goalSchema.index({ user: 1, createdAt: -1 });
goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, vision: 1 });

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
