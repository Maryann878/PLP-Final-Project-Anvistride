import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    username: {
      type: String,
      trim: true,
    },
    avatar: String,
    coverImage: String,
    bio: {
      type: String,
      maxlength: 400,
    },
    location: String,
    timezone: {
      type: String,
      default: "UTC",
    },
    focusAreas: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    preferredGoalView: {
      type: String,
      enum: ["board", "timeline", "list"],
      default: "board",
    },
    remindersEnabled: {
      type: Boolean,
      default: true,
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;

