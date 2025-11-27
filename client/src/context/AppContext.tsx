import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useSocket } from './SocketContext';
import { saveToRecycleBin } from '@/lib/recycleBin';
import * as ideaAPI from '@/api/idea';
import * as visionAPI from '@/api/vision';
import * as goalAPI from '@/api/goal';
import * as taskAPI from '@/api/task';
import * as noteAPI from '@/api/note';
import * as journalAPI from '@/api/journal';
import * as achievementAPI from '@/api/achievement';
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
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'LOAD_VISIONS'; payload: any[] }
  | { type: 'LOAD_GOALS'; payload: any[] }
  | { type: 'LOAD_TASKS'; payload: any[] }
  | { type: 'LOAD_IDEAS'; payload: any[] }
  | { type: 'LOAD_NOTES'; payload: any[] }
  | { type: 'LOAD_JOURNAL'; payload: any[] }
  | { type: 'LOAD_ACHIEVEMENTS'; payload: any[] };

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

  if (action.type === 'LOAD_VISIONS') {
    return { ...state, visions: action.payload };
  }

  if (action.type === 'LOAD_GOALS') {
    return { ...state, goals: action.payload };
  }

  if (action.type === 'LOAD_TASKS') {
    return { ...state, tasks: action.payload };
  }

  if (action.type === 'LOAD_IDEAS') {
    return { ...state, ideas: action.payload };
  }

  if (action.type === 'LOAD_NOTES') {
    return { ...state, notes: action.payload };
  }

  if (action.type === 'LOAD_JOURNAL') {
    return { ...state, journal: action.payload };
  }

  if (action.type === 'LOAD_ACHIEVEMENTS') {
    return { ...state, achievements: action.payload };
  }

  return state;
}

// -------------------- Context --------------------
interface AppContextType extends AppState {
  // Generic methods
  addEntity: (entity: EntityName, item: any) => void;
  updateEntity: (entity: EntityName, id: string, data: any) => void;
  deleteEntity: (entity: EntityName, id: string) => void;
  toggleTaskStatus: (id: string, status: 'Todo' | 'In Progress' | 'Done') => Promise<void>;
  
  // Specific methods for each entity (all async now for backend integration)
  addVision: (item: VisionType) => Promise<void>;
  updateVision: (id: string, data: Partial<VisionType>) => Promise<void>;
  deleteVision: (id: string) => Promise<void>;
  
