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

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
