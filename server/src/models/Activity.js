import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["add", "update", "delete"],
      required: true,
    },
    entity: {
      type: String,
      required: true,
      index: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    itemTitle: {
      type: String,
      default: "",
    },
    action: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ user: 1, entity: 1, createdAt: -1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;

