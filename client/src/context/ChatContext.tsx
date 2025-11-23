// client/src/context/ChatContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import * as chatAPI from '@/api/chat';
import type { Chat, Message } from '@/api/chat';

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  onlineUsers: string[];
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (content: string) => Promise<void>;
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  startPrivateChat: (userId: string) => Promise<void>;
  isTyping: { [userId: string]: boolean };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<{ [userId: string]: boolean }>({});
  const { socket, isConnected, emit, on, off } = useSocket();
  const { user } = useAuth();
  const typingTimeoutRef = useRef<{ [userId: string]: NodeJS.Timeout }>({});

  // Load all chats
  const loadChats = useCallback(async () => {
    // Only load chats if user is authenticated
    if (!user) {
      setChats([]);
      return;
    }
    
    try {
      const userChats = await chatAPI.getUserChats();
      setChats(userChats);
    } catch (error: any) {
      // Silently handle 401 errors (user not authenticated)
      if (error.response?.status === 401) {
        setChats([]);
        return;
      }
      // Only log other errors if API is configured
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiUrl && apiUrl !== 'http://localhost:5000/api') {
        console.error('Failed to load chats:', error);
      }
    }
  }, [user]);

  // Load messages for a specific chat
  const loadMessages = useCallback(async (chatId: string) => {
    try {
      const { messages: chatMessages } = await chatAPI.getChatMessages(chatId);
      setMessages(chatMessages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, []);

  // Start private chat with a user
  const startPrivateChat = useCallback(async (userId: string) => {
    try {
      const chat = await chatAPI.getPrivateChat(userId);
      await loadChats(); // Refresh chat list
      setActiveChat(chat);
      await loadMessages(chat._id);
      
      // Join chat room via Socket.IO
      if (isConnected) {
        emit('chat:join', { chatId: chat._id });
      }
    } catch (error) {
      console.error('Failed to start private chat:', error);
    }
  }, [isConnected, emit, loadChats, loadMessages]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!activeChat || !content.trim()) return;

    let tempMessageId: string | null = null;

    try {
      // Optimistically add message to UI
      const tempMessage: Message = {
        _id: `temp-${Date.now()}`,
        senderId: user?.id || '',
        senderName: user?.name || user?.username || 'You',
        content: content.trim(),
        type: 'text',
        createdAt: new Date().toISOString(),
      };

      tempMessageId = tempMessage._id;
      setMessages((prev) => [...prev, tempMessage]);

      // Send via Socket.IO for real-time delivery
      if (isConnected) {
        emit('chat:message', {
          chatId: activeChat._id,
          content: content.trim(),
        });
      } else {
        // Fallback to API if Socket.IO not connected
        await chatAPI.sendMessage(activeChat._id, content.trim());
        await loadMessages(activeChat._id);
      }

      // Refresh chat list to update last message
      await loadChats();
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      if (tempMessageId) {
        setMessages((prev) => prev.filter((m) => m._id !== tempMessageId));
      }
    }
  }, [activeChat, user, isConnected, emit, loadChats, loadMessages]);

  // Socket.IO event listeners
  useEffect(() => {
    if (!isConnected || !socket) return;

    // Listen for new messages
    const handleNewMessage = (message: Message & { chatId: string }) => {
      // Only add if it's for the active chat
      if (activeChat && message.chatId === activeChat._id) {
        setMessages((prev) => {
          // Check if message already exists (prevent duplicates)
          const exists = prev.some((m) => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
      }

      // Update chat list to show new last message
      loadChats();
    };

    // Listen for typing indicators
    const handleTyping = (data: { userId: string; userName: string; isTyping: boolean }) => {
      if (data.userId === user?.id) return; // Don't show own typing indicator

      setIsTyping((prev) => ({
        ...prev,
        [data.userId]: data.isTyping,
      }));

      // Clear typing indicator after 3 seconds
      if (typingTimeoutRef.current[data.userId]) {
        clearTimeout(typingTimeoutRef.current[data.userId]);
      }

      if (data.isTyping) {
        typingTimeoutRef.current[data.userId] = setTimeout(() => {
          setIsTyping((prev) => ({
            ...prev,
            [data.userId]: false,
          }));
        }, 3000);
      }
    };

    // Listen for online users
    const handleOnlineUsers = (data: { onlineUsers: string[]; count: number }) => {
      setOnlineUsers(data.onlineUsers);
    };

    // Listen for user online/offline
    const handleUserOnline = (data: { userId: string; userName: string }) => {
      setOnlineUsers((prev) => {
        if (!prev.includes(data.userId)) {
          return [...prev, data.userId];
        }
        return prev;
      });
    };

    const handleUserOffline = (data: { userId: string }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== data.userId));
    };

    // Register listeners
    on('chat:message:new', handleNewMessage);
    on('chat:typing', handleTyping);
    on('chat:online:response', handleOnlineUsers);
    on('user:online', handleUserOnline);
    on('user:offline', handleUserOffline);

    // Request online users for group chat
    emit('chat:online:request');

    // Cleanup
    return () => {
      off('chat:message:new', handleNewMessage);
      off('chat:typing', handleTyping);
      off('chat:online:response', handleOnlineUsers);
      off('user:online', handleUserOnline);
      off('user:offline', handleUserOffline);
    };
  }, [isConnected, socket, activeChat, user, on, off, emit, loadChats]);

  // Join chat room when active chat changes
  useEffect(() => {
    if (!isConnected || !activeChat) return;

    emit('chat:join', { chatId: activeChat._id });
    loadMessages(activeChat._id);

    return () => {
      if (activeChat) {
        emit('chat:leave', { chatId: activeChat._id });
      }
    };
  }, [activeChat, isConnected, emit, loadMessages]);

  // Load chats on mount or when user changes
  useEffect(() => {
    if (user) {
      loadChats();
    } else {
      // Clear chats when user logs out
      setChats([]);
      setActiveChat(null);
      setMessages([]);
    }
  }, [user, loadChats]);

  // Join group chat on connection
  useEffect(() => {
    if (isConnected) {
      emit('chat:join', { chatId: 'group' });
    }
  }, [isConnected, emit]);

  const value: ChatContextType = {
    chats,
    activeChat,
    messages,
    onlineUsers,
    setActiveChat,
    sendMessage,
    loadChats,
    loadMessages,
    startPrivateChat,
    isTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

