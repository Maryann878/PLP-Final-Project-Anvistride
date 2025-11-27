import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    entryDate: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
    mood: {
      type: String,
      enum: ["very_low", "low", "neutral", "good", "great"],
      default: "neutral",
    },
    summary: {
      type: String,
      default: "",
    },
    highlights: {
      type: [String],
      default: [],
    },
    gratitude: {
      type: [String],
      default: [],
    },
    lessons: {
      type: [String],
      default: [],
    },
    nextSteps: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

journalSchema.index({ user: 1, entryDate: -1 });

const JournalEntry = mongoose.model("JournalEntry", journalSchema);

export default JournalEntry;

