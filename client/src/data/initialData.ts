import type {
  Achievement,
  Goal,
  Idea,
  JournalEntry,
  Note,
  Quote,
  Task,
  Vision,
} from "@/types/app";

const iso = (date: string) => new Date(date).toISOString();

// Start with empty arrays for fresh dashboard
export const initialVisions: Vision[] = [];
export const initialGoals: Goal[] = [];
export const initialTasks: Task[] = [];
export const initialIdeas: Idea[] = [];
export const initialNotes: Note[] = [];
export const initialJournalEntries: JournalEntry[] = [];
export const initialAchievements: Achievement[] = [];

export const initialQuotes: Quote[] = [
  {
    id: "quote-habakkuk",
    text: "Write the vision and make it plain on tablets, that he may run who reads it.",
    author: "Habakkuk 2:2",
  },
  {
    id: "quote-vision",
    text: "Momentum is built in the small, consistent strides no one sees.",
    author: "Annaura",
  },
  {
    id: "quote-purpose",
    text: "Clarity turns overwhelm into order. Keep the main thing in front of you.",
    author: "Annaura",
  },
];

export const initialData = {
  visions: initialVisions,
  goals: initialGoals,
  tasks: initialTasks,
  ideas: initialIdeas,
  notes: initialNotes,
  journal: initialJournalEntries,
  achievements: initialAchievements,
  quotes: initialQuotes,
  recycleBin: [],
};

export type InitialDataShape = typeof initialData;

