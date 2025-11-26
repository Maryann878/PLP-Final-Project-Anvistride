import React, { useState, useMemo, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { getGlobalToast } from "@/lib/toast";
import {
  Search,
  Filter,
  Clock,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
  CheckSquare,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import type { TaskType } from "@/types";

const statusOptions = ["Todo", "In Progress", "Done"] as const;
const priorityOptions = ["Low", "Medium", "High"] as const;

const badgeVariants = {
  status: {
    Todo: "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Done: "bg-green-100 text-green-700",
  },
  priority: {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
  },
};

interface FormData {
  title: string;
  description?: string;
  priority: typeof priorityOptions[number];
  status: typeof statusOptions[number];
  goalId?: string;
  visionId?: string;
  dueDate?: string;
}

export default function TasksPage() {
  const { tasks, goals, visions, addTask, updateTask, deleteTask, toggleTaskStatus } =
    useAppContext();

  const [showModal, setShowModal] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddTitle, setQuickAddTitle] = useState("");
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    priority: "Medium",
    status: "Todo",
    goalId: undefined,
    visionId: undefined,
    dueDate: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedGoal, setSelectedGoal] = useState<string>("all");
  const [taskTypeFilter, setTaskTypeFilter] = useState<string>("all"); // "all", "standalone", "goal-linked"
  const [filterDate, setFilterDate] = useState("");
  const [showOptionsPanel, setShowOptionsPanel] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate task counts
  const taskCounts = useMemo(() => {
    const standalone = tasks.filter(t => !t.goalId && !t.visionId).length;
    const goalLinked = tasks.filter(t => t.goalId).length;
    const visionLinked = tasks.filter(t => t.visionId && !t.goalId).length;
    return {
      all: tasks.length,
      standalone,
      goalLinked,
      visionLinked,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Task type filter
    if (taskTypeFilter === "standalone") {
      filtered = filtered.filter(t => !t.goalId && !t.visionId);
    } else if (taskTypeFilter === "goal-linked") {
      filtered = filtered.filter(t => t.goalId);
    }

    if (debouncedSearch) {
      filtered = filtered.filter(
        (t) =>
          t.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          t.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (selectedStatus !== "all") filtered = filtered.filter((t) => t.status === selectedStatus);
    if (selectedPriority !== "all") filtered = filtered.filter((t) => t.priority === selectedPriority);
    if (selectedGoal !== "all") filtered = filtered.filter((t) => t.goalId === selectedGoal);
    if (filterDate) filtered = filtered.filter(
      (t) => t.dueDate && new Date(t.dueDate).toISOString().split("T")[0] === filterDate
    );

    return filtered;
  }, [tasks, taskTypeFilter, debouncedSearch, selectedStatus, selectedPriority, selectedGoal, filterDate]);

  const openCreateModal = () => {
    // Open quick add modal first
    setQuickAddTitle("");
    setShowQuickAddModal(true);
  };

  const openAdvancedModal = () => {
    // Close quick add and open full modal
    setShowQuickAddModal(false);
    setEditingTask(null);
    setFormData({
      title: quickAddTitle, // Pre-fill with quick add title if any
      description: "",
      priority: "Medium",
      status: "Todo",
      goalId: undefined,
      visionId: undefined,
      dueDate: "",
    });
    setShowModal(true);
  };

  const handleQuickAdd = () => {
    if (!quickAddTitle.trim()) return;

    const newTask: TaskType = {
      id: Date.now().toString(),
      title: quickAddTitle.trim(),
      description: "",
      priority: "Medium",
      status: "Todo",
      goalId: undefined,
      visionId: undefined,
      createdAt: new Date().toISOString(),
      dueDate: "",
    };
    addTask(newTask);
    
    // Show success toast
    const toast = getGlobalToast();
    if (toast) {
      toast({
        title: "Task added",
        description: `"${quickAddTitle.trim()}" has been added successfully.`,
        variant: "default",
      });
    }

    // Reset and close
    setQuickAddTitle("");
    setShowQuickAddModal(false);
  };

  const openEditModal = (task: TaskType) => {
    setEditingTask(task);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      goalId: task.goalId,
      visionId: task.visionId,
      dueDate: task.dueDate,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const submitData = {
      ...formData,
      goalId: formData.goalId || undefined,
      visionId: formData.visionId || undefined,
      updatedAt: new Date().toISOString(),
    };

    if (editingTask) {
      updateTask(editingTask.id, submitData);
    } else {
      const newTask: TaskType = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        goalId: submitData.goalId,
        visionId: submitData.visionId,
        createdAt: new Date().toISOString(),
        dueDate: formData.dueDate,
      };
      addTask(newTask);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    deleteTask(id);
    const toast = getGlobalToast();
    if (toast) {
      toast({
        title: "Task deleted",
        description: task?.title ? `"${task.title}" has been deleted.` : "Task has been deleted.",
        variant: "default",
      });
    }
  };

  const toggleDesc = (id: string) => {
    setExpandedDesc(expandedDesc === id ? null : id);
  };

  const getLinkedTitle = (id: string | undefined, list: any[]) => {
    if (!id) return "Unnamed";
    const item = list.find((x) => String(x.id) === String(id));
    return item?.title || "Unnamed";
  };

  const renderOptionsContent = () => {
    const activeFiltersCount = [
      taskTypeFilter !== "all",
      selectedStatus !== "all",
      selectedPriority !== "all",
      selectedGoal !== "all",
      filterDate !== "",
      debouncedSearch !== "",
    ].filter(Boolean).length;

    // Calculate filtered count for search results display
    const getFilteredCount = () => {
      let count = tasks;
      if (taskTypeFilter === "standalone") {
        count = count.filter(t => !t.goalId && !t.visionId);
      } else if (taskTypeFilter === "goal-linked") {
        count = count.filter(t => t.goalId);
      }
      if (debouncedSearch) {
        count = count.filter(
          (t) =>
            t.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            t.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }
      if (selectedStatus !== "all") count = count.filter((t) => t.status === selectedStatus);
      if (selectedPriority !== "all") count = count.filter((t) => t.priority === selectedPriority);
      if (selectedGoal !== "all") count = count.filter((t) => t.goalId === selectedGoal);
      if (filterDate) count = count.filter(
        (t) => t.dueDate && new Date(t.dueDate).toISOString().split("T")[0] === filterDate
      );
      return count.length;
    };

    return (
      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold text-gray-900">Search</Label>
            {debouncedSearch && (
              <span className="text-xs text-gray-500 font-medium">
                {getFilteredCount()} result{getFilteredCount() !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Task Type Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-900">Task Type</Label>
          <div className="space-y-2">
            <Button
              variant={taskTypeFilter === "all" ? "default" : "outline"}
              onClick={() => setTaskTypeFilter("all")}
              className="w-full justify-between"
            >
              <span>All Tasks</span>
              <Badge variant="secondary">{taskCounts.all}</Badge>
            </Button>
            <Button
              variant={taskTypeFilter === "standalone" ? "default" : "outline"}
              onClick={() => setTaskTypeFilter("standalone")}
              className="w-full justify-between"
            >
              <span>Standalone</span>
              <Badge variant="secondary">{taskCounts.standalone}</Badge>
            </Button>
            <Button
              variant={taskTypeFilter === "goal-linked" ? "default" : "outline"}
              onClick={() => setTaskTypeFilter("goal-linked")}
              className="w-full justify-between"
            >
              <span>Goal-Linked</span>
              <Badge variant="secondary">{taskCounts.goalLinked}</Badge>
            </Button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-900">Status</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-900">Priority</Label>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger>
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {priorityOptions.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Linked Goal Filter */}
        {goals.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-900">Linked Goal</Label>
            <Select value={selectedGoal} onValueChange={setSelectedGoal}>
              <SelectTrigger>
                <SelectValue placeholder="All Goals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Goals</SelectItem>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Date Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-900">Due Date</Label>
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              setTaskTypeFilter("all");
              setSelectedStatus("all");
              setSelectedPriority("all");
              setSelectedGoal("all");
              setFilterDate("");
              setSearchTerm("");
            }}
            className="w-full"
          >
            Clear All Filters ({activeFiltersCount})
          </Button>
        )}
      </div>
    );
  };

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <>
      {/* Main Content */}
      <div className={`p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 transition-all duration-300 ${showOptionsPanel ? 'md:mr-80' : ''}`}>
        {/* Header */}
        <Card className={`${glassClass} border-orange-200/50 rounded-xl sm:rounded-2xl`}>
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5 md:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/30 ring-2 ring-white/20">
                <Clock className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-1 sm:mb-2 tracking-tight leading-tight">
                  Your Tasks
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Manage daily actions with priorities and deadlines
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Statistics - Compact */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200/50">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600" />
            <span className="text-base sm:text-lg font-bold text-gray-900">{tasks.length}</span>
            <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Total Tasks</span>
          </div>
          {filteredTasks.length !== tasks.length && (
            <div className="text-sm text-gray-500">
              <span className="font-semibold text-orange-600">{filteredTasks.length}</span> shown
            </div>
          )}
        </div>
        {/* Desktop: Options and Create buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowOptionsPanel(!showOptionsPanel)}
            className="flex items-center gap-2"
            title="Filter & Search Options"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Options</span>
          </Button>
          <Button
            onClick={openCreateModal}
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-5 w-5" /> 
            Create Task
          </Button>
        </div>
        {/* Mobile: Options icon */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowOptionsPanel(!showOptionsPanel)}
          className="sm:hidden h-10 w-10"
          title="Filter & Search Options"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Task Cards */}
      {filteredTasks.length === 0 && tasks.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 sm:p-16 text-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-100 via-orange-50 to-purple-100 dark:from-orange-900/30 dark:to-purple-900/30 flex items-center justify-center shadow-lg shadow-orange-500/10 animate-pulse-slow">
              <Clock className="h-14 w-14 sm:h-16 sm:w-16 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Tasks Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Add tasks to break down your goals into daily actions and stay organized.
            </p>
            <Button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-orange-500 via-orange-400 to-purple-500 hover:from-orange-600 hover:via-orange-500 hover:to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Create Your First Task
            </Button>
          </CardContent>
        </Card>
      ) : filteredTasks.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Tasks Match Your Search</h3>
            <p className="text-gray-600">Try adjusting your search criteria or clear the filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const isExpanded = expandedDesc === task.id;
            const displayDesc =
              isExpanded || !task.description
                ? task.description
                : task.description.substring(0, 100) + (task.description.length > 100 ? "..." : "");

            const formatDate = (dateString: string) => {
              const date = new Date(dateString);
              const now = new Date();
              const diffTime = Math.abs(now.getTime() - date.getTime());
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays === 0) return "Today";
              if (diffDays === 1) return "Yesterday";
              if (diffDays < 7) return `${diffDays}d ago`;
              if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
            };

            const isCompleted = task.status === "Done";
            
            return (
              <Card 
                key={task.id} 
                className={`${glassClass} hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 overflow-hidden flex flex-row group ${
                  isCompleted ? 'opacity-75' : ''
                }`}
              >
                {/* Left Side - Checkbox */}
                <div className="flex items-start p-4 pr-3">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={(checked) => {
                      toggleTaskStatus(task.id, checked ? "Done" : "Todo");
                    }}
                    className="mt-1"
                  />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 py-4 pr-4">
                  {/* Title and Actions */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base font-semibold text-gray-900 leading-snug ${
                        isCompleted ? 'line-through text-gray-500' : ''
                      }`}>
                        {task.title || "Untitled Task"}
                      </h3>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => openEditModal(task)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-transparent hover:border-blue-200"
                        title="Edit Task"
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(task.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 text-red-600 hover:text-red-700 border border-transparent hover:border-red-200"
                        title="Delete Task"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p className={`text-sm text-gray-600 leading-relaxed mb-3 ${
                      isCompleted ? 'line-through text-gray-400' : ''
                    }`}>
                      {displayDesc}
                      {task.description.length > 100 && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => toggleDesc(task.id)} 
                          className="h-auto p-0 ml-1 text-orange-600 font-medium text-sm"
                        >
                          {isExpanded ? "Show Less" : "...Read More"}
                        </Button>
                      )}
                    </p>
                  )}

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className={`${badgeVariants.status[task.status]} text-xs font-semibold px-2 py-0.5 rounded-full`}>
                      {task.status}
                    </Badge>
                    <Badge className={`${badgeVariants.priority[task.priority]} text-xs font-semibold px-2 py-0.5 rounded-full`}>
                      {task.priority}
                    </Badge>
                    {task.dueDate && (
                      <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 rounded-full border-orange-200 text-orange-700 bg-orange-50">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Badge>
                    )}
                    {(task.goalId || task.visionId) && (
                      <>
                        {task.goalId && (
                          <span className="text-xs px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-700">
                            Goal
                          </span>
                        )}
                        {task.visionId && (
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700">
                            Vision
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Date at Bottom */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="font-medium">{formatDate(task.createdAt)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={(open) => {
        if (!open) {
          setShowModal(false);
          setEditingTask(null);
          setFormData({
            title: "",
            description: "",
            priority: "Medium",
            status: "Todo",
            goalId: undefined,
            visionId: undefined,
            dueDate: "",
          });
        }
      }}>
        <DialogContent className="backdrop-blur-xl bg-white/95 border-2 border-orange-200/60 shadow-2xl shadow-orange-900/20 rounded-3xl max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-purple-500 p-6 rounded-t-3xl">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-2 ring-white/30">
                  <Clock className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-3xl font-bold text-white mb-1">
                    {editingTask ? "Edit Task" : "Create New Task"}
                  </DialogTitle>
                  <DialogDescription className="text-white/90 text-base font-medium">
                    {editingTask 
                      ? "Update your task details and keep track of your progress." 
                      : "Create a specific task to move closer to your goals. Set priorities and deadlines to stay organized."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-8">
            <div className="space-y-2.5">
              <Label htmlFor="task-title" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-600 to-purple-500"></span>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="task-title"
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                placeholder="e.g., Complete React tutorial chapter 3"
                className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all"
                required 
              />
              <p className="text-xs text-gray-500 font-medium">Give your task a clear and actionable title</p>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="task-description" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-600 to-purple-500"></span>
                Description
              </Label>
              <Textarea 
                id="task-description"
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Add any additional details or notes about this task..."
                className="min-h-[120px] text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all resize-none"
              />
              <p className="text-xs text-gray-500 font-medium">Provide additional context (optional)</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="task-priority" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-600 to-purple-500"></span>
                  Priority
                </Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as typeof priorityOptions[number] })}>
                  <SelectTrigger id="task-priority" className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="task-status" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-600 to-purple-500"></span>
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as typeof statusOptions[number] })}>
                  <SelectTrigger id="task-status" className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {goals.length > 0 && (
                <div className="space-y-2.5">
                  <Label htmlFor="task-goal" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-600 to-purple-500"></span>
                    Link to Goal
                  </Label>
                  <Select value={formData.goalId || "none"} onValueChange={(v) => setFormData({ ...formData, goalId: v === "none" ? undefined : v })}>
                    <SelectTrigger id="task-goal" className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl">
                      <SelectValue placeholder="Select a goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Goal</SelectItem>
                      {goals.map((g) => <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 font-medium">Connect to a goal (optional)</p>
                </div>
              )}
              {visions.length > 0 && (
                <div className="space-y-2.5">
                  <Label htmlFor="task-vision" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-600 to-purple-500"></span>
                    Link to Vision
                  </Label>
                  <Select value={formData.visionId || "none"} onValueChange={(v) => setFormData({ ...formData, visionId: v === "none" ? undefined : v })}>
                    <SelectTrigger id="task-vision" className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl">
                      <SelectValue placeholder="Select a vision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Vision</SelectItem>
                      {visions.map((v) => <SelectItem key={v.id} value={v.id}>{v.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 font-medium">Connect to a vision (optional)</p>
                </div>
              )}
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="task-due-date" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-600 to-purple-500"></span>
                Due Date
              </Label>
              <Input 
                id="task-due-date"
                type="date" 
                value={formData.dueDate} 
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} 
                className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl"
              />
              <p className="text-xs text-gray-500 font-medium">Set a deadline for this task (optional)</p>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-100 mt-6">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setShowModal(false);
                  setEditingTask(null);
                  setFormData({
                    title: "",
                    description: "",
                    priority: "Medium",
                    status: "Todo",
                    goalId: undefined,
                    visionId: undefined,
                    dueDate: "",
                  });
                }}
                className="w-full sm:w-auto h-12 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto h-12 text-base font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-purple-500 text-white hover:from-orange-700 hover:via-orange-600 hover:to-purple-600 shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 transition-all duration-300 rounded-xl"
              >
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick Add Task Modal */}
      <Dialog open={showQuickAddModal} onOpenChange={(open) => {
        if (!open) {
          setShowQuickAddModal(false);
          setQuickAddTitle("");
        }
      }}>
        <DialogContent className="backdrop-blur-xl bg-white/95 border-2 border-orange-200/60 shadow-2xl shadow-orange-900/20 rounded-2xl sm:rounded-3xl max-w-md mx-auto p-0 gap-0">
          <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-purple-500 p-5 sm:p-6 rounded-t-2xl sm:rounded-t-3xl">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-2 ring-white/30">
                  <Plus className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl sm:text-3xl font-bold text-white">
                    Quick Add Task
                  </DialogTitle>
                  <DialogDescription className="text-white/90 text-sm sm:text-base font-medium mt-1">
                    Add a task quickly. You can edit it later for more details.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          <div className="p-5 sm:p-6 space-y-5">
            <div className="space-y-2">
              <Input
                placeholder="Enter task title..."
                value={quickAddTitle}
                onChange={(e) => setQuickAddTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && quickAddTitle.trim()) {
                    handleQuickAdd();
                  }
                }}
                className="h-12 text-base border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
                autoFocus
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleQuickAdd}
                disabled={!quickAddTitle.trim()}
                className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Task
              </Button>
              <Button
                onClick={openAdvancedModal}
                variant="outline"
                className="flex-1 h-12 text-base font-semibold border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 rounded-xl"
              >
                Advanced Options
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>

      {/* Options Sidebar (Desktop) / Modal (Mobile) - Outside blurred content */}
      {showOptionsPanel && (
        <>
          {/* Mobile Modal - Bottom Sheet Style */}
          <div className="md:hidden">
            <Dialog open={showOptionsPanel} onOpenChange={setShowOptionsPanel}>
              <DialogContent 
                className={`${glassClass} rounded-t-3xl rounded-b-none max-w-full w-full max-h-[70vh] overflow-hidden p-0 !fixed !bottom-0 !left-0 !right-0 !top-auto !translate-x-0 !translate-y-0 [&>button]:hidden`} 
                style={{ 
                  paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
                  transform: 'none',
                  left: 0,
                  right: 0,
                  top: 'auto',
                  bottom: 0
                }}
              >
                <div className="flex flex-col h-full max-h-[70vh]">
                  <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-purple-500 p-4 sm:p-5 rounded-t-2xl flex-shrink-0">
                    <DialogHeader className="text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-2 ring-white/30">
                            <SlidersHorizontal className="h-5 w-5" />
                          </div>
                          <DialogTitle className="text-xl font-bold text-white">
                            Filter & Search
                          </DialogTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowOptionsPanel(false)}
                          className="h-8 w-8 p-0 hover:bg-white/20 text-white hover:text-white"
                          title="Close"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </DialogHeader>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                    {renderOptionsContent()}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Desktop Sidebar - No overlay, content remains visible */}
          <div className="hidden md:block fixed right-0 top-0 h-screen w-80 bg-white/98 backdrop-blur-xl border-l-2 border-orange-200/60 shadow-2xl z-40">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-purple-500 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-2 ring-white/30">
                    <SlidersHorizontal className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Filter & Search
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOptionsPanel(false)}
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white hover:text-white"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Content - Scrollable */}
            <div className="overflow-y-auto overflow-x-hidden" style={{ height: 'calc(100vh - 80px)' }}>
              <div className="p-6 space-y-6">
                {renderOptionsContent()}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile FAB */}
      {isMobile && (
        <button 
          onClick={openCreateModal}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-orange-600 to-purple-500 text-white shadow-2xl hover:shadow-xl flex items-center justify-center z-40 transition-all duration-300 hover:scale-110"
          aria-label="Create new task"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}
    </>
  );
}
