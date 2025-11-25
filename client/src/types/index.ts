export interface VisionProgressUpdate {
  id: string;
  progress: number;
  status: string;
  updateText: string;
  timestamp: string;
  savedToJournal?: boolean;
}

export interface VisionType {
  id: string;
  title: string;
  description?: string;
  timeframe?: string;
  createdAt: string;
  completedAt?: string;
  status: "Planning" | "Active" | "Paused" | "Completed" | "Evolved" | "Archived";
  priority?: "Low" | "Medium" | "High" | "Critical";
  progress?: number;
  lastUpdate?: string;
  updates?: string[];
  progressHistory?: VisionProgressUpdate[];
}

export interface GoalType {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  progress: number;
  createdAt: string;
  completedAt?: string;
  status: "Not Started" | "In Progress" | "Completed";
  linkedVisionId?: string;
  updatedAt?: string; // <--- add this

}

export interface TaskType {
  id: string;
  title?: string;
  description?: string;
  priority: "High" | "Medium" | "Low";
  status: "Todo" | "In Progress" | "Done";
  goalId?: string;
  visionId?: string;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
}

export interface IdeaType {
  id: string;
  title?: string;
  description?: string;
  status: "Draft" | "Exploring" | "Ready" | "Implemented" | "Archived";
  priority?: "Low" | "Medium" | "High";
  category?: string;
  createdAt: string;
  implementedAt?: string;
  implementationNotes?: string;
  linkedVisionId?: string;
  linkedGoalId?: string;
  linkedTaskId?: string;
}

export interface NoteType {
  id: string;
  title?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  category?: string;
  linkedVisionId?: string;
  linkedGoalId?: string;
  linkedTaskId?: string;
}

export interface JournalEntryType {
  id: string;
  date: string;
  title?: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'stressed' | 'grateful' | 'proud' | 'anxious' | 'peaceful' | 'motivated' | 'tired' | 'confused' | 'angry' | 'hopeful' | 'lonely' | 'confident';
  tags: string[];
  createdAt: string;
  linkedVisionId?: string;
  linkedGoalId?: string;
  linkedTaskId?: string;
}

export interface AchievementType {
  id: string;
  title: string;
  description?: string;
  type: 'certificate' | 'award' | 'recognition' | 'milestone' | 'photo' | 'document';
  imageUrl?: string;
  documentUrl?: string;
  date: string;
  issuer?: string;
  category?: string;
  isPublic: boolean;
  linkedVisionId?: string;
  linkedGoalId?: string;
  linkedTaskId?: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  signupTime: string;
  name?: string;
  profileImage?: string;
}
