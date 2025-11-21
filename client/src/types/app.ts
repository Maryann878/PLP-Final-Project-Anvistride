export type VisionStatus = "Active" | "Planning" | "Paused" | "Completed";

export interface Vision {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  status: VisionStatus;
  progress: number;
  focusAreas: string[];
  milestones: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export type GoalStatus = "Not Started" | "In Progress" | "At Risk" | "Completed";
export type GoalImpact = "High" | "Medium" | "Low";

export interface Goal {
  id: string;
  visionId?: string;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  status: GoalStatus;
  impact: GoalImpact;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = "Low" | "Medium" | "High" | "Critical";
export type TaskStatus = "Todo" | "In Progress" | "Done";

export interface Task {
  id: string;
  goalId?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  impact: GoalImpact;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  reflection: string;
  gratitude: string;
  lessonLearned: string;
  mood: "Energized" | "Focused" | "Grateful" | "Hopeful" | "Calm";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "Milestone" | "Learning" | "Win" | "Community";
  impact: GoalImpact;
  highlights: string[];
}

export interface Quote {
  id: string;
  text: string;
  author: string;
}

export type RecycleItemType = "vision" | "goal" | "task" | "idea" | "note" | "journal" | "achievement";

export interface RecycleItem {
  id: string;
  type: RecycleItemType;
  entityId: string;
  data: Vision | Goal | Task | Idea | Note | JournalEntry | Achievement;
  deletedAt: string;
}

