import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Eye,
  Target,
  CheckSquare2,
  Lightbulb,
  StickyNote,
  BookOpen,
  Trophy,
  X,
  ArrowRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Safe hook to get AppContext (returns null if not available)
let useAppContextSafe: () => any = () => null;
try {
  const AppContextModule = require("@/context/AppContext");
  useAppContextSafe = AppContextModule.useAppContext;
} catch {
  // Context not available (e.g., on landing page)
}

interface SearchResult {
  id: string;
  type: "vision" | "goal" | "task" | "idea" | "note" | "journal" | "achievement";
  title: string;
  description?: string;
  route: string;
  icon: React.ReactNode;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const appContext = useAppContextSafe();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Safely get context data (may be undefined on landing page)
  const visions = appContext?.visions || [];
  const goals = appContext?.goals || [];
  const tasks = appContext?.tasks || [];
  const ideas = appContext?.ideas || [];
  const notes = appContext?.notes || [];
  const journal = appContext?.journal || [];
  const achievements = appContext?.achievements || [];

  const typeIcons = {
    vision: <Eye className="h-4 w-4" />,
    goal: <Target className="h-4 w-4" />,
    task: <CheckSquare2 className="h-4 w-4" />,
    idea: <Lightbulb className="h-4 w-4" />,
    note: <StickyNote className="h-4 w-4" />,
    journal: <BookOpen className="h-4 w-4" />,
    achievement: <Trophy className="h-4 w-4" />,
  };

  const typeColors = {
    vision: "bg-purple-100 text-purple-700 border-purple-200",
    goal: "bg-teal-100 text-teal-700 border-teal-200",
    task: "bg-amber-100 text-amber-700 border-amber-200",
    idea: "bg-yellow-100 text-yellow-700 border-yellow-200",
    note: "bg-green-100 text-green-700 border-green-200",
    journal: "bg-blue-100 text-blue-700 border-blue-200",
    achievement: "bg-rose-100 text-rose-700 border-rose-200",
  };

  // Build search results from all data
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search visions
    visions.forEach((vision: any) => {
      if (
        vision.title?.toLowerCase().includes(query) ||
        vision.description?.toLowerCase().includes(query)
      ) {
        results.push({
          id: vision.id,
          type: "vision",
          title: vision.title || "Untitled Vision",
          description: vision.description,
          route: "/app/vision",
          icon: typeIcons.vision,
        });
      }
    });

    // Search goals
    goals.forEach((goal: any) => {
      if (
        goal.title?.toLowerCase().includes(query) ||
        goal.description?.toLowerCase().includes(query)
      ) {
        results.push({
          id: goal.id,
          type: "goal",
          title: goal.title || "Untitled Goal",
          description: goal.description,
          route: "/app/goals",
          icon: typeIcons.goal,
        });
      }
    });

    // Search tasks
    tasks.forEach((task: any) => {
      if (
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      ) {
        results.push({
          id: task.id,
          type: "task",
          title: task.title || "Untitled Task",
          description: task.description,
          route: "/app/tasks",
          icon: typeIcons.task,
        });
      }
    });

    // Search ideas
    ideas.forEach((idea: any) => {
      if (
        idea.title?.toLowerCase().includes(query) ||
        idea.description?.toLowerCase().includes(query)
      ) {
        results.push({
          id: idea.id,
          type: "idea",
          title: idea.title || "Untitled Idea",
          description: idea.description,
          route: "/app/ideas",
          icon: typeIcons.idea,
        });
      }
    });

