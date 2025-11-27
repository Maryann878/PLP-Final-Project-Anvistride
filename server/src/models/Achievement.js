import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Achievement title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    achievedOn: {
      type: Date,
      default: () => new Date(),
      index: true,
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
    visibility: {
      type: String,
      enum: ["private", "connections", "public"],
      default: "private",
    },
    evidenceUrl: {
      type: String,
      default: "",
    },
    impactScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ user: 1, createdAt: -1 });

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;

