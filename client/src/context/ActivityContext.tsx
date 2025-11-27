// client/src/context/ActivityContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from './SocketContext';
import * as activityAPI from '@/api/activity';

export interface Activity {
  id: string;
  type: 'add' | 'update' | 'delete';
  entity: string;
  itemId: string;
  itemTitle?: string;
  action?: string;
  timestamp: string;
  userId: string;
}

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const STORAGE_KEY = 'anvistride-activities';
const MAX_ACTIVITIES = 50; // Keep last 50 activities

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { isConnected, on, off } = useSocket();

  // Load activities from backend
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await activityAPI.getActivities({ limit: MAX_ACTIVITIES });
        if (data && Array.isArray(data)) {
          setActivities(data.map((a: any) => ({
            id: a._id || a.id,
            type: a.type,
            entity: a.entity,
            itemId: a.itemId,
            itemTitle: a.itemTitle,
            action: a.action,
            timestamp: a.createdAt || a.timestamp,
            userId: a.user || a.userId,
          })));
        }
      } catch (error) {
        console.warn('Failed to load activities from backend, using localStorage:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setActivities(parsed);
          } catch {
            // Invalid data, start fresh
          }
        }
      }
    };

    loadActivities();
  }, []);

  // Save activities to localStorage
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities.slice(0, MAX_ACTIVITIES)));
    }
  }, [activities]);

  // Listen for real-time activity updates
  useEffect(() => {
    if (!isConnected) return;

    const handleNewActivity = (data: Activity) => {
      setActivities((prev) => {
        const newActivity: Activity = {
          ...data,
          id: data.id || Date.now().toString(),
        };
        // Add to beginning and limit to MAX_ACTIVITIES
        return [newActivity, ...prev].slice(0, MAX_ACTIVITIES);
      });
    };

    on('activity:new', handleNewActivity);

    return () => {
      off('activity:new', handleNewActivity);
    };
  }, [isConnected, on, off]);

  const addActivity = useCallback(async (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    try {
      const created = await activityAPI.createActivity({
        type: activity.type,
        entity: activity.entity,
        itemId: activity.itemId,
        itemTitle: activity.itemTitle,
        action: activity.action,
      });
      
      const newActivity: Activity = {
        ...activity,
        id: created._id || created.id || Date.now().toString(),
        timestamp: created.createdAt || new Date().toISOString(),
        userId: created.user || activity.userId,
      };
      setActivities((prev) => [newActivity, ...prev].slice(0, MAX_ACTIVITIES));
    } catch (error) {
      console.error('Error creating activity:', error);
      // Fallback to local state
      const newActivity: Activity = {
        ...activity,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      setActivities((prev) => [newActivity, ...prev].slice(0, MAX_ACTIVITIES));
    }
  }, []);

  const clearActivities = useCallback(async () => {
    try {
      await activityAPI.clearActivities();
      setActivities([]);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing activities:', error);
      // Fallback to local clear
      setActivities([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return (
    <ActivityContext.Provider value={{ activities, addActivity, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within ActivityProvider');
  }
  return context;
};