    // Search notes
    notes.forEach((note: any) => {
      if (
        note.title?.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query)
      ) {
        results.push({
          id: note.id,
          type: "note",
          title: note.title || "Untitled Note",
          description: note.content?.substring(0, 100),
          route: "/app/notes",
          icon: typeIcons.note,
        });
      }
    });

    // Search journal
    journal.forEach((entry: any) => {
      if (
        entry.title?.toLowerCase().includes(query) ||
        entry.content?.toLowerCase().includes(query)
      ) {
        results.push({
          id: entry.id,
          type: "journal",
          title: entry.title || "Untitled Entry",
          description: entry.content?.substring(0, 100),
          route: "/app/journal",
          icon: typeIcons.journal,
        });
      }
    });

    // Search achievements
    achievements.forEach((achievement: any) => {
      if (
        achievement.title?.toLowerCase().includes(query) ||
        achievement.description?.toLowerCase().includes(query)
      ) {
        results.push({
          id: achievement.id,
          type: "achievement",
          title: achievement.title || "Untitled Achievement",
          description: achievement.description,
          route: "/app/achievements",
          icon: typeIcons.achievement,
        });
      }
    });

    return results.slice(0, 10); // Limit to 10 results
  }, [searchQuery, visions, goals, tasks, ideas, notes, journal, achievements]);

  // Quick actions (always visible)
  const quickActions = useMemo(() => [
    { label: "Create Vision", route: "/app/vision", icon: <Eye className="h-4 w-4" />, shortcut: "V" },
    { label: "Create Goal", route: "/app/goals", icon: <Target className="h-4 w-4" />, shortcut: "G" },
    { label: "Create Task", route: "/app/tasks", icon: <CheckSquare2 className="h-4 w-4" />, shortcut: "T" },
    { label: "Capture Idea", route: "/app/ideas", icon: <Lightbulb className="h-4 w-4" />, shortcut: "I" },
    { label: "New Note", route: "/app/notes", icon: <StickyNote className="h-4 w-4" />, shortcut: "N" },
    { label: "Journal Entry", route: "/app/journal", icon: <BookOpen className="h-4 w-4" />, shortcut: "J" },
  ], []);

  const allItems = useMemo(() => {
    if (searchQuery.trim()) {
      return searchResults;
    }
    return quickActions.map((action, index) => ({
      id: `action-${index}`,
      type: "action" as any,
      title: action.label,
      description: undefined,
      route: action.route,
      icon: action.icon,
    }));
  }, [searchQuery, searchResults, quickActions]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
      } else if (e.key === "Enter" && allItems[selectedIndex]) {
        e.preventDefault();
        handleSelect(allItems[selectedIndex]);
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, allItems, selectedIndex, onOpenChange]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleSelect = (item: any) => {
    if (item.route) {
      navigate(item.route);
      onOpenChange(false);
      setSearchQuery("");
    }
  };

  // Group results by type
  const groupedResults = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const grouped: Record<string, SearchResult[]> = {};
    searchResults.forEach((result) => {
      if (!grouped[result.type]) {
        grouped[result.type] = [];
      }
      grouped[result.type].push(result);
    });
    return grouped;
  }, [searchResults, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-white/95 border border-gray-200/60 shadow-2xl rounded-2xl p-0 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search everything or type a command..."
              className="pl-10 h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                ESC
              </kbd>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2">
          {!searchQuery.trim() ? (
            <div className="space-y-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Quick Actions
              </div>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(action)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left",
                    selectedIndex === index
                      ? "bg-gradient-to-r from-purple-50 to-teal-50 border-2 border-purple-200"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center text-purple-600">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{action.label}</div>
                  </div>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                    {action.shortcut}
                  </kbd>
                </button>
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No results found</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedResults && Object.entries(groupedResults).map(([type, items]) => (
                <div key={type}>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                    <span>{type}</span>
                    <Badge variant="outline" className="text-xs">
                      {items.length}
                    </Badge>
                  </div>
                  {items.map((item, index) => {
                    const globalIndex = searchResults.findIndex((r) => r.id === item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className={cn(
                          "w-full flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left group",
                          selectedIndex === globalIndex
                            ? "bg-gradient-to-r from-purple-50 to-teal-50 border-2 border-purple-200"
                            : "hover:bg-gray-50 border-2 border-transparent"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          typeColors[item.type]
                        )}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 mb-1 truncate">
                            {item.title}
                          </div>
                          {item.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {item.description}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200/50 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">↵</kbd>
              <span>Select</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">ESC</kbd>
            <span>Close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;

