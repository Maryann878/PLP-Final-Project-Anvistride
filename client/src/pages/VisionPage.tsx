import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { getGlobalToast } from "@/lib/toast";
import {
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Target,
  PlusCircle,
  CheckCircle,
  Plus,
  X,
  TrendingUp,
  Lightbulb,
  CheckSquare2,
  Award,
  Calendar,
  TrendingUp as TrendingUpIcon,
  Sparkles,
  ChevronRight,
  Save,
  History,
  Clock,
  BookOpen,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import type { VisionType } from "@/types";

const statusOptions = ["Planning", "Active", "Paused", "Completed", "Evolved", "Archived"] as const;
const priorityOptions = ["Low", "Medium", "High", "Critical"] as const;

// Extended type for vision with computed properties
interface VisionWithCounts extends VisionType {
  linkedGoalsCount: number;
  linkedTasksCount: number;
  linkedIdeasCount: number;
}

const badgeVariants = {
  status: {
    Planning: "bg-blue-100 text-blue-700",
    Active: "bg-green-100 text-green-700",
    Paused: "bg-yellow-100 text-yellow-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Evolved: "bg-purple-100 text-purple-700",
    Archived: "bg-gray-100 text-gray-700",
  },
  priority: {
    Low: "bg-gray-100 text-gray-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-orange-100 text-orange-700",
    Critical: "bg-red-100 text-red-700",
  },
};

export default function VisionPage() {
  const { visions, goals, tasks, ideas, addVision, updateVision, deleteVision, addJournal, updateJournal, journal } = useAppContext();
  const navigate = useNavigate();

  // States
  const [showModal, setShowModal] = useState(false);
  const [editingVision, setEditingVision] = useState<VisionType | null>(null);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [newlyCreatedVision, setNewlyCreatedVision] = useState<VisionType | null>(null);
  const [expandedVisionId, setExpandedVisionId] = useState<string | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedVisionForProgress, setSelectedVisionForProgress] = useState<VisionType | null>(null);
  const [showProgressHistoryModal, setShowProgressHistoryModal] = useState(false);
  const [selectedVisionForHistory, setSelectedVisionForHistory] = useState<VisionType | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeframe: "",
    customTimeframe: "",
    status: "Active" as typeof statusOptions[number],
    priority: "Medium" as typeof priorityOptions[number],
    progress: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<string | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);

  // Mobile states
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset form when modal closes
  useEffect(() => {
    if (!showModal && !editingVision) {
      setFormData({
        title: "",
        description: "",
        timeframe: "",
        customTimeframe: "",
        status: "Active",
        priority: "Medium",
        progress: 0,
      });
    }
  }, [showModal, editingVision]);

  // Visions with auto-calculated progress (only if progress not manually set)
  const visionsWithProgress: VisionWithCounts[] = useMemo(() => {
    return visions.map((vision: VisionType) => {
      const linkedGoals = goals.filter(goal => goal.linkedVisionId?.toString() === vision.id.toString());
      const linkedTasks = tasks.filter(task => task.visionId?.toString() === vision.id.toString());
      const linkedIdeas = ideas.filter(idea => idea.linkedVisionId?.toString() === vision.id.toString());
      
      // Use manually set progress if it exists, otherwise calculate from goals
      let totalProgress = vision.progress || 0;
      // If vision has progressHistory, use the latest progress from history (most recent update)
      if (vision.progressHistory && vision.progressHistory.length > 0) {
        totalProgress = vision.progressHistory[0].progress;
      } else if (vision.progress !== undefined && vision.progress !== null) {
        // Use the saved progress value if it exists
        totalProgress = vision.progress;
      } else if (linkedGoals.length > 0) {
        // Only auto-calculate if no manual progress updates exist
        const completedGoals = linkedGoals.filter(goal => goal.status === "Completed");
        totalProgress = Math.round((completedGoals.length / linkedGoals.length) * 100);
      }
      
      return {
        ...vision,
        progress: totalProgress,
        linkedGoalsCount: linkedGoals.length,
        linkedTasksCount: linkedTasks.length,
        linkedIdeasCount: linkedIdeas.length,
      };
    });
  }, [visions, goals, tasks, ideas]);

  // Filtered visions
  const filteredVisions = useMemo(() => {
    let filtered = visionsWithProgress;

    if (debouncedSearch) {
      filtered = filtered.filter(v => 
        v.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        v.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      if (selectedStatus === "Accomplished") {
        filtered = filtered.filter(v => {
          const linkedGoals = goals.filter(goal => goal.linkedVisionId?.toString() === v.id.toString());
          const allGoalsCompleted = linkedGoals.length > 0 && linkedGoals.every(goal => goal.status === "Completed");
          const progressComplete = v.progress === 100;
          return progressComplete || allGoalsCompleted || v.status === "Completed";
        });
      } else {
        filtered = filtered.filter(v => v.status === selectedStatus);
      }
    }

    if (selectedPriority !== "all") {
      filtered = filtered.filter(v => v.priority === selectedPriority);
    }

    return filtered;
  }, [visionsWithProgress, debouncedSearch, selectedStatus, selectedPriority, goals]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedStatus !== "all") count++;
    if (selectedPriority !== "all") count++;
    if (searchTerm) count++;
    return count;
  };

  // Handlers
  const handleCancelEdit = () => {
    setEditingVision(null);
    setFormData({
      title: "",
      description: "",
      timeframe: "",
      customTimeframe: "",
      status: "Active",
      priority: "Medium",
      progress: 0,
    });
  };

  const openCreateModal = () => {
    handleCancelEdit();
    setShowModal(true);
  };

  const openEditModal = (vision: VisionType) => {
    setEditingVision(vision);
    setFormData({
      title: vision.title,
      description: vision.description || "",
      timeframe: vision.timeframe || "",
      customTimeframe: "",
      status: vision.status || "Active",
      priority: vision.priority || "Medium",
      progress: vision.progress || 0,
    });
    setShowModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowModal(false);
    handleCancelEdit();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    const finalTimeframe = formData.timeframe === "custom" ? formData.customTimeframe : formData.timeframe;

    const submitData = {
      ...formData,
      timeframe: finalTimeframe,
      description: formData.description || "",
      updatedAt: new Date().toISOString(),
    };

    if (editingVision) {
      updateVision(editingVision.id, submitData);
      setEditingVision(null);
      setShowModal(false);
    } else {
      const newVision: VisionType = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description || "",
        timeframe: finalTimeframe,
        status: formData.status,
        priority: formData.priority,
        progress: formData.progress,
        createdAt: new Date().toISOString(),
        completedAt: formData.status === "Completed" ? new Date().toISOString() : undefined,
        progressHistory: [], // Initialize empty progress history
      };
      addVision(newVision);
      setShowModal(false);
      setNewlyCreatedVision(newVision);
      setShowCongratsModal(true);
    }
  };

  const handleDelete = (id: string) => {
    const vision = visions.find((v) => v.id === id);
    deleteVision(id);
    const toast = getGlobalToast();
    if (toast) {
      toast({
        title: "Vision deleted",
        description: vision?.title ? `"${vision.title}" has been deleted.` : "Vision has been deleted.",
        variant: "default",
      });
    }
  };

  const toggleDesc = (id: string) => {
    setExpandedDesc(expandedDesc === id ? null : id);
  };

  const toggleLinkedItems = (visionId: string) => {
    setExpandedVisionId(expandedVisionId === visionId ? null : visionId);
  };

  const handleCreateGoalFromVision = (visionId: string) => {
    navigate(`/app/goals?visionId=${visionId}`);
  };

  const handleCreateGoalFromCongrats = () => {
    setShowCongratsModal(false);
    if (newlyCreatedVision) {
      navigate(`/app/goals?visionId=${newlyCreatedVision.id}`);
    }
    setNewlyCreatedVision(null);
  };

  const handleLaterFromCongrats = () => {
    setShowCongratsModal(false);
    setNewlyCreatedVision(null);
  };

  const handleUpdateClick = (vision: VisionType) => {
    openEditModal(vision);
  };

  const handleProgressUpdateClick = (vision: VisionType) => {
    setSelectedVisionForProgress(vision);
    setShowProgressModal(true);
  };

  // Progress update modal state
  const [progressFormData, setProgressFormData] = useState({
    progress: 0,
    updateText: "",
    saveToJournal: false,
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [initialProgress, setInitialProgress] = useState(0);
  const MAX_CHARACTERS = 500;

  // Smart suggestions based on progress
  const getSmartSuggestions = (progress: number) => {
    if (progress === 0) {
      return [
        "Break down your vision into smaller, actionable goals",
        "Set a clear timeline and milestones",
        "Identify the first step you can take today",
      ];
    } else if (progress > 0 && progress < 25) {
      return [
        "You're getting started! Keep the momentum going",
        "Review your goals and ensure they align with this vision",
        "Celebrate small wins along the way",
      ];
    } else if (progress >= 25 && progress < 50) {
      return [
        "You're making progress! Stay consistent",
        "Review what's working and adjust what isn't",
        "Consider breaking down larger goals into smaller tasks",
      ];
    } else if (progress >= 50 && progress < 75) {
      return [
        "Great progress! You're halfway there",
        "Maintain your current pace and stay focused",
        "Review your timeline and adjust if needed",
      ];
    } else if (progress >= 75 && progress < 100) {
      return [
        "Almost there! Keep pushing forward",
        "Focus on completing remaining goals",
        "Plan how you'll celebrate when you reach 100%",
      ];
    } else {
      return [
        "Congratulations! You've completed this vision",
        "Reflect on your journey and what you learned",
        "Consider what's next or how this vision has evolved",
      ];
    }
  };

  const getProgressStatus = (progress: number): string => {
    if (progress === 0) return "Not Started";
    if (progress > 0 && progress < 25) return "Getting Started";
    if (progress >= 25 && progress < 50) return "Making Progress";
    if (progress >= 50 && progress < 75) return "Good Progress";
    if (progress >= 75 && progress < 100) return "Almost There";
    return "Completed";
  };

  const getProgressStatusColor = (progress: number): string => {
    if (progress === 0) return "text-gray-600";
    if (progress > 0 && progress < 25) return "text-blue-600";
    if (progress >= 25 && progress < 50) return "text-purple-600";
    if (progress >= 50 && progress < 75) return "text-teal-600";
    if (progress >= 75 && progress < 100) return "text-amber-600";
    return "text-green-600";
  };

  const handleProgressSubmit = () => {
    if (!selectedVisionForProgress) return;

    // Create progress update entry
    const progressUpdate = {
      id: Date.now().toString(),
      progress: progressFormData.progress,
      status: getProgressStatus(progressFormData.progress),
      updateText: progressFormData.updateText.trim(),
      timestamp: new Date().toISOString(),
      savedToJournal: progressFormData.saveToJournal,
    };

    // Get existing progress history or create new array
    const existingHistory = selectedVisionForProgress.progressHistory || [];
    const updatedHistory = [progressUpdate, ...existingHistory]; // Add new update at the beginning

    // Update vision progress with history
    updateVision(selectedVisionForProgress.id, {
      progress: progressFormData.progress,
      lastUpdate: new Date().toISOString(),
      progressHistory: updatedHistory,
    });

    // Save to journal if checkbox is checked
    if (progressFormData.saveToJournal && progressFormData.updateText.trim()) {
      const journalEntry = {
        id: Date.now().toString(),
        title: `Vision Progress Update: ${selectedVisionForProgress.title}`,
        content: `Progress: ${progressFormData.progress}% - ${getProgressStatus(progressFormData.progress)}\n\n${progressFormData.updateText}`,
        date: new Date().toISOString().split('T')[0],
        mood: 'motivated' as const,
        tags: ['vision', 'progress', 'reflection'],
        linkedVisionId: selectedVisionForProgress.id,
        createdAt: new Date().toISOString(),
      };
      addJournal(journalEntry);
    }

    const toast = getGlobalToast();
    if (toast) {
      toast({
        title: "Progress Updated",
        description: `Vision progress updated to ${progressFormData.progress}%`,
        variant: "default",
      });
    }

    // Reset form and close modal
    setProgressFormData({
      progress: 0,
      updateText: "",
      saveToJournal: false,
    });
    setShowProgressModal(false);
    setSelectedVisionForProgress(null);
    setShowSuggestions(false);
  };

  // Initialize progress form when modal opens
  useEffect(() => {
    if (selectedVisionForProgress) {
      const currentProgress = selectedVisionForProgress.progress || 0;
      setInitialProgress(currentProgress);
      setProgressFormData({
        progress: currentProgress,
        updateText: "",
        saveToJournal: false,
      });
    }
  }, [selectedVisionForProgress]);

  // State for editing progress history entries
  const [editingProgressUpdate, setEditingProgressUpdate] = useState<{ visionId: string; updateId: string } | null>(null);
  const [editProgressText, setEditProgressText] = useState("");

  const handleEditProgressUpdate = (visionId: string, updateId: string, currentText: string) => {
    setEditingProgressUpdate({ visionId, updateId });
    setEditProgressText(currentText);
  };

  const handleSaveProgressUpdate = (visionId: string, updateId: string) => {
    const vision = visions.find(v => v.id === visionId);
    if (!vision || !vision.progressHistory) return;

    const updateIndex = vision.progressHistory.findIndex(u => u.id === updateId);
    if (updateIndex === -1) return;

    const update = vision.progressHistory[updateIndex];
    const updatedUpdate = {
      ...update,
      updateText: editProgressText.trim(),
    };

    const updatedHistory = [...vision.progressHistory];
    updatedHistory[updateIndex] = updatedUpdate;

    // Update vision with edited history
    updateVision(visionId, {
      progressHistory: updatedHistory,
    });

    // If this update was saved to journal, find and update the journal entry
    if (update.savedToJournal) {
      // Find journal entry by matching content pattern and linkedVisionId
      const journalEntry = journal.find(j => 
        j.linkedVisionId === visionId &&
        j.content.includes(`Progress: ${update.progress}%`) &&
        j.content.includes(update.updateText)
      );

      if (journalEntry) {
        // Update journal entry content
        const updatedContent = `Progress: ${update.progress}% - ${update.status}\n\n${editProgressText.trim()}`;
        updateJournal(journalEntry.id, {
          content: updatedContent,
        });
      }
    }

    setEditingProgressUpdate(null);
    setEditProgressText("");

    const toast = getGlobalToast();
    if (toast) {
      toast({
        title: "Update Saved",
        description: "Progress update has been updated successfully.",
        variant: "default",
      });
    }
  };

  const handleCancelEditProgressUpdate = () => {
    setEditingProgressUpdate(null);
    setEditProgressText("");
  };

  // Check if form has changes
  const hasChanges = progressFormData.progress !== initialProgress || progressFormData.updateText.trim().length > 0;
  const canSave = hasChanges && progressFormData.updateText.trim().length > 0;

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* HEADER */}
      <Card className="bg-white border border-gray-200/80 shadow-sm rounded-xl">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Eye className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-2 tracking-tight leading-tight">
                  Your Visions
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  Define your long-term aspirations and dreams
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vision Statistics - Compact */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-200/50">
          <Eye className="h-4 w-4 text-purple-600" />
          <span className="text-lg font-bold text-gray-900">{visionsWithProgress.length}</span>
          <span className="text-xs text-gray-600 font-medium">Total Visions</span>
        </div>
        <Button 
          onClick={openCreateModal} 
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:shadow-md hover:shadow-purple-500/25 transition-all duration-300 font-semibold"
        >
          <PlusCircle className="h-5 w-5" /> 
          New Vision
        </Button>
      </div>

      {/* SEARCH & FILTERS - Only show when there are visions */}
      {visionsWithProgress.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Search visions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(prev => !prev)}
              className="flex items-center gap-1"
            >
              <Filter size={16} /> Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-4 mt-2 md:mt-0">
              <Select value={selectedStatus} onValueChange={val => setSelectedStatus(val)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                  <SelectItem value="Accomplished">Accomplished</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPriority} onValueChange={val => setSelectedPriority(val)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  {priorityOptions.map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* VISIONS GRID OR EMPTY STATE */}
      {filteredVisions.length === 0 && visionsWithProgress.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 sm:p-16 text-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 via-purple-50 to-teal-100 dark:from-purple-900/30 dark:to-teal-900/30 flex items-center justify-center shadow-lg shadow-purple-500/10 animate-pulse-slow">
              <Eye className="h-14 w-14 sm:h-16 sm:w-16 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Visions Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Create your first vision to define your long-term aspirations and set the direction for your goals.
            </p>
            <Button 
              onClick={openCreateModal} 
              className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            >
              Create Your First Vision
            </Button>
          </CardContent>
        </Card>
      ) : filteredVisions.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 sm:p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <Eye className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Visions Match Your Filters</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Try adjusting your search criteria or clear the filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {filteredVisions.map(vision => {
            const formatDate = (dateString?: string) => {
              if (!dateString) return 'N/A';
              const date = new Date(dateString);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            };

            return (
              <Card key={vision.id} className={`${glassClass} hover:shadow-lg transition-all duration-300 border border-gray-200/80 overflow-hidden flex flex-col`}>
                {/* Header Section */}
                <CardHeader className="pb-3 px-5 pt-5">
                  <div className="flex justify-between items-start gap-2 sm:gap-3">
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex-1 leading-tight pr-2">{vision.title}</CardTitle>
                    <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleProgressUpdateClick(vision)}
                        className="h-8 w-8 p-0 hover:bg-purple-50 text-purple-600 hover:text-purple-700"
                        title="Update Progress"
                      >
                        <TrendingUpIcon size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleUpdateClick(vision)}
                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                        title="Edit Vision"
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(vision.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 text-red-600 hover:text-red-700"
                        title="Delete Vision"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge className={`${badgeVariants.status[vision.status]} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                      {vision.status}
                    </Badge>
                    {vision.priority && (
                      <Badge className={`${badgeVariants.priority[vision.priority]} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                        {vision.priority}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                {/* Description */}
                <CardContent className="px-5 pt-0 pb-4 flex-1">
                  {vision.description && (
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                      {expandedDesc === vision.id ? vision.description : vision.description.slice(0, 100)}
                      {vision.description.length > 100 && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => toggleDesc(vision.id)} 
                          className="h-auto p-0 ml-1 text-purple-600 font-medium text-sm"
                        >
                          {expandedDesc === vision.id ? "Show Less" : "...Read More"}
                        </Button>
                      )}
                    </p>
                  )}
                </CardContent>

                {/* Progress Section */}
                <div className="px-5 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Progress</span>
                    <span className="text-sm font-bold text-purple-600">{vision.progress || 0}%</span>
                  </div>
                  <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 h-full rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 transition-all duration-500 ease-out"
                      style={{ width: `${vision.progress || 0}%` }}
                    />
                  </div>
                  <p className={`text-xs font-medium ${getProgressStatusColor(vision.progress || 0)}`}>
                    {getProgressStatus(vision.progress || 0)}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 mx-5"></div>

                {/* Date at Bottom */}
                <div className="px-5 pt-3 pb-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="font-medium">{formatDate(vision.createdAt)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <CardFooter className="px-5 pt-2 pb-5 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => toggleLinkedItems(vision.id)}
                      className="text-xs font-medium border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 h-9"
                    >
                      {expandedVisionId === vision.id ? "Hide Linked" : "Show Linked"}
                      <ChevronDown className={`h-3.5 w-3.5 ml-1.5 transition-transform ${expandedVisionId === vision.id ? 'rotate-180' : ''}`} />
                    </Button>
                    {vision.progressHistory && vision.progressHistory.length > 0 && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setSelectedVisionForHistory(vision);
                          setShowProgressHistoryModal(true);
                        }}
                        className="text-xs font-medium border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-300 h-9"
                      >
                        <History className="h-3.5 w-3.5 mr-1.5" />
                        History
                      </Button>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleCreateGoalFromVision(vision.id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:shadow-md hover:shadow-purple-500/25 transition-all duration-300 text-xs font-semibold h-9"
                  >
                    <Target className="h-3.5 w-3.5 mr-1.5" />
                    New Goal
                  </Button>
                </CardFooter>

                {/* Expanded Linked Items */}
                {expandedVisionId === vision.id && (
                  <div className="px-5 pb-5 pt-0 border-t border-gray-200 space-y-2 mt-0">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50/50 border border-purple-100">
                      <span className="text-sm font-medium text-gray-700">Goals</span>
                      <Badge variant="outline" className="bg-white border-purple-200 text-purple-700 font-semibold">{vision.linkedGoalsCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-teal-50/50 border border-teal-100">
                      <span className="text-sm font-medium text-gray-700">Tasks</span>
                      <Badge variant="outline" className="bg-white border-teal-200 text-teal-700 font-semibold">{vision.linkedTasksCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 border border-amber-100">
                      <span className="text-sm font-medium text-gray-700">Ideas</span>
                      <Badge variant="outline" className="bg-white border-amber-200 text-amber-700 font-semibold">{vision.linkedIdeasCount}</Badge>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <Dialog open={showModal} onOpenChange={(open) => {
        if (!open) {
          handleCloseCreateModal();
        }
      }}>
        <DialogContent className="backdrop-blur-xl bg-white/95 border-2 border-purple-200/60 shadow-2xl shadow-purple-900/20 rounded-2xl sm:rounded-3xl max-w-2xl mx-auto max-h-[90vh] sm:max-h-[90vh] overflow-y-auto p-0 mx-2 sm:mx-4 md:mx-auto" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 p-6 rounded-t-3xl">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-2 ring-white/30">
                  <Eye className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-3xl font-bold text-white mb-1">
                    {editingVision ? "Edit Vision" : "Create New Vision"}
                  </DialogTitle>
                  <DialogDescription className="text-white/90 text-base font-medium">
                    {editingVision 
                      ? "Update your vision details and continue your journey toward your goals." 
                      : "Define your long-term vision to guide your goals and actions. Make it clear and inspiring."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6 pt-6 sm:pt-8">
            <div className="space-y-2.5">
              <Label htmlFor="vision-title" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-teal-500"></span>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="vision-title"
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })} 
                placeholder="e.g., Become a Full Stack Developer"
                className="h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl transition-all"
                required
              />
              <p className="text-xs text-gray-500 font-medium">Give your vision a clear and inspiring title</p>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="vision-description" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-teal-500"></span>
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea 
                id="vision-description"
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Describe your vision in detail. What do you want to achieve? Why is it important to you?"
                className="min-h-[140px] text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl transition-all resize-none"
                required
              />
              <p className="text-xs text-gray-500 font-medium">Provide a detailed description of your vision</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="vision-status" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-teal-500"></span>
                  Status
                </Label>
                <Select value={formData.status} onValueChange={val => setFormData({ ...formData, status: val as typeof statusOptions[number] })}>
                  <SelectTrigger id="vision-status" className="h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="vision-priority" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-teal-500"></span>
                  Priority
                </Label>
                <Select value={formData.priority} onValueChange={val => setFormData({ ...formData, priority: val as typeof priorityOptions[number] })}>
                  <SelectTrigger id="vision-priority" className="h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t-2 border-gray-100 mt-4 sm:mt-6 pb-2 sm:pb-0">
              <Button 
                type="button"
                variant="outline" 
                onClick={handleCloseCreateModal}
                className="w-full sm:w-auto h-12 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="w-full sm:w-auto h-12 text-base font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 text-white hover:from-purple-700 hover:via-purple-600 hover:to-teal-600 shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 transition-all duration-300 rounded-xl"
              >
                {editingVision ? "Update Vision" : "Create Vision"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONGRATS MODAL */}
      <Dialog open={showCongratsModal} onOpenChange={setShowCongratsModal}>
        <DialogContent className={`${glassClass} rounded-2xl max-w-md mx-auto`}>
          <DialogHeader>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white shadow-xl">
                <CheckCircle className="h-8 w-8" />
              </div>
              <DialogTitle className="text-2xl font-bold">Vision Created!</DialogTitle>
              <DialogDescription className="text-base">
                Your vision has been successfully created. Would you like to create a goal for this vision now?
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleLaterFromCongrats}
              className="w-full sm:w-auto"
            >
              Later
            </Button>
            <Button 
              onClick={handleCreateGoalFromCongrats}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:shadow-lg transition-all duration-300"
            >
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PROGRESS HISTORY MODAL */}
      <Dialog open={showProgressHistoryModal} onOpenChange={(open) => {
        if (!open) {
          setShowProgressHistoryModal(false);
          setSelectedVisionForHistory(null);
          setEditingProgressUpdate(null);
          setEditProgressText("");
        }
      }}>
        <DialogContent className={`${glassClass} rounded-2xl max-w-3xl mx-auto max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-0 mx-2 sm:mx-4 md:mx-auto`} style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
          {selectedVisionForHistory && selectedVisionForHistory.progressHistory && selectedVisionForHistory.progressHistory.length > 0 && (
            <>
              <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-purple-500 p-4 sm:p-5 md:p-6 rounded-t-2xl sticky top-0 z-10">
                <DialogHeader className="text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-2 ring-white/30 flex-shrink-0">
                        <History className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 leading-tight">
                          Progress Journey
                        </DialogTitle>
                        <DialogDescription className="text-white/90 text-xs sm:text-sm md:text-base font-medium truncate">
                          {selectedVisionForHistory.title}
                        </DialogDescription>
                      </div>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 font-semibold text-xs sm:text-sm w-fit sm:w-auto">
                      {selectedVisionForHistory.progressHistory.length} {selectedVisionForHistory.progressHistory.length === 1 ? 'Update' : 'Updates'}
                    </Badge>
                  </div>
                </DialogHeader>
              </div>
              
              <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                {selectedVisionForHistory.progressHistory.map((update, index) => {
                  const updateDate = new Date(update.timestamp);
                  const formatDateTime = (date: Date) => {
                    const now = new Date();
                    const diffMs = now.getTime() - date.getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMs / 3600000);
                    const diffDays = Math.floor(diffMs / 86400000);
                    const diffWeeks = Math.floor(diffDays / 7);
                    const diffMonths = Math.floor(diffDays / 30);

                    if (diffMins < 1) return 'Just now';
                    if (diffMins < 60) return `${diffMins}m ago`;
                    if (diffHours < 24) return `${diffHours}h ago`;
                    if (diffDays < 7) return `${diffDays}d ago`;
                    if (diffWeeks < 4) return `${diffWeeks}w ago`;
                    if (diffMonths < 12) return `${diffMonths}mo ago`;
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  };

                  const prevUpdate = index < selectedVisionForHistory.progressHistory!.length - 1 
                    ? selectedVisionForHistory.progressHistory![index + 1] 
                    : null;
                  const progressChange = prevUpdate ? update.progress - prevUpdate.progress : null;

                  return (
                    <div key={update.id} className="relative">
                      <div className="flex gap-3 sm:gap-4">
                        {/* Timeline Line */}
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 sm:border-4 border-white shadow-md flex items-center justify-center ${
                            index === 0 ? 'bg-gradient-to-br from-teal-500 to-purple-500' :
                            update.progress >= 75 ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                            update.progress >= 50 ? 'bg-gradient-to-br from-teal-500 to-cyan-500' :
                            update.progress >= 25 ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                            'bg-gradient-to-br from-blue-500 to-indigo-500'
                          }`}>
                            <TrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          {index < selectedVisionForHistory.progressHistory!.length - 1 && (
                            <div className="w-0.5 h-full min-h-[50px] sm:min-h-[60px] bg-gradient-to-b from-teal-200 to-purple-200 mt-2" />
                          )}
                        </div>

                        {/* Content Card */}
                        <div className="flex-1 bg-white rounded-lg sm:rounded-xl border-2 border-gray-100 p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0">
                          {/* Header */}
                          <div className="flex flex-col gap-2 sm:gap-3 mb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <span className="text-xl sm:text-2xl font-bold text-purple-600">{update.progress}%</span>
                                <Badge className={`text-xs font-semibold px-2 sm:px-2.5 py-1 ${
                                  update.progress === 0 ? 'bg-gray-100 text-gray-700' :
                                  update.progress > 0 && update.progress < 25 ? 'bg-blue-100 text-blue-700' :
                                  update.progress >= 25 && update.progress < 50 ? 'bg-purple-100 text-purple-700' :
                                  update.progress >= 50 && update.progress < 75 ? 'bg-teal-100 text-teal-700' :
                                  update.progress >= 75 && update.progress < 100 ? 'bg-amber-100 text-amber-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {update.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500 flex-wrap">
                                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                <span className="whitespace-nowrap">{formatDateTime(updateDate)}</span>
                                {update.savedToJournal && (
                                  <>
                                    <span>•</span>
                                    <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-teal-600 flex-shrink-0" />
                                    <span className="text-teal-600 font-medium">Journal</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Progress Change Indicator */}
                            {progressChange !== null && progressChange !== 0 && (
                              <div className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg ${
                                progressChange > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                              }`}>
                                <TrendingUpIcon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${progressChange < 0 ? 'rotate-180' : ''} ${
                                  progressChange > 0 ? 'text-green-600' : 'text-red-600'
                                }`} />
                                <span className={`text-xs sm:text-sm font-semibold ${
                                  progressChange > 0 ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {progressChange > 0 ? '+' : ''}{progressChange}% from previous
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Update Text */}
                          {editingProgressUpdate?.visionId === selectedVisionForHistory.id && editingProgressUpdate?.updateId === update.id ? (
                            <div className="space-y-3">
                              <Textarea
                                value={editProgressText}
                                onChange={(e) => setEditProgressText(e.target.value)}
                                className="min-h-[100px] text-sm border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg resize-none"
                                placeholder="Edit your progress update..."
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveProgressUpdate(selectedVisionForHistory.id, update.id)}
                                  className="bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:shadow-md text-xs flex-1 sm:flex-initial"
                                >
                                  <Save className="h-3.5 w-3.5 mr-1.5" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEditProgressUpdate}
                                  className="text-xs border-gray-300 flex-1 sm:flex-initial"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 group relative">
                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                {update.updateText}
                              </p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditProgressUpdate(selectedVisionForHistory.id, update.id, update.updateText)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 sm:opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 hover:bg-purple-50 text-purple-600"
                                title="Edit update"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* UPDATE VISION PROGRESS MODAL */}
      <Dialog open={showProgressModal} onOpenChange={(open) => {
        if (!open) {
          setShowProgressModal(false);
          setSelectedVisionForProgress(null);
          setProgressFormData({
            progress: 0,
            updateText: "",
            saveToJournal: false,
          });
          setShowSuggestions(false);
          setInitialProgress(0);
        }
      }}>
        <DialogContent className={`${glassClass} rounded-2xl sm:rounded-3xl max-w-2xl mx-auto max-h-[90vh] sm:max-h-[90vh] overflow-y-auto p-0 mx-2 sm:mx-4 md:mx-auto`} style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 p-4 sm:p-5 md:p-6 rounded-t-2xl sm:rounded-t-3xl sticky top-0 z-10">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-2 ring-white/30 flex-shrink-0">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 leading-tight">
                    Update Vision Progress
                  </DialogTitle>
                  <DialogDescription className="text-white/90 text-xs sm:text-sm md:text-base font-medium truncate">
                    {selectedVisionForProgress && `Track your progress on "${selectedVisionForProgress.title}"`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleProgressSubmit(); }} className="space-y-4 sm:space-y-5 md:space-y-6 p-4 sm:p-5 md:p-6">
            {/* Progress Section - Card Style */}
            <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-purple-100/50 p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 shadow-sm">
              <Label className="text-sm sm:text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
                <span className="text-sm sm:text-base md:text-lg">How close are you to this vision?</span>
              </Label>
              
              {/* Progress Display with Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white font-bold text-base sm:text-lg md:text-xl shadow-md ${
                    progressFormData.progress === 0 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    progressFormData.progress > 0 && progressFormData.progress < 25 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    progressFormData.progress >= 25 && progressFormData.progress < 50 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                    progressFormData.progress >= 50 && progressFormData.progress < 75 ? 'bg-gradient-to-r from-teal-500 to-teal-600' :
                    progressFormData.progress >= 75 && progressFormData.progress < 100 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                    'bg-gradient-to-r from-green-500 to-green-600'
                  }`}>
                    {progressFormData.progress}%
                  </div>
                  {progressFormData.progress !== initialProgress && (
                    <div className={`px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm font-semibold ${
                      progressFormData.progress > initialProgress ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {progressFormData.progress > initialProgress ? '+' : ''}{progressFormData.progress - initialProgress}%
                    </div>
                  )}
                </div>
                <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border-2 ${
                  progressFormData.progress === 0 ? 'bg-red-50 border-red-300' :
                  progressFormData.progress > 0 && progressFormData.progress < 25 ? 'bg-blue-50 border-blue-300' :
                  progressFormData.progress >= 25 && progressFormData.progress < 50 ? 'bg-purple-50 border-purple-300' :
                  progressFormData.progress >= 50 && progressFormData.progress < 75 ? 'bg-teal-50 border-teal-300' :
                  progressFormData.progress >= 75 && progressFormData.progress < 100 ? 'bg-amber-50 border-amber-300' :
                  'bg-green-50 border-green-300'
                }`}>
                  {progressFormData.progress === 0 && <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />}
                  {progressFormData.progress > 0 && progressFormData.progress < 25 && <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />}
                  {progressFormData.progress >= 25 && progressFormData.progress < 50 && <TrendingUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />}
                  {progressFormData.progress >= 50 && progressFormData.progress < 75 && <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />}
                  {progressFormData.progress >= 75 && progressFormData.progress < 100 && <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />}
                  {progressFormData.progress === 100 && <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />}
                  <span className={`text-xs sm:text-sm font-bold ${
                    progressFormData.progress === 0 ? 'text-red-600' :
                    progressFormData.progress > 0 && progressFormData.progress < 25 ? 'text-blue-600' :
                    progressFormData.progress >= 25 && progressFormData.progress < 50 ? 'text-purple-600' :
                    progressFormData.progress >= 50 && progressFormData.progress < 75 ? 'text-teal-600' :
                    progressFormData.progress >= 75 && progressFormData.progress < 100 ? 'text-amber-600' :
                    'text-green-600'
                  }`}>
                    {getProgressStatus(progressFormData.progress)}
                  </span>
                </div>
              </div>
              
              {/* Progress Slider */}
              <div className="space-y-4 pt-2">
                <Slider
                  value={[progressFormData.progress]}
                  onValueChange={(value) => setProgressFormData({ ...progressFormData, progress: value[0] })}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                
                {/* Percentage Markers */}
                <div className="flex items-center justify-between px-1">
                  {[0, 25, 50, 75, 100].map((value) => (
                    <div key={value} className="flex flex-col items-center gap-1">
                      <div className={`w-1 h-4 rounded-full ${progressFormData.progress >= value ? 'bg-purple-600' : 'bg-gray-300'}`} />
                      <span className="text-xs font-semibold text-gray-600">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* What's Happening Section - Card Style */}
            <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-purple-100/50 p-4 sm:p-5 md:p-6 space-y-3 shadow-sm">
              <Label htmlFor="update-text" className="text-sm sm:text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
                <span className="text-sm sm:text-base md:text-lg">What's happening with this vision?</span>
              </Label>
              <div className="relative">
                <Textarea 
                  id="update-text"
                  value={progressFormData.updateText} 
                  onChange={e => {
                    const value = e.target.value.slice(0, MAX_CHARACTERS);
                    setProgressFormData({ ...progressFormData, updateText: value });
                  }} 
                  placeholder="Share your thoughts, progress, challenges, or insights about this vision..."
                  className="min-h-[140px] text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl transition-all resize-none pr-16"
                />
                <div className="absolute bottom-3 right-3 text-xs font-medium text-gray-400">
                  <span className={progressFormData.updateText.length > MAX_CHARACTERS * 0.9 ? 'text-amber-600' : ''}>
                    {progressFormData.updateText.length}/{MAX_CHARACTERS} characters
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Suggestions Button */}
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto"
              >
                <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
                {showSuggestions ? "Hide" : "Show"} Smart Suggestions
              </Button>
            </div>

            {/* Smart Suggestions Content */}
            {showSuggestions && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Smart Suggestions</h3>
                </div>
                {getSmartSuggestions(progressFormData.progress).map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-white/60 border border-amber-200/30">
                    <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Save to Journal Checkbox - Card Style */}
            <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-purple-100/50 p-4 sm:p-5 md:p-6 shadow-sm">
              <div className="flex items-start gap-2 sm:gap-3">
                <Checkbox
                  id="save-to-journal"
                  checked={progressFormData.saveToJournal}
                  onCheckedChange={(checked) => setProgressFormData({ ...progressFormData, saveToJournal: checked as boolean })}
                  className="mt-0.5 flex-shrink-0"
                />
                <Label 
                  htmlFor="save-to-journal" 
                  className="flex-1 cursor-pointer text-xs sm:text-sm md:text-base font-medium text-gray-700 leading-relaxed"
                >
                  Also save to Journal for reflection
                  <span className="block text-xs text-gray-500 mt-1 sm:mt-1.5 font-normal">
                    This will create a journal entry with your progress update for future reflection
                  </span>
                </Label>
              </div>
            </div>

            {/* Dialog Footer */}
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t-2 border-gray-100 mt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setShowProgressModal(false);
                  setSelectedVisionForProgress(null);
                  setProgressFormData({
                    progress: 0,
                    updateText: "",
                    saveToJournal: false,
                  });
                  setShowSuggestions(false);
                  setInitialProgress(0);
                }}
                className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!canSave}
                className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 text-white hover:from-purple-700 hover:via-purple-600 hover:to-teal-600 shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Save Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mobile FAB */}
      {isMobile && (
        <button 
          onClick={openCreateModal}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-teal-500 text-white shadow-2xl hover:shadow-xl flex items-center justify-center z-40 transition-all duration-300 hover:scale-110"
          aria-label="Create new vision"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
