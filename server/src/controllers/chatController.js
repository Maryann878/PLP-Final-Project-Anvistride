// server/src/controllers/chatController.js
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// @desc Get or create group chat
// @route GET /api/chat/group
export const getGroupChat = asyncHandler(async (req, res) => {
  let groupChat = await Chat.findOne({ type: "group" });

  if (!groupChat) {
    // Create group chat if it doesn't exist
    groupChat = await Chat.create({
      type: "group",
      name: "Anvistride Community",
      participants: [],
      messages: [],
    });
  }

  res.status(200).json(groupChat);
});

// @desc Get or create private chat between two users
// @route GET /api/chat/private/:userId
export const getPrivateChat = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;

  if (currentUserId === otherUserId) {
    return res.status(400).json({ message: "Cannot create chat with yourself" });
  }

  // Check if other user exists
  const otherUser = await User.findById(otherUserId);
  if (!otherUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Find existing private chat
  let privateChat = await Chat.findOne({
    type: "private",
    participants: { $all: [currentUserId, otherUserId] },
  });

  if (!privateChat) {
    // Create new private chat
    privateChat = await Chat.create({
      type: "private",
      name: `${req.user.name} & ${otherUser.name}`,
      participants: [currentUserId, otherUserId],
      messages: [],
    });
  }

  res.status(200).json(privateChat);
});

// @desc Get all chats for current user
// @route GET /api/chat
export const getUserChats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get group chat
  const groupChat = await Chat.findOne({ type: "group" });

  // Get all private chats where user is a participant
  const privateChats = await Chat.find({
    type: "private",
    participants: userId,
  })
    .populate("participants", "name email profileImage")
    .sort({ lastActivity: -1 });

  // Combine and format
  const chats = [];
  if (groupChat) {
    chats.push({
      ...groupChat.toObject(),
      isGroup: true,
    });
  }

  privateChats.forEach((chat) => {
    const otherParticipant = chat.participants.find(
      (p) => p._id.toString() !== userId
    );
    chats.push({
      ...chat.toObject(),
      isGroup: false,
      otherParticipant: otherParticipant || null,
    });
  });

  res.status(200).json(chats);
});

// @desc Send message
// @route POST /api/chat/:chatId/message
export const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Message content is required" });
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // Check if user is participant (for private chats)
  if (chat.type === "private" && !chat.participants.includes(userId)) {
    return res.status(403).json({ message: "Not a participant in this chat" });
  }

  const message = {
    senderId: userId,
    senderName: req.user.name,
    content: content.trim(),
    type: "text",
  };

  chat.messages.push(message);
  chat.lastMessage = message;
  chat.lastActivity = new Date();

  // Add user to participants if group chat and not already there
  if (chat.type === "group" && !chat.participants.includes(userId)) {
    chat.participants.push(userId);
  }

  await chat.save();

  res.status(201).json({
    message: "Message sent successfully",
    chat: chat,
  });
});

// @desc Get chat messages
// @route GET /api/chat/:chatId/messages
// @query limit (optional) - Number of messages to return (default: all)
// @query skip (optional) - Number of messages to skip (default: 0)
// @query before (optional) - Get messages before this message ID (for pagination)
export const getChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id;
  const { limit, skip, before } = req.query;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // Check if user is participant (for private chats)
  if (chat.type === "private" && !chat.participants.includes(userId)) {
    return res.status(403).json({ message: "Not a participant in this chat" });
  }

  // Get all messages (sorted by createdAt, newest first)
  let messages = [...(chat.messages || [])];
  
  // Sort messages by createdAt (newest first for pagination)
  messages.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Newest first
  });

  // If 'before' parameter is provided, get messages before that message
  if (before) {
    const beforeIndex = messages.findIndex(m => (m._id || m.id)?.toString() === before);
    if (beforeIndex !== -1) {
      messages = messages.slice(beforeIndex + 1);
    }
  }

  // Apply skip if provided
  const skipNum = skip ? parseInt(skip) : 0;
  if (skipNum > 0) {
    messages = messages.slice(skipNum);
  }

  // Apply limit if provided (default: return all messages for backward compatibility)
  const limitNum = limit ? parseInt(limit) : messages.length;
  const paginatedMessages = limitNum > 0 && limitNum < messages.length 
    ? messages.slice(0, limitNum) 
    : messages;

  // Reverse to show oldest first (for display)
  const displayMessages = [...paginatedMessages].reverse();

  // Calculate pagination metadata (only if pagination is being used)
  const totalMessages = chat.messages?.length || 0;
  let hasMore = false;
  
  if (limit || skip || before) {
    // If using pagination, check if there are more messages
    if (before) {
      // If using 'before', check if there are messages after the filtered set
      hasMore = messages.length > paginatedMessages.length;
    } else if (limit) {
      // If using limit, check if there are more messages beyond current page
      hasMore = (skipNum + limitNum) < totalMessages;
    }
  }

  res.status(200).json({
    messages: displayMessages,
    chat: {
      id: chat._id,
      type: chat.type,
      name: chat.name,
    },
    // Pagination metadata (only if pagination is used)
    ...(limit || skip || before ? {
      pagination: {
        total: totalMessages,
        limit: limitNum,
        skip: skipNum,
        hasMore,
        // ID of the oldest message in current page (for "load more" functionality)
        oldestMessageId: displayMessages.length > 0 
          ? (displayMessages[0]._id || displayMessages[0].id)?.toString() 
          : null,
      }
    } : {}),
  });
});

// @desc Get online users (for group chat)
// @route GET /api/chat/users/online
export const getOnlineUsers = asyncHandler(async (req, res) => {
  // This would typically come from Socket.IO connected users
  // For now, return a simple response
  res.status(200).json({
    message: "Online users feature - to be implemented with Socket.IO",
    onlineUsers: [],
  });
});

