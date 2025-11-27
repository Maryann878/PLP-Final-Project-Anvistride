import mongoose from "mongoose";

const recycleItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["vision", "goal", "task", "idea", "note", "journal", "achievement"],
      required: true,
    },
    entityId: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    parentId: {
      type: String,
      default: null,
    },
    parentType: {
      type: String,
      enum: ["vision", "goal", "task", null],
      default: null,
    },
    originalLocation: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

recycleItemSchema.index({ user: 1, deletedAt: -1 });
recycleItemSchema.index({ user: 1, type: 1 });

// Virtual for deletedAt (using createdAt as deletedAt)
recycleItemSchema.virtual("deletedAt").get(function () {
  return this.createdAt;
});

const RecycleItem = mongoose.model("RecycleItem", recycleItemSchema);

export default RecycleItem;

