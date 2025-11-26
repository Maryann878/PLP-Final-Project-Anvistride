import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { getGlobalToast } from "@/lib/toast";
import {
  Search,
  Edit3,
  Trash2,
  PlusCircle,
  CheckCircle,
  Plus,
  X,
  Target,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import type { GoalType, TaskType } from "@/types";

const statusOptions = ["Not Started", "In Progress", "Completed"] as const;

const badgeVariants = {
  "Not Started": "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

interface FormData {
  title: string;
  description?: string;
  deadline?: string;
  status: typeof statusOptions[number];
  progress: number;
  linkedVisionId?: string;
}

export default function GoalsPage() {
  const {
    goals,
    visions,
    tasks,
    addGoal,
    updateGoal,
    deleteGoal,
    addTask,
    updateTask,
    deleteTask,
  } = useAppContext();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    deadline: "",
    status: "Not Started",
    progress: 0,
    linkedVisionId: undefined,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | "all">("all");
  const [selectedVision, setSelectedVision] = useState<string | "all">("all");
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);
  const [showQuickTaskInput, setShowQuickTaskInput] = useState<string | null>(null);
  const [quickTaskTitle, setQuickTaskTitle] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Auto-link to vision from URL params
  useEffect(() => {
    const visionIdParam = searchParams.get("visionId");
    if (visionIdParam) {
      setFormData((prev) => ({ ...prev, linkedVisionId: visionIdParam }));
      setShowModal(true);
    }
  }, [searchParams]);

  const filteredGoals = useMemo(() => {
    let filtered = goals;
    if (debouncedSearch) {
      filtered = filtered.filter(
        (g) =>
          g.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          g.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    if (selectedStatus !== "all")
      filtered = filtered.filter((g) => g.status === selectedStatus);
    if (selectedVision !== "all")
      filtered = filtered.filter(
        (g) => g.linkedVisionId?.toString() === selectedVision
      );
    return filtered;
  }, [goals, debouncedSearch, selectedStatus, selectedVision]);

  const getTasksForGoal = (goalId: string) =>
    tasks.filter((t) => t.goalId?.toString() === goalId);

  const openCreateModal = () => {
    setEditingGoal(null);
    setFormData({
      title: "",
      description: "",
      deadline: "",
      status: "Not Started",
      progress: 0,
    });
    setShowModal(true);
  };

  const openEditModal = (goal: GoalType) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      deadline: goal.deadline,
      status: goal.status,
      progress: goal.progress,
      linkedVisionId: goal.linkedVisionId?.toString(),
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGoal(null);
    setFormData({
      title: "",
      description: "",
      deadline: "",
      status: "Not Started",
      progress: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    let finalProgress = formData.progress;
    let completedAt: string | undefined = undefined;

    if (formData.status === "Completed") finalProgress = 100;
    else if (formData.status === "Not Started") finalProgress = 0;
    else if (formData.status === "In Progress" && finalProgress === 0)
      finalProgress = 1;

    if (formData.status === "Completed") completedAt = new Date().toISOString();

    const submitData: Partial<GoalType> = {
      ...formData,
      progress: finalProgress,
      completedAt,
      linkedVisionId:
        formData.linkedVisionId && formData.linkedVisionId !== "all"
          ? formData.linkedVisionId
          : undefined,
      updatedAt: new Date().toISOString(),
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, submitData);
    } else {
      const newGoal: GoalType = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        status: formData.status,
        progress: finalProgress,
        createdAt: new Date().toISOString(),
        completedAt,
        linkedVisionId: submitData.linkedVisionId,
      };
      addGoal(newGoal);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    deleteGoal(id);
    const toast = getGlobalToast();
    if (toast) {
      toast({
        title: "Goal deleted",
        description: goal?.title ? `"${goal.title}" has been deleted.` : "Goal has been deleted.",
        variant: "default",
      });
    }
  };

  const handleTaskToggle = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "Done" ? "Todo" : "Done";
    const completedAt = newStatus === "Done" ? new Date().toISOString() : undefined;

    updateTask(taskId, { status: newStatus, completedAt });

    if (!task.goalId) return;
    const goalTasks = tasks.filter((t) => t.goalId === task.goalId);
    const completedCount = goalTasks.filter((t) =>
      t.id === taskId ? newStatus === "Done" : t.status === "Done"
    ).length;
    const totalCount = goalTasks.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const allCompleted = completedCount === totalCount && totalCount > 0;

    updateGoal(task.goalId, {
      progress,
      status: allCompleted
        ? "Completed"
        : progress > 0
        ? "In Progress"
        : "Not Started",
      completedAt: allCompleted ? new Date().toISOString() : undefined,
    });
  };

  const handleQuickTaskSubmit = (goalId: string) => {
    if (!quickTaskTitle.trim()) return;

    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const newTask: TaskType = {
      id: Date.now().toString(),
      title: quickTaskTitle.trim(),
      description: "",
      priority: "Medium",
      status: "Todo",
      goalId: goal.id,
      visionId: goal.linkedVisionId,
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);
    setQuickTaskTitle("");
    setShowQuickTaskInput(null);
  };

  const toggleDesc = (id: string) =>
    setExpandedDesc(expandedDesc === id ? null : id);

  const toggleTaskExpand = (goalId: string) =>
    setExpandedTasks((prev) => ({ ...prev, [goalId]: !prev[goalId] }));

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 p-3 sm:p-4 md:p-6">
      {/* HEADER */}
      <Card className={`${glassClass} border-teal-200/50`}>
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5 md:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 via-teal-400 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-teal-500/30 ring-2 ring-white/20">
                <Target className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-1 sm:mb-2 tracking-tight leading-tight">
                  Your Goals
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Set measurable objectives to achieve your visions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Statistics - Compact */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-teal-50 to-purple-50 border border-teal-200/50">
          <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />
          <span className="text-base sm:text-lg font-bold text-gray-900">{goals.length}</span>
          <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Total Goals</span>
        </div>
        <Button 
          onClick={openCreateModal} 
          className="hidden sm:flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <PlusCircle className="h-5 w-5" /> 
          Add Goal
        </Button>
      </div>

      {/* Filters - Only show when there are goals */}
      {goals.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={selectedStatus}
            onValueChange={(v) => setSelectedStatus(v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedVision}
            onValueChange={(v) => setSelectedVision(v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by vision" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visions</SelectItem>
              {visions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Goals List or Empty State */}
      {filteredGoals.length === 0 && goals.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-100 to-purple-100 flex items-center justify-center">
              <Target className="h-12 w-12 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Goals Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Set measurable objectives to break down your visions into actionable steps.
            </p>
            <Button onClick={openCreateModal} className="bg-gradient-to-r from-teal-600 to-purple-500 text-white px-8 py-3 rounded-xl shadow-lg">
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : filteredGoals.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Goals Match Your Search</h3>
            <p className="text-gray-600">Try adjusting your search or clear filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => {
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

          return (
            <Card key={goal.id} className={`${glassClass} hover:shadow-lg transition-all duration-300 border border-gray-200/80 overflow-hidden flex flex-col`}>
              {/* Header Section */}
              <CardHeader className="pb-3 px-5 pt-5">
                <div className="flex justify-between items-start gap-2 sm:gap-3">
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex-1 leading-tight pr-2">{goal.title}</CardTitle>
                  <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => openEditModal(goal)}
                      className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                      title="Edit Goal"
                    >
                      <Edit3 size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDelete(goal.id)}
                      className="h-8 w-8 p-0 hover:bg-red-50 text-red-600 hover:text-red-700"
                      title="Delete Goal"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge className={`${badgeVariants[goal.status]} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                    {goal.status}
                  </Badge>
                  {goal.deadline && (
                    <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 rounded-full border-orange-200 text-orange-700 bg-orange-50">
                      Due: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              {/* Description */}
              <CardContent className="px-5 pt-0 pb-4 flex-1">
                {goal.description && (
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {expandedDesc === goal.id ? goal.description : goal.description.slice(0, 100)}
                    {goal.description.length > 100 && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={() => toggleDesc(goal.id)} 
                        className="h-auto p-0 ml-1 text-teal-600 font-medium text-sm"
                      >
                        {expandedDesc === goal.id ? "Show Less" : "...Read More"}
                      </Button>
                    )}
                  </p>
                )}
              </CardContent>

              {/* Progress Section */}
              <div className="px-5 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Progress</span>
                  <span className="text-sm font-bold text-teal-600">{goal.progress}%</span>
                </div>
                <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 h-full rounded-full bg-gradient-to-r from-teal-600 via-teal-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 mx-5"></div>

              {/* Date at Bottom */}
              <div className="px-5 pt-3 pb-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-medium">{formatDate(goal.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <CardFooter className="px-5 pt-2 pb-5 flex flex-col gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => toggleTaskExpand(goal.id)}
                  className="w-full text-xs font-medium border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-300 h-9"
                >
                  {expandedTasks[goal.id] ? "Hide Tasks" : "Show Tasks"}
                  <ChevronDown className={`h-3.5 w-3.5 ml-1.5 transition-transform ${expandedTasks[goal.id] ? 'rotate-180' : ''}`} />
                </Button>
                {goal.linkedVisionId && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full text-xs font-medium border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 h-9"
                  >
                    <Target className="h-3.5 w-3.5 mr-1.5" />
                    View Vision
                  </Button>
                )}
              </CardFooter>

              {/* Expanded Tasks */}
              {expandedTasks[goal.id] && (
                <div className="px-5 pb-5 pt-0 border-t border-gray-200 space-y-2 mt-0">
                  {getTasksForGoal(goal.id).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-teal-50/50 border border-teal-100"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTaskToggle(task.id)}
                        className={`flex-1 text-left text-sm font-medium ${
                          task.status === "Done"
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {task.title}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id, { 
                          parentId: goal.id, 
                          parentType: 'goal',
                          originalLocation: `goals/${goal.id}/tasks`
                        })}
                        className="h-7 w-7 p-0 hover:bg-red-50 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}

                  {showQuickTaskInput === goal.id ? (
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={quickTaskTitle}
                        onChange={(e) => setQuickTaskTitle(e.target.value)}
                        placeholder="Task title"
                        className="h-9 text-sm"
                      />
                      <Button onClick={() => handleQuickTaskSubmit(goal.id)} size="sm" className="h-9">
                        <CheckCircle size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowQuickTaskInput(null)}
                        size="sm"
                        className="h-9"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQuickTaskInput(goal.id)}
                      className="w-full text-xs font-medium border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-300 h-9"
                    >
                      <Plus size={14} className="mr-1.5" />
                      Add Task
                    </Button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={(open) => {
        if (!open) {
          handleCloseModal();
        }
      }}>
        <DialogContent className="backdrop-blur-xl bg-white/95 border-2 border-teal-200/60 shadow-2xl shadow-teal-900/20 rounded-3xl max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-purple-500 p-6 rounded-t-3xl">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-2 ring-white/30">
                  <Target className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-3xl font-bold text-white mb-1">
                    {editingGoal ? "Edit Goal" : "Create New Goal"}
                  </DialogTitle>
                  <DialogDescription className="text-white/90 text-base font-medium">
                    {editingGoal 
                      ? "Update your goal details and track your progress toward achieving it." 
                      : "Set a specific, measurable goal that aligns with your vision. Break it down into actionable steps."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-8">
            <div className="space-y-2.5">
              <Label htmlFor="goal-title" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-600 to-purple-500"></span>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="goal-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Complete Full Stack Developer Course"
                className="h-12 text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl transition-all"
                required
              />
              <p className="text-xs text-gray-500 font-medium">Give your goal a clear and specific title</p>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="goal-description" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-600 to-purple-500"></span>
                Description
              </Label>
              <Textarea
                id="goal-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe what you want to achieve and why it matters..."
                className="min-h-[120px] text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl transition-all resize-none"
              />
              <p className="text-xs text-gray-500 font-medium">Provide details about your goal (optional)</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="goal-status" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-600 to-purple-500"></span>
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) =>
                    setFormData({ ...formData, status: v as FormData["status"] })
                  }
                >
                  <SelectTrigger id="goal-status" className="h-12 text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="goal-deadline" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-600 to-purple-500"></span>
                  Deadline
                </Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="h-12 text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
                />
                <p className="text-xs text-gray-500 font-medium">Set a target completion date (optional)</p>
              </div>
            </div>
            {visions.length > 0 && (
              <div className="space-y-2.5">
                <Label htmlFor="goal-vision" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-600 to-purple-500"></span>
                  Link to Vision
                </Label>
                <Select
                  value={formData.linkedVisionId || "none"}
                  onValueChange={(v) =>
                    setFormData({ ...formData, linkedVisionId: v === "none" ? undefined : v })
                  }
                >
                  <SelectTrigger id="goal-vision" className="h-12 text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl">
                    <SelectValue placeholder="Select a vision (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Vision</SelectItem>
                    {visions.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 font-medium">Connect this goal to a vision (optional)</p>
              </div>
            )}
            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-100 mt-6">
              <Button 
                type="button"
                variant="outline" 
                onClick={handleCloseModal}
                className="w-full sm:w-auto h-12 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="w-full sm:w-auto h-12 text-base font-bold bg-gradient-to-r from-teal-600 via-teal-500 to-purple-500 text-white hover:from-teal-700 hover:via-teal-600 hover:to-purple-600 shadow-lg shadow-teal-600/30 hover:shadow-xl hover:shadow-teal-600/40 transition-all duration-300 rounded-xl"
              >
                {editingGoal ? "Update Goal" : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mobile FAB */}
      {isMobile && (
        <button 
          onClick={openCreateModal}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-teal-600 to-purple-500 text-white shadow-2xl hover:shadow-xl flex items-center justify-center z-40 transition-all duration-300 hover:scale-110"
          aria-label="Add new goal"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
