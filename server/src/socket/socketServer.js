// server/src/socket/socketServer.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Chat from "../models/Chat.js";

let io;

export const initializeSocket = (server) => {
  const allowedOrigins = [
    process.env.CLIENT_URL,
    'https://anvistride.pages.dev', // Cloudflare Pages production
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean); // Remove any undefined values

  // Cloudflare Pages preview URL pattern (e.g., https://4a6429af.anvistride.pages.dev)
  const cloudflarePreviewPattern = /^https:\/\/[a-z0-9-]+\.anvistride\.pages\.dev$/;

  // Helper function to check if origin is allowed
  const isOriginAllowed = (origin) => {
    if (!origin) return true;
    
    // Normalize origin (remove trailing slash)
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    
    // Check exact match in allowed origins
    if (allowedOrigins.includes(origin) || allowedOrigins.includes(normalizedOrigin)) {
      return true;
    }
    
    // Check if it's a Cloudflare preview URL
    if (cloudflarePreviewPattern.test(normalizedOrigin)) {
      return true;
    }
    
    return false;
  };

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) {
          return callback(null, true);
        }
        
        // In development, allow all origins
        if (process.env.NODE_ENV !== 'production') {
          return callback(null, true);
        }
        
        // In production, check against allowed origins
        if (isOriginAllowed(origin)) {
          callback(null, true);
        } else {
          console.warn(`Socket.IO CORS blocked origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      };
      
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Track online users
  const onlineUsers = new Map(); // userId -> socketId[]

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.name} (${socket.userId})`);
    
    // Join user's personal room for targeted updates
    socket.join(`user:${socket.userId}`);
    
    // Track online status
    if (!onlineUsers.has(socket.userId)) {
      onlineUsers.set(socket.userId, []);
    }
    onlineUsers.get(socket.userId).push(socket.id);
    
    // Join group chat room
    socket.join('chat:group');
    
    // Notify others that user is online (for group chat)
    socket.to('chat:group').emit('user:online', {
      userId: socket.userId,
      userName: socket.user.name,
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.name} (${socket.userId})`);
      
      // Remove from online users
      if (onlineUsers.has(socket.userId)) {
        const sockets = onlineUsers.get(socket.userId);
        const index = sockets.indexOf(socket.id);
        if (index > -1) {
          sockets.splice(index, 1);
        }
        if (sockets.length === 0) {
          onlineUsers.delete(socket.userId);
          // Notify others that user is offline
          socket.to('chat:group').emit('user:offline', {
            userId: socket.userId,
          });
        }
      }
    });

    // Handle real-time sync events
    socket.on('sync:request', async (data) => {
      // Client requesting sync - could fetch latest data from DB
      socket.emit('sync:response', { 
        timestamp: new Date().toISOString(),
        message: 'Sync request received'
      });
    });

    // Handle entity CRUD operations for multi-device sync
    socket.on('entity:add', (data) => {
      // Broadcast to user's other devices (exclude sender)
      socket.to(`user:${socket.userId}`).emit('entity:add', {
        ...data,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('entity:update', (data) => {
      // Broadcast to user's other devices
      socket.to(`user:${socket.userId}`).emit('entity:update', {
        ...data,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('entity:delete', (data) => {
      // Broadcast to user's other devices
      socket.to(`user:${socket.userId}`).emit('entity:delete', {
        ...data,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle activity updates
    socket.on('activity:create', (data) => {
      // Broadcast activity to user's other devices
      socket.to(`user:${socket.userId}`).emit('activity:new', {
        ...data,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle achievement unlocks - emit notification
    socket.on('achievement:unlock', (data) => {
      // Send notification to all user's devices
      io.to(`user:${socket.userId}`).emit('achievement:unlocked', {
        title: data.title,
        description: data.description,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle milestone reached - emit notification
    socket.on('milestone:reach', (data) => {
      // Send notification to all user's devices
      io.to(`user:${socket.userId}`).emit('milestone:reached', {
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });

    // ==================== CHAT HANDLERS ====================
    
    // Join private chat room
    socket.on('chat:join', async (data) => {
      const { chatId } = data;
      if (chatId) {
        socket.join(`chat:${chatId}`);
        console.log(`User ${socket.user.name} joined chat ${chatId}`);
      }
    });

    // Leave chat room
    socket.on('chat:leave', (data) => {
      const { chatId } = data;
      if (chatId) {
        socket.leave(`chat:${chatId}`);
      }
    });

    // Handle sending message
    socket.on('chat:message', async (data) => {
      const { chatId, content } = data;
      
      if (!chatId || !content || !content.trim()) {
        return socket.emit('chat:error', { message: 'Invalid message data' });
      }

      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          return socket.emit('chat:error', { message: 'Chat not found' });
        }

        // Check if user is participant (for private chats)
        if (chat.type === 'private' && !chat.participants.includes(socket.userId)) {
          return socket.emit('chat:error', { message: 'Not a participant' });
        }

        const message = {
          senderId: socket.userId,
          senderName: socket.user.name,
          content: content.trim(),
          type: 'text',
        };

        chat.messages.push(message);
        chat.lastMessage = message;
        chat.lastActivity = new Date();

        // Add user to participants if group chat and not already there
        if (chat.type === 'group' && !chat.participants.includes(socket.userId)) {
          chat.participants.push(socket.userId);
        }

        await chat.save();

        // Broadcast message to all participants in the chat
        const messageData = {
          ...message,
          _id: chat.messages[chat.messages.length - 1]._id,
          createdAt: chat.messages[chat.messages.length - 1].createdAt,
          chatId: chat._id.toString(),
        };

        // Emit to all in the chat room (including sender for confirmation)
        io.to(`chat:${chatId}`).emit('chat:message:new', messageData);

        // Also emit to user's other devices
        socket.to(`user:${socket.userId}`).emit('chat:message:new', messageData);

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('chat:error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('chat:typing', (data) => {
      const { chatId, isTyping } = data;
      socket.to(`chat:${chatId}`).emit('chat:typing', {
        userId: socket.userId,
        userName: socket.user.name,
        isTyping,
      });
    });

    // Get online users for group chat
    socket.on('chat:online:request', () => {
      const onlineUserIds = Array.from(onlineUsers.keys());
      socket.emit('chat:online:response', {
        onlineUsers: onlineUserIds,
        count: onlineUserIds.length,
      });
    });
  });

  return io;
};

// Helper functions to emit events
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

