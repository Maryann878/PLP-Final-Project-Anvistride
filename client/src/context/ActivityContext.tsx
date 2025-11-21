// client/src/context/ActivityContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from './SocketContext';

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

  // Load activities from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setActivities(parsed);
      } catch {
        // Invalid data, start fresh
      }
    }
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

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, MAX_ACTIVITIES));
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
    localStorage.removeItem(STORAGE_KEY);
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

