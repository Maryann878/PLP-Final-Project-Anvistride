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
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <Card className={`${glassClass} border-teal-200/50`}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-400 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-teal-500/30 ring-2 ring-white/20">
                <Target className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 via-teal-500 to-purple-500 bg-clip-text text-transparent mb-1">
                  Your Goals
                </h1>
                <p className="text-gray-600 text-sm font-medium">Set measurable objectives to achieve your visions</p>
              </div>
            </div>
            <Button 
              onClick={openCreateModal} 
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusCircle className="h-5 w-5" /> 
              Add Goal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
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

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.map((goal) => (
          <Card key={goal.id} className={`${glassClass} hover:shadow-xl transition-all duration-300`}>
            <CardHeader className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">{goal.title}</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEditModal(goal)}>
                  <Edit3 size={16} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(goal.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              {goal.description && (
                <p className="text-sm">
                  {expandedDesc === goal.id
                    ? goal.description
                    : goal.description.length > 100
                    ? `${goal.description.slice(0, 100)}...`
                    : goal.description}
                  {goal.description.length > 100 && (
                    <Button variant="link" size="sm" onClick={() => toggleDesc(goal.id)}>
                      {expandedDesc === goal.id ? "Show Less" : "Read More"}
                    </Button>
                  )}
                </p>
              )}

              <Badge className={badgeVariants[goal.status]}>{goal.status}</Badge>

              <div className="flex items-center gap-2">
                <span className="text-sm">Progress:</span>
                <Slider
                  value={[goal.progress]}
                  max={100}
                  step={1}
                  onValueChange={([val]) =>
                    updateGoal(goal.id, { progress: val })
                  }
                  className="flex-1"
                />
                <span className="text-sm">{goal.progress}%</span>
              </div>

              <div className="mt-2">
                <Button
                  variant="link"
                  size="sm"
                  className="mb-1"
                  onClick={() => toggleTaskExpand(goal.id)}
                >
                  {expandedTasks[goal.id] ? "Hide Tasks" : "Show Tasks"}
                </Button>

                {expandedTasks[goal.id] && (
                  <div className="space-y-1">
                    {getTasksForGoal(goal.id).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTaskToggle(task.id)}
                          className={`flex-1 text-left ${
                            task.status === "Done"
                              ? "line-through text-gray-400"
                              : ""
                          }`}
                        >
                          {task.title}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
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
                        />
                        <Button onClick={() => handleQuickTaskSubmit(goal.id)}>
                          <CheckCircle size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setShowQuickTaskInput(null)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setShowQuickTaskInput(goal.id)}
                      >
                        + Add Task
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
    </div>
  );
}
