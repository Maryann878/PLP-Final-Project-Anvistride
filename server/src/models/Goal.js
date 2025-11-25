import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // links goal to the user who created it
    },
    title: {
      type: String,
      required: [true, "Please add a title for your goal"],
    },
    description: {
      type: String,
      required: [true, "Please add a short description"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // automatically creates createdAt and updatedAt
  }
);

// Indexes for better query performance
goalSchema.index({ user: 1, createdAt: -1 }); // Get user's goals, newest first
goalSchema.index({ user: 1, completed: 1 }); // Filter by completion status
goalSchema.index({ user: 1 }); // General user lookup

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
