// server/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: 6,
    },
    isEmailVerified: {
      type: Boolean,
      default: true, // ✅ Backward compatible: existing users treated as verified
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
// Email already has unique index, but explicit index helps with lookups
userSchema.index({ email: 1 }); // For login queries
userSchema.index({ createdAt: -1 }); // For sorting users by creation date

export default mongoose.model("User", userSchema);
