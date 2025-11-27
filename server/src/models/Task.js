import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed", "blocked"],
      default: "not_started",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: Date,
    completedAt: Date,
    reminder: Date,
    estimatedMinutes: Number,
    isStandalone: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    checklists: [
      {
        label: String,
        done: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ user: 1, dueDate: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;

