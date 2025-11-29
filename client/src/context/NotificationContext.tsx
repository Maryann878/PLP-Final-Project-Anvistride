import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import * as notificationAPI from '@/api/notification';

export interface Notification {
  id: string;
  type: 'system' | 'reminder' | 'update' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionText?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'anvistride-notifications';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketContext = useSocket();
  const { isConnected, on, off } = socketContext;
  const { user, loading: authLoading } = useAuth(); // Get auth state

  // Load from backend on mount - ONLY if user is authenticated
  useEffect(() => {
    // Don't load data if auth is still loading or user is not authenticated
    if (authLoading || !user) {
      return;
    }

    const loadNotifications = async () => {
      try {
        const data = await notificationAPI.getNotifications({ limit: 100 });
        if (data && data.notifications) {
          setNotifications(data.notifications.map((n: any) => ({
            id: n._id || n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            timestamp: n.createdAt || n.timestamp,
            isRead: n.isRead,
            priority: n.priority,
            actionUrl: n.actionUrl,
            actionText: n.actionText,
          })));
        }
      } catch (error) {
        console.warn('Failed to load notifications from backend, using localStorage:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setNotifications(parsed);
          } catch {
            // Invalid data, start fresh
            const welcomeNotification: Notification = {
              id: Date.now().toString(),
              type: 'system',
              title: 'Welcome to Anvistride!',
              message: 'Your account has been successfully created. Start by creating your first vision!',
              timestamp: new Date().toISOString(),
              isRead: false,
              priority: 'low',
              actionUrl: '/app/vision',
              actionText: 'Create Vision',
            };
            setNotifications([welcomeNotification]);
          }
        } else {
          // Initialize with welcome notification
          const welcomeNotification: Notification = {
            id: Date.now().toString(),
            type: 'system',
            title: 'Welcome to Anvistride!',
            message: 'Your account has been successfully created. Start by creating your first vision!',
            timestamp: new Date().toISOString(),
            isRead: false,
            priority: 'low',
            actionUrl: '/app/vision',
            actionText: 'Create Vision',
          };
          setNotifications([welcomeNotification]);
        }
      }
    };

    loadNotifications();
  }, [user, authLoading]); // Only load when user/auth state changes

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Define addNotification before it's used in useEffect
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    try {
      const created = await notificationAPI.createNotification({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        actionUrl: notification.actionUrl,
        actionText: notification.actionText,
      });
      
      const newNotification: Notification = {
        ...notification,
        id: created._id || created.id || Date.now().toString(),
        timestamp: created.createdAt || new Date().toISOString(),
        isRead: created.isRead || false,
      };
      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error('Error creating notification:', error);
      // Fallback to local state
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  }, []);

  // Listen for real-time notifications from Socket.IO
  useEffect(() => {
    if (!isConnected) return;

    const handleRealtimeNotification = (data: {
      type: 'system' | 'reminder' | 'update' | 'achievement';
      title: string;
      message: string;
      priority?: 'low' | 'medium' | 'high';
      actionUrl?: string;
      actionText?: string;
    }) => {
      addNotification({
        type: data.type,
        title: data.title,
        message: data.message,
        priority: data.priority || 'medium',
        actionUrl: data.actionUrl,
        actionText: data.actionText,
      });
    };

    // Listen for achievement notifications
    const handleAchievement = (data: { title: string; description: string }) => {
      addNotification({
        type: 'achievement',
        title: `🏆 ${data.title}`,
        message: data.description,
        priority: 'high',
        actionUrl: '/app/achievements',
        actionText: 'View Achievement',
      });
    };

    // Listen for milestone notifications
    const handleMilestone = (data: { type: string; title: string; message: string }) => {
      addNotification({
        type: 'update',
        title: `🎯 ${data.title}`,
        message: data.message,
        priority: 'medium',
      });
    };

    on('notification:new', handleRealtimeNotification);
    on('achievement:unlocked', handleAchievement);
    on('milestone:reached', handleMilestone);

    return () => {
      off('notification:new', handleRealtimeNotification);
      off('achievement:unlocked', handleAchievement);
      off('milestone:reached', handleMilestone);
    };
  }, [isConnected, on, off, addNotification]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Fallback to local state
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Fallback to local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationAPI.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Fallback to local state
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  }, []);

  const clearAllRead = useCallback(async () => {
    try {
      await notificationAPI.clearReadNotifications();
      setNotifications(prev => prev.filter(n => !n.isRead));
    } catch (error) {
      console.error('Error clearing read notifications:', error);
      // Fallback to local state
      setNotifications(prev => prev.filter(n => !n.isRead));
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};




