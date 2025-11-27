import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "exploring", "ready", "implemented", "archived"],
      default: "draft",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String,
      default: "",
    },
    linkedVision: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vision",
      default: null,
    },
    linkedGoal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
    },
    linkedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    implementedAt: {
      type: Date,
      default: null,
    },
    implementationNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

ideaSchema.index({ user: 1, status: 1, createdAt: -1 });
ideaSchema.index({ user: 1, priority: 1 });

const Idea = mongoose.model("Idea", ideaSchema);

export default Idea;