  addGoal: (item: GoalType) => Promise<void>;
  updateGoal: (id: string, data: Partial<GoalType>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
  addTask: (item: TaskType) => Promise<void>;
  updateTask: (id: string, data: Partial<TaskType>) => Promise<void>;
  deleteTask: (id: string, metadata?: { parentId?: string; parentType?: string; originalLocation?: string }) => Promise<void>;
  
  addIdea: (item: IdeaType) => Promise<void>;
  updateIdea: (id: string, data: Partial<IdeaType>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  
  addNote: (item: NoteType) => Promise<void>;
  updateNote: (id: string, data: Partial<NoteType>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  
  addJournal: (item: JournalEntryType) => Promise<void>;
  updateJournal: (id: string, data: Partial<JournalEntryType>) => Promise<void>;
  deleteJournal: (id: string) => Promise<void>;
  
  addAchievement: (item: AchievementType) => Promise<void>;
  updateAchievement: (id: string, data: Partial<AchievementType>) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

// -------------------- Provider --------------------
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { socket, isConnected, emit, on, off } = useSocket();
  const isLocalUpdateRef = useRef(false); // Track if update is from local action

  // Load from backend and localStorage
  useEffect(() => {
    const loadData = async () => {
      const loadedEntities: any = {};

      // Load Visions from backend
      try {
        const visions = await visionAPI.getVisions();
        if (visions && Array.isArray(visions)) {
          loadedEntities.visions = visions.map((vision: any) => ({
            id: vision._id || vision.id,
            title: vision.title,
            description: vision.description,
            status: vision.status ? vision.status.charAt(0).toUpperCase() + vision.status.slice(1) : 'Planning',
            priority: vision.priority ? vision.priority.charAt(0).toUpperCase() + vision.priority.slice(1) : 'Medium',
            progress: vision.progress || 0,
            horizonYears: vision.horizonYears,
            startDate: vision.startDate,
            targetDate: vision.targetDate,
            tags: vision.tags || [],
            focusArea: vision.focusArea,
            createdAt: vision.createdAt,
            completedAt: vision.completedAt,
          }));
        }
      } catch (error) {
        console.warn('Failed to load visions from backend:', error);
      }

      // Load Goals from backend
      try {
        const goals = await goalAPI.getGoals();
        if (goals && Array.isArray(goals)) {
          loadedEntities.goals = goals.map((goal: any) => ({
            id: goal._id || goal.id,
            title: goal.title,
            description: goal.description,
            status: goal.status === 'not_started' ? 'Not Started' : 
                    goal.status === 'in_progress' ? 'In Progress' : 
                    goal.status === 'completed' ? 'Completed' : 
                    goal.status === 'paused' ? 'Paused' : 'Not Started',
            priority: goal.priority ? goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1) : 'Medium',
            progress: goal.progress || 0,
            deadline: goal.deadline,
            completedAt: goal.completedAt,
            linkedVisionId: goal.vision,
            tags: goal.tags || [],
            metrics: goal.metrics || [],
            createdAt: goal.createdAt,
            updatedAt: goal.updatedAt,
          }));
        }
      } catch (error) {
        console.warn('Failed to load goals from backend:', error);
      }

      // Load Tasks from backend
      try {
        const tasks = await taskAPI.getTasks();
        if (tasks && Array.isArray(tasks)) {
          loadedEntities.tasks = tasks.map((task: any) => ({
            id: task._id || task.id,
            title: task.title,
            description: task.description,
            status: task.status === 'not_started' ? 'Todo' :
                    task.status === 'in_progress' ? 'In Progress' :
                    task.status === 'completed' ? 'Done' :
                    task.status === 'blocked' ? 'Blocked' : 'Todo',
            priority: task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium',
            dueDate: task.dueDate,
            completedAt: task.completedAt,
            goalId: task.goal,
            reminder: task.reminder,
            estimatedMinutes: task.estimatedMinutes,
            tags: task.tags || [],
            checklists: task.checklists || [],
            createdAt: task.createdAt,
          }));
        }
      } catch (error) {
        console.warn('Failed to load tasks from backend:', error);
      }

      // Load Ideas from backend
      try {
        const ideas = await ideaAPI.getIdeas();
        if (ideas && Array.isArray(ideas)) {
          loadedEntities.ideas = ideas.map((idea: any) => ({
            id: idea._id || idea.id,
            title: idea.title,
            description: idea.description,
            status: idea.status ? idea.status.charAt(0).toUpperCase() + idea.status.slice(1) : 'Draft',
            priority: idea.priority ? idea.priority.charAt(0).toUpperCase() + idea.priority.slice(1) : 'Medium',
            category: idea.category,
            linkedVisionId: idea.linkedVision,
            linkedGoalId: idea.linkedGoal,
            linkedTaskId: idea.linkedTask,
            implementedAt: idea.implementedAt,
            implementationNotes: idea.implementationNotes,
            createdAt: idea.createdAt,
          }));
        }
      } catch (error) {
        console.warn('Failed to load ideas from backend:', error);
      }

      // Load Notes from backend
      try {
        const notes = await noteAPI.getNotes();
        if (notes && Array.isArray(notes)) {
          loadedEntities.notes = notes.map((note: any) => ({
            id: note._id || note.id,
            title: note.title,
            content: note.content,
            tags: note.tags || [],
            pinned: note.pinned || false,
            linkedVisionId: note.relatedVision,
            linkedGoalId: note.relatedGoal,
            linkedTaskId: note.relatedTask,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
          }));
        }
      } catch (error) {
        console.warn('Failed to load notes from backend:', error);
      }

      // Load Journal entries from backend
      try {
        const journal = await journalAPI.getJournalEntries();
        if (journal && Array.isArray(journal)) {
          loadedEntities.journal = journal.map((entry: any) => ({
            id: entry._id || entry.id,
            date: entry.entryDate || entry.date,
            title: entry.title,
            content: entry.summary || '',
            mood: entry.mood || 'neutral', // Backend uses: very_low, low, neutral, good, great
            tags: entry.tags || [],
            highlights: entry.highlights || [],
            gratitude: entry.gratitude || [],
            lessons: entry.lessons || [],
            nextSteps: entry.nextSteps || [],
            createdAt: entry.createdAt,
          }));
        }
      } catch (error) {
        console.warn('Failed to load journal entries from backend:', error);
      }

      // Load Achievements from backend
      try {
        const achievements = await achievementAPI.getAchievements();
        if (achievements && Array.isArray(achievements)) {
          loadedEntities.achievements = achievements.map((achievement: any) => ({
            id: achievement._id || achievement.id,
            title: achievement.title,
            description: achievement.description,
            type: achievement.type || 'milestone',
            imageUrl: achievement.evidenceUrl,
            documentUrl: achievement.evidenceUrl,
            date: achievement.achievedOn || achievement.date,
            issuer: achievement.issuer,
            visibility: achievement.visibility || 'private',
            impactScore: achievement.impactScore,
            linkedVisionId: achievement.relatedVision,
            linkedGoalId: achievement.relatedGoal,
            createdAt: achievement.createdAt,
          }));
        }
      } catch (error) {
        console.warn('Failed to load achievements from backend:', error);
      }

      // Dispatch loaded entities
      if (loadedEntities.visions) dispatch({ type: 'LOAD_VISIONS', payload: loadedEntities.visions });
      if (loadedEntities.goals) dispatch({ type: 'LOAD_GOALS', payload: loadedEntities.goals });
      if (loadedEntities.tasks) dispatch({ type: 'LOAD_TASKS', payload: loadedEntities.tasks });
      if (loadedEntities.ideas) dispatch({ type: 'LOAD_IDEAS', payload: loadedEntities.ideas });
      if (loadedEntities.notes) dispatch({ type: 'LOAD_NOTES', payload: loadedEntities.notes });
      if (loadedEntities.journal) dispatch({ type: 'LOAD_JOURNAL', payload: loadedEntities.journal });
      if (loadedEntities.achievements) dispatch({ type: 'LOAD_ACHIEVEMENTS', payload: loadedEntities.achievements });

      // Load remaining data from localStorage (for backward compatibility - only if not loaded from backend)
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Only load entities that weren't loaded from backend
          const fallbackState: any = {};
          if (!loadedEntities.visions && parsed.visions) fallbackState.visions = parsed.visions;
          if (!loadedEntities.goals && parsed.goals) fallbackState.goals = parsed.goals;
          if (!loadedEntities.tasks && parsed.tasks) fallbackState.tasks = parsed.tasks;
          if (!loadedEntities.ideas && parsed.ideas) fallbackState.ideas = parsed.ideas;
          if (!loadedEntities.notes && parsed.notes) fallbackState.notes = parsed.notes;
          if (!loadedEntities.journal && parsed.journal) fallbackState.journal = parsed.journal;
          if (!loadedEntities.achievements && parsed.achievements) fallbackState.achievements = parsed.achievements;
          
          if (Object.keys(fallbackState).length > 0) {
            dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...fallbackState } });
          }
        } catch (err) {
          console.error('Failed to load saved state', err);
        }
      }
    };

    loadData();
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
    toggleTaskStatus: async (id, status) => {
      try {
        const backendStatus = status === 'Todo' ? 'not_started' :
                             status === 'In Progress' ? 'in_progress' :
                             status === 'Done' ? 'completed' : 'not_started';
        await taskAPI.updateTask(id, { status: backendStatus });
        dispatch({ type: 'TOGGLE_TASK_STATUS', payload: { id, status } });
        emitSync('entity:update', { entity: 'tasks', id, data: { status } });
        emitSync('activity:create', { type: 'update', entity: 'tasks', itemId: id, action: `marked as ${status}` });
      } catch (error) {
        console.error('Error toggling task status:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'TOGGLE_TASK_STATUS', payload: { id, status } });
      }
    },
    
    // Specific methods for each entity
    addVision: async (item) => {
      try {
        const payload = {
          title: item.title,
          description: item.description || '',
          status: item.status?.toLowerCase() || 'planning',
          priority: item.priority?.toLowerCase() || 'medium',
          horizonYears: item.horizonYears || 5,
          progress: item.progress || 0,
          startDate: item.startDate,
          targetDate: item.targetDate,
          tags: item.tags || [],
          focusArea: item.focusArea,
        };
        const created = await visionAPI.createVision(payload);
        const mappedVision = {
          ...item,
          id: created._id || created.id,
        };
        dispatch({ type: 'ADD_VISIONS', payload: mappedVision });
        emitSync('entity:add', { entity: 'visions', item: mappedVision });
        emitSync('activity:create', { type: 'add', entity: 'visions', itemId: mappedVision.id, itemTitle: item.title });
      } catch (error) {
        console.error('Error creating vision:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'ADD_VISIONS', payload: item });
      }
    },
    updateVision: async (id, data) => {
      try {
        const payload: any = {};
        if (data.title !== undefined) payload.title = data.title;
        if (data.description !== undefined) payload.description = data.description;
        if (data.status !== undefined) payload.status = data.status.toLowerCase();
        if (data.priority !== undefined) payload.priority = data.priority.toLowerCase();
        if (data.progress !== undefined) payload.progress = data.progress;
        if (data.horizonYears !== undefined) payload.horizonYears = data.horizonYears;
        if (data.startDate !== undefined) payload.startDate = data.startDate;
        if (data.targetDate !== undefined) payload.targetDate = data.targetDate;
        if (data.tags !== undefined) payload.tags = data.tags;
        if (data.focusArea !== undefined) payload.focusArea = data.focusArea;
        
        const updated = await visionAPI.updateVision(id, payload);
        const mappedVision = {
          ...data,
          id: updated._id || updated.id,
          status: updated.status ? updated.status.charAt(0).toUpperCase() + updated.status.slice(1) : data.status,
          priority: updated.priority ? updated.priority.charAt(0).toUpperCase() + updated.priority.slice(1) : data.priority,
        };
        dispatch({ type: 'UPDATE_VISIONS', payload: { id, data: mappedVision } });
        emitSync('entity:update', { entity: 'visions', id, data: mappedVision });
        emitSync('activity:create', { type: 'update', entity: 'visions', itemId: id });
      } catch (error) {
        console.error('Error updating vision:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'UPDATE_VISIONS', payload: { id, data } });
      }
    },
    deleteVision: async (id) => {
      try {
        const vision = state.visions.find(v => v.id === id);
        if (vision) {
          saveToRecycleBin(vision, 'vision').catch(err => console.error('Error saving to recycle bin:', err));
        }
        await visionAPI.deleteVision(id);
        dispatch({ type: 'DELETE_VISIONS', payload: id });
        emitSync('entity:delete', { entity: 'visions', id });
        emitSync('activity:create', { type: 'delete', entity: 'visions', itemId: id });
      } catch (error) {
        console.error('Error deleting vision:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'DELETE_VISIONS', payload: id });
      }
    },
    
    addGoal: async (item) => {
      try {
        const payload = {
          title: item.title,
          description: item.description || '',
          deadline: item.deadline,
          status: item.status === 'Not Started' ? 'not_started' :
                  item.status === 'In Progress' ? 'in_progress' :
                  item.status === 'Completed' ? 'completed' :
                  item.status === 'Paused' ? 'paused' : 'not_started',
          progress: item.progress || 0,
          priority: item.priority?.toLowerCase() || 'medium',
          vision: item.linkedVisionId || null,
          tags: item.tags || [],
          metrics: item.metrics || [],
        };
        const created = await goalAPI.createGoal(payload);
        const mappedGoal = {
          ...item,
          id: created._id || created.id,
        };
        dispatch({ type: 'ADD_GOALS', payload: mappedGoal });
        emitSync('entity:add', { entity: 'goals', item: mappedGoal });
        emitSync('activity:create', { type: 'add', entity: 'goals', itemId: mappedGoal.id, itemTitle: item.title });
      } catch (error) {
        console.error('Error creating goal:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'ADD_GOALS', payload: item });
      }
    },
    updateGoal: async (id, data) => {
      try {
        const payload: any = {};
        if (data.title !== undefined) payload.title = data.title;
        if (data.description !== undefined) payload.description = data.description;
        if (data.deadline !== undefined) payload.deadline = data.deadline;
        if (data.status !== undefined) {
          payload.status = data.status === 'Not Started' ? 'not_started' :
                          data.status === 'In Progress' ? 'in_progress' :
                          data.status === 'Completed' ? 'completed' :
                          data.status === 'Paused' ? 'paused' : 'not_started';
        }
        if (data.progress !== undefined) payload.progress = data.progress;
        if (data.priority !== undefined) payload.priority = data.priority.toLowerCase();
        if (data.linkedVisionId !== undefined) payload.vision = data.linkedVisionId || null;
        if (data.tags !== undefined) payload.tags = data.tags;
        if (data.metrics !== undefined) payload.metrics = data.metrics;
        
        const updated = await goalAPI.updateGoal(id, payload);
        const mappedGoal = {
          ...data,
          id: updated._id || updated.id,
          status: updated.status === 'not_started' ? 'Not Started' :
                  updated.status === 'in_progress' ? 'In Progress' :
                  updated.status === 'completed' ? 'Completed' :
                  updated.status === 'paused' ? 'Paused' : data.status,
          priority: updated.priority ? updated.priority.charAt(0).toUpperCase() + updated.priority.slice(1) : data.priority,
        };
        dispatch({ type: 'UPDATE_GOALS', payload: { id, data: mappedGoal } });
        emitSync('entity:update', { entity: 'goals', id, data: mappedGoal });
        emitSync('activity:create', { type: 'update', entity: 'goals', itemId: id });
      } catch (error) {
        console.error('Error updating goal:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'UPDATE_GOALS', payload: { id, data } });
      }
    },
    deleteGoal: async (id) => {
      try {
        const goal = state.goals.find(g => g.id === id);
        if (goal) {
          saveToRecycleBin(goal, 'goal', {
            parentId: goal.linkedVisionId || goal.visionId,
            parentType: (goal.linkedVisionId || goal.visionId) ? 'vision' : undefined,
          }).catch(err => console.error('Error saving to recycle bin:', err));
        }
        await goalAPI.deleteGoal(id);
        dispatch({ type: 'DELETE_GOALS', payload: id });
        emitSync('entity:delete', { entity: 'goals', id });
        emitSync('activity:create', { type: 'delete', entity: 'goals', itemId: id });
      } catch (error) {
        console.error('Error deleting goal:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'DELETE_GOALS', payload: id });
      }
    },
    
    addTask: async (item) => {
      try {
        const payload = {
          title: item.title || '',
          description: item.description,
          goal: item.goalId || null,
          status: item.status === 'Todo' ? 'not_started' :
                  item.status === 'In Progress' ? 'in_progress' :
                  item.status === 'Done' ? 'completed' :
                  item.status === 'Blocked' ? 'blocked' : 'not_started',
          priority: item.priority?.toLowerCase() || 'medium',
          dueDate: item.dueDate,
          reminder: item.reminder,
          estimatedMinutes: item.estimatedMinutes,
          tags: item.tags || [],
          checklists: item.checklists || [],
          isStandalone: !item.goalId,
        };
        const created = await taskAPI.createTask(payload);
        const mappedTask = {
          ...item,
          id: created._id || created.id,
        };
        dispatch({ type: 'ADD_TASKS', payload: mappedTask });
        emitSync('entity:add', { entity: 'tasks', item: mappedTask });
        emitSync('activity:create', { type: 'add', entity: 'tasks', itemId: mappedTask.id, itemTitle: item.title });
      } catch (error) {
        console.error('Error creating task:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'ADD_TASKS', payload: item });
      }
    },
    updateTask: async (id, data) => {
      try {
        const payload: any = {};
        if (data.title !== undefined) payload.title = data.title;
        if (data.description !== undefined) payload.description = data.description;
        if (data.goalId !== undefined) payload.goal = data.goalId || null;
        if (data.status !== undefined) {
          payload.status = data.status === 'Todo' ? 'not_started' :
                          data.status === 'In Progress' ? 'in_progress' :
                          data.status === 'Done' ? 'completed' :
                          data.status === 'Blocked' ? 'blocked' : 'not_started';
        }
        if (data.priority !== undefined) payload.priority = data.priority.toLowerCase();
        if (data.dueDate !== undefined) payload.dueDate = data.dueDate;
        if (data.reminder !== undefined) payload.reminder = data.reminder;
        if (data.estimatedMinutes !== undefined) payload.estimatedMinutes = data.estimatedMinutes;
        if (data.tags !== undefined) payload.tags = data.tags;
        if (data.checklists !== undefined) payload.checklists = data.checklists;
        if (data.goalId !== undefined) payload.isStandalone = !data.goalId;
        
        const updated = await taskAPI.updateTask(id, payload);
        const mappedTask = {
          ...data,
          id: updated._id || updated.id,
          status: updated.status === 'not_started' ? 'Todo' :
                  updated.status === 'in_progress' ? 'In Progress' :
                  updated.status === 'completed' ? 'Done' :
                  updated.status === 'blocked' ? 'Blocked' : data.status,
          priority: updated.priority ? updated.priority.charAt(0).toUpperCase() + updated.priority.slice(1) : data.priority,
        };
        dispatch({ type: 'UPDATE_TASKS', payload: { id, data: mappedTask } });
        emitSync('entity:update', { entity: 'tasks', id, data: mappedTask });
        emitSync('activity:create', { type: 'update', entity: 'tasks', itemId: id });
      } catch (error) {
        console.error('Error updating task:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'UPDATE_TASKS', payload: { id, data } });
      }
    },
    deleteTask: async (id, metadata?: { parentId?: string; parentType?: string; originalLocation?: string }) => {
      try {
        const task = state.tasks.find(t => t.id === id);
        if (task) {
          saveToRecycleBin(task, 'task', {
            parentId: metadata?.parentId || task.goalId || task.visionId,
            parentType: metadata?.parentType || (task.goalId ? 'goal' : task.visionId ? 'vision' : undefined),
            originalLocation: metadata?.originalLocation,
          }).catch(err => console.error('Error saving to recycle bin:', err));
        }
        await taskAPI.deleteTask(id);
        dispatch({ type: 'DELETE_TASKS', payload: id });
        emitSync('entity:delete', { entity: 'tasks', id });
        emitSync('activity:create', { type: 'delete', entity: 'tasks', itemId: id });
      } catch (error) {
        console.error('Error deleting task:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'DELETE_TASKS', payload: id });
      }
    },
    
    addIdea: async (item) => {
      try {
        const payload = {
          title: item.title,
          description: item.description,
          status: item.status?.toLowerCase() || 'draft',
          priority: item.priority?.toLowerCase() || 'medium',
          category: item.category,
          linkedVision: item.linkedVisionId,
          linkedGoal: item.linkedGoalId,
          linkedTask: item.linkedTaskId,
          implementationNotes: item.implementationNotes,
        };
        const created = await ideaAPI.createIdea(payload);
        dispatch({ type: 'ADD_IDEAS', payload: { ...item, id: created._id || created.id } });
        emitSync('entity:add', { entity: 'ideas', item: created });
        emitSync('activity:create', { type: 'add', entity: 'ideas', itemId: created._id || created.id, itemTitle: item.title });
      } catch (error) {
        console.error('Error creating idea:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'ADD_IDEAS', payload: item });
      }
    },
    updateIdea: async (id, data) => {
      try {
        const payload: any = {};
        if (data.title !== undefined) payload.title = data.title;
        if (data.description !== undefined) payload.description = data.description;
        if (data.status !== undefined) payload.status = data.status.toLowerCase();
        if (data.priority !== undefined) payload.priority = data.priority.toLowerCase();
        if (data.category !== undefined) payload.category = data.category;
        if (data.linkedVisionId !== undefined) payload.linkedVision = data.linkedVisionId;
        if (data.linkedGoalId !== undefined) payload.linkedGoal = data.linkedGoalId;
        if (data.linkedTaskId !== undefined) payload.linkedTask = data.linkedTaskId;
        if (data.implementationNotes !== undefined) payload.implementationNotes = data.implementationNotes;
        
        const updated = await ideaAPI.updateIdea(id, payload);
        dispatch({ type: 'UPDATE_IDEAS', payload: { id, data: updated } });
        emitSync('entity:update', { entity: 'ideas', id, data: updated });
        emitSync('activity:create', { type: 'update', entity: 'ideas', itemId: id });
      } catch (error) {
        console.error('Error updating idea:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'UPDATE_IDEAS', payload: { id, data } });
      }
    },
    deleteIdea: async (id) => {
      try {
        const idea = state.ideas.find(i => i.id === id);
        if (idea) {
        saveToRecycleBin(idea, 'idea', {
          parentId: idea.linkedVisionId || idea.linkedGoalId || idea.linkedTaskId,
          parentType: idea.linkedVisionId ? 'vision' : idea.linkedGoalId ? 'goal' : idea.linkedTaskId ? 'task' : undefined,
        }).catch(err => console.error('Error saving to recycle bin:', err));
        }
        await ideaAPI.deleteIdea(id);
        dispatch({ type: 'DELETE_IDEAS', payload: id });
        emitSync('entity:delete', { entity: 'ideas', id });
        emitSync('activity:create', { type: 'delete', entity: 'ideas', itemId: id });
      } catch (error) {
        console.error('Error deleting idea:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'DELETE_IDEAS', payload: id });
      }
    },
    
    addNote: async (item) => {
      try {
        const payload = {
          title: item.title,
          content: item.content,
          tags: item.tags || [],
          pinned: item.pinned || false,
          relatedVision: item.linkedVisionId || null,
          relatedGoal: item.linkedGoalId || null,
          relatedTask: item.linkedTaskId || null,
        };
        const created = await noteAPI.createNote(payload);
        const mappedNote = {
          ...item,
          id: created._id || created.id,
        };
        dispatch({ type: 'ADD_NOTES', payload: mappedNote });
        emitSync('entity:add', { entity: 'notes', item: mappedNote });
        emitSync('activity:create', { type: 'add', entity: 'notes', itemId: mappedNote.id, itemTitle: item.title });
      } catch (error) {
        console.error('Error creating note:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'ADD_NOTES', payload: item });
      }
    },
    updateNote: async (id, data) => {
      try {
        const payload: any = {};
        if (data.title !== undefined) payload.title = data.title;
        if (data.content !== undefined) payload.content = data.content;
        if (data.tags !== undefined) payload.tags = data.tags;
        if (data.pinned !== undefined) payload.pinned = data.pinned;
        if (data.linkedVisionId !== undefined) payload.relatedVision = data.linkedVisionId || null;
        if (data.linkedGoalId !== undefined) payload.relatedGoal = data.linkedGoalId || null;
        if (data.linkedTaskId !== undefined) payload.relatedTask = data.linkedTaskId || null;
        
        const updated = await noteAPI.updateNote(id, payload);
        const mappedNote = {
          ...data,
          id: updated._id || updated.id,
        };
        dispatch({ type: 'UPDATE_NOTES', payload: { id, data: mappedNote } });
        emitSync('entity:update', { entity: 'notes', id, data: mappedNote });
        emitSync('activity:create', { type: 'update', entity: 'notes', itemId: id });
      } catch (error) {
        console.error('Error updating note:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'UPDATE_NOTES', payload: { id, data } });
      }
    },
    deleteNote: async (id) => {
      try {
        const note = state.notes.find(n => n.id === id);
        if (note) {
          saveToRecycleBin(note, 'note', {
            parentId: note.linkedVisionId || note.linkedGoalId || note.linkedTaskId,
            parentType: note.linkedVisionId ? 'vision' : note.linkedGoalId ? 'goal' : note.linkedTaskId ? 'task' : undefined,
          }).catch(err => console.error('Error saving to recycle bin:', err));
        }
        await noteAPI.deleteNote(id);
        dispatch({ type: 'DELETE_NOTES', payload: id });
        emitSync('entity:delete', { entity: 'notes', id });
        emitSync('activity:create', { type: 'delete', entity: 'notes', itemId: id });
      } catch (error) {
        console.error('Error deleting note:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'DELETE_NOTES', payload: id });
      }
    },
    
    addJournal: async (item) => {
      try {
        // Map frontend mood to backend mood enum
        const moodMap: Record<string, string> = {
          'very_low': 'very_low',
          'low': 'low',
          'neutral': 'neutral',
          'good': 'good',
          'great': 'great',
          // Map other moods to closest backend value
          'happy': 'good',
          'excited': 'great',
          'grateful': 'good',
          'proud': 'great',
          'peaceful': 'good',
          'motivated': 'good',
          'hopeful': 'good',
          'confident': 'great',
          'sad': 'low',
          'stressed': 'low',
          'tired': 'low',
          'confused': 'low',
          'anxious': 'low',
          'angry': 'very_low',
          'lonely': 'low',
        };
        
        const payload = {
          entryDate: item.date,
          mood: moodMap[item.mood || 'neutral'] || 'neutral',
          summary: item.content || '',
          highlights: item.highlights || [],
          gratitude: item.gratitude || [],
          lessons: item.lessons || [],
          nextSteps: item.nextSteps || [],
        };
        const created = await journalAPI.createJournalEntry(payload);
        const mappedJournal = {
          ...item,
          id: created._id || created.id,
        };
        dispatch({ type: 'ADD_JOURNAL', payload: mappedJournal });
        emitSync('entity:add', { entity: 'journal', item: mappedJournal });
        emitSync('activity:create', { type: 'add', entity: 'journal', itemId: mappedJournal.id, itemTitle: item.title });
      } catch (error) {
        console.error('Error creating journal entry:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'ADD_JOURNAL', payload: item });
      }
    },
    updateJournal: async (id, data) => {
      try {
        // Map frontend mood to backend mood enum
        const moodMap: Record<string, string> = {
          'very_low': 'very_low',
          'low': 'low',
          'neutral': 'neutral',
          'good': 'good',
          'great': 'great',
          'happy': 'good',
          'excited': 'great',
          'grateful': 'good',
          'proud': 'great',
          'peaceful': 'good',
          'motivated': 'good',
          'hopeful': 'good',
          'confident': 'great',
          'sad': 'low',
          'stressed': 'low',
          'tired': 'low',
          'confused': 'low',
          'anxious': 'low',
          'angry': 'very_low',
          'lonely': 'low',
        };
        
        const payload: any = {};
        if (data.date !== undefined) payload.entryDate = data.date;
        if (data.mood !== undefined) payload.mood = moodMap[data.mood] || 'neutral';
        if (data.content !== undefined) payload.summary = data.content;
        if (data.highlights !== undefined) payload.highlights = data.highlights;
        if (data.gratitude !== undefined) payload.gratitude = data.gratitude;
        if (data.lessons !== undefined) payload.lessons = data.lessons;
        if (data.nextSteps !== undefined) payload.nextSteps = data.nextSteps;
        
        const updated = await journalAPI.updateJournalEntry(id, payload);
        const mappedJournal = {
          ...data,
          id: updated._id || updated.id,
        };
        dispatch({ type: 'UPDATE_JOURNAL', payload: { id, data: mappedJournal } });
        emitSync('entity:update', { entity: 'journal', id, data: mappedJournal });
        emitSync('activity:create', { type: 'update', entity: 'journal', itemId: id });
      } catch (error) {
        console.error('Error updating journal entry:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'UPDATE_JOURNAL', payload: { id, data } });
      }
    },
    deleteJournal: async (id) => {
      try {
        const journal = state.journal.find(j => j.id === id);
        if (journal) {
          saveToRecycleBin(journal, 'journal', {
            parentId: journal.linkedVisionId || journal.linkedGoalId || journal.linkedTaskId,
            parentType: journal.linkedVisionId ? 'vision' : journal.linkedGoalId ? 'goal' : journal.linkedTaskId ? 'task' : undefined,
          }).catch(err => console.error('Error saving to recycle bin:', err));
        }
        await journalAPI.deleteJournalEntry(id);
        dispatch({ type: 'DELETE_JOURNAL', payload: id });
        emitSync('entity:delete', { entity: 'journal', id });
        emitSync('activity:create', { type: 'delete', entity: 'journal', itemId: id });
      } catch (error) {
        console.error('Error deleting journal entry:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'DELETE_JOURNAL', payload: id });
      }
    },
    
    addAchievement: async (item) => {
      try {
        const payload = {
          title: item.title,
          description: item.description,
          achievedOn: item.date,
          relatedVision: item.linkedVisionId || null,
          relatedGoal: item.linkedGoalId || null,
          visibility: item.visibility || 'private',
          evidenceUrl: item.imageUrl || item.documentUrl,
          impactScore: item.impactScore,
        };
        const created = await achievementAPI.createAchievement(payload);
        const mappedAchievement = {
          ...item,
          id: created._id || created.id,
        };
        dispatch({ type: 'ADD_ACHIEVEMENTS', payload: mappedAchievement });
        emitSync('entity:add', { entity: 'achievements', item: mappedAchievement });
        emitSync('activity:create', { type: 'add', entity: 'achievements', itemId: mappedAchievement.id, itemTitle: item.title });
      } catch (error) {
        console.error('Error creating achievement:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'ADD_ACHIEVEMENTS', payload: item });
      }
    },
    updateAchievement: async (id, data) => {
      try {
        const payload: any = {};
        if (data.title !== undefined) payload.title = data.title;
        if (data.description !== undefined) payload.description = data.description;
        if (data.date !== undefined) payload.achievedOn = data.date;
        if (data.linkedVisionId !== undefined) payload.relatedVision = data.linkedVisionId || null;
        if (data.linkedGoalId !== undefined) payload.relatedGoal = data.linkedGoalId || null;
        if (data.visibility !== undefined) payload.visibility = data.visibility;
        if (data.imageUrl !== undefined || data.documentUrl !== undefined) payload.evidenceUrl = data.imageUrl || data.documentUrl;
        if (data.impactScore !== undefined) payload.impactScore = data.impactScore;
        
        const updated = await achievementAPI.updateAchievement(id, payload);
        const mappedAchievement = {
          ...data,
          id: updated._id || updated.id,
        };
        dispatch({ type: 'UPDATE_ACHIEVEMENTS', payload: { id, data: mappedAchievement } });
        emitSync('entity:update', { entity: 'achievements', id, data: mappedAchievement });
        emitSync('activity:create', { type: 'update', entity: 'achievements', itemId: id });
      } catch (error) {
        console.error('Error updating achievement:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'UPDATE_ACHIEVEMENTS', payload: { id, data } });
      }
    },
    deleteAchievement: async (id) => {
      try {
        const achievement = state.achievements.find(a => a.id === id);
        if (achievement) {
          saveToRecycleBin(achievement, 'achievement', {
            parentId: achievement.linkedVisionId || achievement.linkedGoalId || achievement.linkedTaskId,
            parentType: achievement.linkedVisionId ? 'vision' : achievement.linkedGoalId ? 'goal' : achievement.linkedTaskId ? 'task' : undefined,
          }).catch(err => console.error('Error saving to recycle bin:', err));
        }
        await achievementAPI.deleteAchievement(id);
        dispatch({ type: 'DELETE_ACHIEVEMENTS', payload: id });
        emitSync('entity:delete', { entity: 'achievements', id });
        emitSync('activity:create', { type: 'delete', entity: 'achievements', itemId: id });
      } catch (error) {
        console.error('Error deleting achievement:', error);
        // Fallback to local state if API fails
        dispatch({ type: 'DELETE_ACHIEVEMENTS', payload: id });
      }
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
