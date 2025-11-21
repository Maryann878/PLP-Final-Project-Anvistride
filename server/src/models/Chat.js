// server/src/models/Chat.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "system"],
      default: "text",
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["group", "private"],
      required: true,
    },
    name: {
      type: String,
      default: "General Chat", // For group chat
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [messageSchema],
    lastMessage: {
      type: messageSchema,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
chatSchema.index({ participants: 1, lastActivity: -1 });
chatSchema.index({ type: 1 });

export default mongoose.model("Chat", chatSchema);

