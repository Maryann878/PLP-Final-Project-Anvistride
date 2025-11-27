import asyncHandler from "express-async-handler";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

const buildDefaultProfile = (userId) =>
  new Profile({
    user: userId,
    focusAreas: [],
    strengths: [],
    notificationPreferences: { email: true, push: true, sms: false },
  });

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
export const getMyProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email createdAt');

  if (!profile) {
    profile = buildDefaultProfile(req.user.id);
    await profile.save();
    // Populate after save
    await profile.populate('user', 'name email createdAt');
  }

  // Merge user data with profile for frontend
  const user = profile.user || {};
  const response = {
    ...profile.toObject(),
    username: profile.username || user?.name || 'User',
    email: user?.email || '',
    profileImage: profile.avatar || null,
    createdAt: user?.createdAt || profile.createdAt,
  };

  res.status(200).json(response);
});

// @desc    Update current user's profile
// @route   PUT /api/profile/me
// @access  Private
export const updateMyProfile = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  
  // Map frontend fields to backend fields
  if (updates.profileImage !== undefined) {
    updates.avatar = updates.profileImage;
    delete updates.profileImage;
  }
  
  // Remove fields that shouldn't be in Profile
  delete updates.email; // Email is in User, not Profile
  delete updates.createdAt; // Read-only

  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $set: updates },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate('user', 'name email createdAt');

  // Merge user data with profile for response
  const user = profile.user || {};
  const response = {
    ...profile.toObject(),
    username: profile.username || user?.name || 'User',
    email: user?.email || '',
    profileImage: profile.avatar || null,
    createdAt: user?.createdAt || profile.createdAt,
  };

  res.status(200).json(response);
});

