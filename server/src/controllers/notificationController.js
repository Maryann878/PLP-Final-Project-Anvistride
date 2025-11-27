import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const { isRead, type, limit = 100 } = req.query;
  const filter = { user: req.user.id };

  if (isRead !== undefined) filter.isRead = isRead === "true";
  if (type) filter.type = type;

  // Validate and parse limit
  const limitNum = parseInt(limit);
  const validLimit = isNaN(limitNum) || limitNum <= 0 ? 100 : Math.min(limitNum, 1000); // Max 1000

  try {
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(validLimit);

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      notifications: notifications || [],
      unreadCount: unreadCount || 0,
    });
  } catch (error) {
    console.error('[getNotifications] Database error:', error);
    // Return empty result instead of throwing to prevent 500 error
    res.status(200).json({
      notifications: [],
      unreadCount: 0,
    });
  }
});

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
export const getNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.status(200).json(notification);
});

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
export const createNotification = asyncHandler(async (req, res) => {
  const { type, title, message, priority, actionUrl, actionText } = req.body;

  if (!title || !message) {
    res.status(400);
    throw new Error("Title and message are required");
  }

  const notification = await Notification.create({
    user: req.user.id,
    type: type || "system",
    title,
    message,
    priority: priority || "medium",
    actionUrl: actionUrl || null,
    actionText: actionText || null,
  });

  res.status(201).json(notification);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.status(200).json(notification);
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({ message: "All notifications marked as read" });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  await notification.deleteOne();
  res.status(200).json({ message: "Notification deleted" });
});

// @desc    Clear all read notifications
// @route   DELETE /api/notifications/read
// @access  Private
export const clearReadNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ user: req.user.id, isRead: true });
  res.status(200).json({ message: "Read notifications cleared" });
});

