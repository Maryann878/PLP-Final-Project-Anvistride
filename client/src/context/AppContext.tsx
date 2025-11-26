import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useSocket } from './SocketContext';
import { saveToRecycleBin } from '@/lib/recycleBin';
import type {
  VisionType,
  GoalType,
  TaskType,
  IdeaType,
  NoteType,
  JournalEntryType,
  AchievementType,
} from '@/types/index';

// -------------------- Types --------------------
interface AppState {
  visions: VisionType[];
  goals: GoalType[];
  tasks: TaskType[];
  ideas: IdeaType[];
  notes: NoteType[];
  journal: JournalEntryType[];
  achievements: AchievementType[];
  quotes: { text: string; author: string }[];
}

type EntityName =
  | 'visions'
  | 'goals'
  | 'tasks'
  | 'ideas'
  | 'notes'
  | 'journal'
  | 'achievements';

type AppAction =
  | { type: `ADD_${Uppercase<EntityName>}`; payload: any }
  | { type: `UPDATE_${Uppercase<EntityName>}`; payload: { id: string; data: any } }
  | { type: `DELETE_${Uppercase<EntityName>}`; payload: string }
  | { type: 'TOGGLE_TASK_STATUS'; payload: { id: string; status: 'Todo' | 'In Progress' | 'Done' } }
  | { type: 'LOAD_STATE'; payload: AppState };

// -------------------- Constants --------------------
const STORAGE_KEY = 'anvistride-app-state';

const initialState: AppState = {
  visions: [],
  goals: [],
  tasks: [],
  ideas: [],
  notes: [],
  journal: [],
  achievements: [],
  quotes: [
    { text: "Vision into stride, one step at a time.", author: "Anvistride" },
    { text: "Write the vision and make it plain on tablets, that he may run who reads it.", author: "Habakkuk 2:2" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", author: "Jeremiah 29:11" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "I can do all things through Christ who strengthens me.", author: "Philippians 4:13" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.", author: "Proverbs 3:5-6" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "And we know that all things work together for good to those who love God, to those who are the called according to His purpose.", author: "Romans 8:28" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "But those who wait on the Lord shall renew their strength; they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.", author: "Isaiah 40:31" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Commit your work to the Lord, and your plans will be established.", author: "Proverbs 16:3" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "The Lord will fulfill his purpose for me; your steadfast love, O Lord, endures forever.", author: "Psalm 138:8" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "For nothing will be impossible with God.", author: "Luke 1:37" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Delight yourself in the Lord, and he will give you the desires of your heart.", author: "Psalm 37:4" },
  ],
};

// -------------------- Reducer --------------------
function appReducer(state: AppState, action: AppAction): AppState {
  const entityMap: Record<EntityName, any[]> = {
    visions: state.visions,
    goals: state.goals,
    tasks: state.tasks,
    ideas: state.ideas,
    notes: state.notes,
    journal: state.journal,
    achievements: state.achievements,
  };

  const match = action.type.match(/(ADD|UPDATE|DELETE)_(.*)/);
  if (match) {
    const [, method, entity] = match;
    const entityName = entity.toLowerCase() as EntityName;
    switch (method) {
      case 'ADD':
        return { ...state, [entityName]: [...entityMap[entityName], action.payload] };
      case 'UPDATE':
        return {
          ...state,
          [entityName]: entityMap[entityName].map((item) =>
            item.id === action.payload.id ? { ...item, ...action.payload.data } : item
          ),
        };
      case 'DELETE':
        return {
          ...state,
          [entityName]: entityMap[entityName].filter((item) => item.id !== action.payload),
        };
    }
  }

  if (action.type === 'TOGGLE_TASK_STATUS') {
    return {
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === action.payload.id ? { ...t, status: action.payload.status } : t
      ),
    };
  }

  if (action.type === 'LOAD_STATE') {
    return action.payload;
  }

  return state;
}

// -------------------- Context --------------------
interface AppContextType extends AppState {
  // Generic methods
  addEntity: (entity: EntityName, item: any) => void;
  updateEntity: (entity: EntityName, id: string, data: any) => void;
  deleteEntity: (entity: EntityName, id: string) => void;
  toggleTaskStatus: (id: string, status: 'Todo' | 'In Progress' | 'Done') => void;
  
