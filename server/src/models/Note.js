import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Note content is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    relatedVision: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vision",
      default: null,
    },
    relatedGoal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
    },
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ user: 1, pinned: -1, updatedAt: -1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;