  // Specific methods for each entity
  addVision: (item: VisionType) => void;
  updateVision: (id: string, data: Partial<VisionType>) => void;
  deleteVision: (id: string) => void;
  
  addGoal: (item: GoalType) => void;
  updateGoal: (id: string, data: Partial<GoalType>) => void;
  deleteGoal: (id: string) => void;
  
  addTask: (item: TaskType) => void;
  updateTask: (id: string, data: Partial<TaskType>) => void;
  deleteTask: (id: string, metadata?: { parentId?: string; parentType?: string; originalLocation?: string }) => void;
  
  addIdea: (item: IdeaType) => void;
  updateIdea: (id: string, data: Partial<IdeaType>) => void;
  deleteIdea: (id: string) => void;
  
  addNote: (item: NoteType) => void;
  updateNote: (id: string, data: Partial<NoteType>) => void;
  deleteNote: (id: string) => void;
  
  addJournal: (item: JournalEntryType) => void;
  updateJournal: (id: string, data: Partial<JournalEntryType>) => void;
  deleteJournal: (id: string) => void;
  
  addAchievement: (item: AchievementType) => void;
  updateAchievement: (id: string, data: Partial<AchievementType>) => void;
  deleteAchievement: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// -------------------- Provider --------------------
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { socket, isConnected, emit, on, off } = useSocket();
  const isLocalUpdateRef = useRef(false); // Track if update is from local action

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (err) {
        console.error('Failed to load saved state', err);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Socket.IO real-time sync listeners
  useEffect(() => {
    if (!isConnected || !socket) return;

    // Listen for real-time updates from other devices
    const handleEntityAdd = (data: { entity: EntityName; item: any }) => {
      if (!isLocalUpdateRef.current) {
        dispatch({ type: `ADD_${data.entity.toUpperCase()}` as any, payload: data.item });
      }
    };

    const handleEntityUpdate = (data: { entity: EntityName; id: string; data: any }) => {
      if (!isLocalUpdateRef.current) {
        dispatch({ type: `UPDATE_${data.entity.toUpperCase()}` as any, payload: { id: data.id, data: data.data } });
      }
    };

    const handleEntityDelete = (data: { entity: EntityName; id: string }) => {
      if (!isLocalUpdateRef.current) {
        dispatch({ type: `DELETE_${data.entity.toUpperCase()}` as any, payload: data.id });
      }
    };

    // Register listeners
    on('entity:add', handleEntityAdd);
    on('entity:update', handleEntityUpdate);
    on('entity:delete', handleEntityDelete);

    // Cleanup
    return () => {
      off('entity:add', handleEntityAdd);
      off('entity:update', handleEntityUpdate);
      off('entity:delete', handleEntityDelete);
    };
  }, [isConnected, socket, on, off]);

  // Helper function to emit sync events
  const emitSync = (event: string, data: any) => {
    if (isConnected) {
      isLocalUpdateRef.current = true;
      emit(event, data);
      // Reset flag after a short delay
      setTimeout(() => {
        isLocalUpdateRef.current = false;
      }, 100);
    }
  };

  const value: AppContextType = {
    ...state,
    // Generic methods
    addEntity: (entity, item) => {
      dispatch({ type: `ADD_${entity.toUpperCase()}` as any, payload: item });
      emitSync('entity:add', { entity, item });
      emitSync('activity:create', { type: 'add', entity, itemId: item.id, itemTitle: item.title || item.name });
    },
    updateEntity: (entity, id, data) => {
      dispatch({ type: `UPDATE_${entity.toUpperCase()}` as any, payload: { id, data } });
      emitSync('entity:update', { entity, id, data });
      emitSync('activity:create', { type: 'update', entity, itemId: id });
    },
    deleteEntity: (entity, id) => {
      dispatch({ type: `DELETE_${entity.toUpperCase()}` as any, payload: id });
      emitSync('entity:delete', { entity, id });
      emitSync('activity:create', { type: 'delete', entity, itemId: id });
    },
    toggleTaskStatus: (id, status) => {
      dispatch({ type: 'TOGGLE_TASK_STATUS', payload: { id, status } });
      emitSync('entity:update', { entity: 'tasks', id, data: { status } });
      emitSync('activity:create', { type: 'update', entity: 'tasks', itemId: id, action: `marked as ${status}` });
    },
    
    // Specific methods for each entity
    addVision: (item) => {
      dispatch({ type: 'ADD_VISIONS', payload: item });
      emitSync('entity:add', { entity: 'visions', item });
      emitSync('activity:create', { type: 'add', entity: 'visions', itemId: item.id, itemTitle: item.title });
    },
    updateVision: (id, data) => {
      dispatch({ type: 'UPDATE_VISIONS', payload: { id, data } });
      emitSync('entity:update', { entity: 'visions', id, data });
      emitSync('activity:create', { type: 'update', entity: 'visions', itemId: id });
    },
    deleteVision: (id) => {
      const vision = state.visions.find(v => v.id === id);
      if (vision) {
        saveToRecycleBin(vision, 'vision');
      }
      dispatch({ type: 'DELETE_VISIONS', payload: id });
      emitSync('entity:delete', { entity: 'visions', id });
      emitSync('activity:create', { type: 'delete', entity: 'visions', itemId: id });
    },
    
    addGoal: (item) => {
      dispatch({ type: 'ADD_GOALS', payload: item });
      emitSync('entity:add', { entity: 'goals', item });
      emitSync('activity:create', { type: 'add', entity: 'goals', itemId: item.id, itemTitle: item.title });
    },
    updateGoal: (id, data) => {
      dispatch({ type: 'UPDATE_GOALS', payload: { id, data } });
      emitSync('entity:update', { entity: 'goals', id, data });
      emitSync('activity:create', { type: 'update', entity: 'goals', itemId: id });
    },
    deleteGoal: (id) => {
      const goal = state.goals.find(g => g.id === id);
      if (goal) {
        saveToRecycleBin(goal, 'goal', {
          parentId: goal.visionId,
          parentType: goal.visionId ? 'vision' : undefined,
        });
      }
      dispatch({ type: 'DELETE_GOALS', payload: id });
      emitSync('entity:delete', { entity: 'goals', id });
      emitSync('activity:create', { type: 'delete', entity: 'goals', itemId: id });
    },
    
    addTask: (item) => {
      dispatch({ type: 'ADD_TASKS', payload: item });
      emitSync('entity:add', { entity: 'tasks', item });
      emitSync('activity:create', { type: 'add', entity: 'tasks', itemId: item.id, itemTitle: item.title });
    },
    updateTask: (id, data) => {
      dispatch({ type: 'UPDATE_TASKS', payload: { id, data } });
      emitSync('entity:update', { entity: 'tasks', id, data });
      emitSync('activity:create', { type: 'update', entity: 'tasks', itemId: id });
    },
    deleteTask: (id, metadata?: { parentId?: string; parentType?: string; originalLocation?: string }) => {
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        saveToRecycleBin(task, 'task', {
          parentId: metadata?.parentId || task.goalId || task.visionId,
          parentType: metadata?.parentType || (task.goalId ? 'goal' : task.visionId ? 'vision' : undefined),
          originalLocation: metadata?.originalLocation,
        });
      }
      dispatch({ type: 'DELETE_TASKS', payload: id });
      emitSync('entity:delete', { entity: 'tasks', id });
      emitSync('activity:create', { type: 'delete', entity: 'tasks', itemId: id });
    },
    
    addIdea: (item) => {
      dispatch({ type: 'ADD_IDEAS', payload: item });
      emitSync('entity:add', { entity: 'ideas', item });
      emitSync('activity:create', { type: 'add', entity: 'ideas', itemId: item.id, itemTitle: item.title });
    },
    updateIdea: (id, data) => {
      dispatch({ type: 'UPDATE_IDEAS', payload: { id, data } });
      emitSync('entity:update', { entity: 'ideas', id, data });
      emitSync('activity:create', { type: 'update', entity: 'ideas', itemId: id });
    },
    deleteIdea: (id) => {
      const idea = state.ideas.find(i => i.id === id);
      if (idea) {
        saveToRecycleBin(idea, 'idea', {
          parentId: idea.visionId || idea.goalId || idea.taskId,
          parentType: idea.visionId ? 'vision' : idea.goalId ? 'goal' : idea.taskId ? 'task' : undefined,
        });
      }
      dispatch({ type: 'DELETE_IDEAS', payload: id });
      emitSync('entity:delete', { entity: 'ideas', id });
      emitSync('activity:create', { type: 'delete', entity: 'ideas', itemId: id });
    },
    
    addNote: (item) => {
      dispatch({ type: 'ADD_NOTES', payload: item });
      emitSync('entity:add', { entity: 'notes', item });
      emitSync('activity:create', { type: 'add', entity: 'notes', itemId: item.id, itemTitle: item.title });
    },
    updateNote: (id, data) => {
      dispatch({ type: 'UPDATE_NOTES', payload: { id, data } });
      emitSync('entity:update', { entity: 'notes', id, data });
      emitSync('activity:create', { type: 'update', entity: 'notes', itemId: id });
    },
    deleteNote: (id) => {
      const note = state.notes.find(n => n.id === id);
      if (note) {
        saveToRecycleBin(note, 'note', {
          parentId: note.visionId || note.goalId || note.taskId,
          parentType: note.visionId ? 'vision' : note.goalId ? 'goal' : note.taskId ? 'task' : undefined,
        });
      }
      dispatch({ type: 'DELETE_NOTES', payload: id });
      emitSync('entity:delete', { entity: 'notes', id });
      emitSync('activity:create', { type: 'delete', entity: 'notes', itemId: id });
    },
    
    addJournal: (item) => {
      dispatch({ type: 'ADD_JOURNAL', payload: item });
      emitSync('entity:add', { entity: 'journal', item });
      emitSync('activity:create', { type: 'add', entity: 'journal', itemId: item.id, itemTitle: item.title });
    },
    updateJournal: (id, data) => {
      dispatch({ type: 'UPDATE_JOURNAL', payload: { id, data } });
      emitSync('entity:update', { entity: 'journal', id, data });
      emitSync('activity:create', { type: 'update', entity: 'journal', itemId: id });
    },
    deleteJournal: (id) => {
      const journal = state.journal.find(j => j.id === id);
      if (journal) {
        saveToRecycleBin(journal, 'journal', {
          parentId: journal.linkedVisionId || journal.linkedGoalId || journal.linkedTaskId,
          parentType: journal.linkedVisionId ? 'vision' : journal.linkedGoalId ? 'goal' : journal.linkedTaskId ? 'task' : undefined,
        });
      }
      dispatch({ type: 'DELETE_JOURNAL', payload: id });
      emitSync('entity:delete', { entity: 'journal', id });
      emitSync('activity:create', { type: 'delete', entity: 'journal', itemId: id });
    },
    
    addAchievement: (item) => {
      dispatch({ type: 'ADD_ACHIEVEMENTS', payload: item });
      emitSync('entity:add', { entity: 'achievements', item });
      emitSync('activity:create', { type: 'add', entity: 'achievements', itemId: item.id, itemTitle: item.title });
    },
    updateAchievement: (id, data) => {
      dispatch({ type: 'UPDATE_ACHIEVEMENTS', payload: { id, data } });
      emitSync('entity:update', { entity: 'achievements', id, data });
      emitSync('activity:create', { type: 'update', entity: 'achievements', itemId: id });
    },
    deleteAchievement: (id) => {
      const achievement = state.achievements.find(a => a.id === id);
      if (achievement) {
        saveToRecycleBin(achievement, 'achievement', {
          parentId: achievement.linkedVisionId || achievement.linkedGoalId || achievement.linkedTaskId,
          parentType: achievement.linkedVisionId ? 'vision' : achievement.linkedGoalId ? 'goal' : achievement.linkedTaskId ? 'task' : undefined,
        });
      }
      dispatch({ type: 'DELETE_ACHIEVEMENTS', payload: id });
      emitSync('entity:delete', { entity: 'achievements', id });
      emitSync('activity:create', { type: 'delete', entity: 'achievements', itemId: id });
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// -------------------- Hook --------------------
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
