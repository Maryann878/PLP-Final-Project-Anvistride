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
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (debouncedSearch) {
      filtered = filtered.filter(
        (t) =>
          t.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          t.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (selectedStatus !== "all") filtered = filtered.filter((t) => t.status === selectedStatus);
    if (selectedPriority !== "all") filtered = filtered.filter((t) => t.priority === selectedPriority);
    if (filterDate) filtered = filtered.filter(
      (t) => t.dueDate && new Date(t.dueDate).toISOString().split("T")[0] === filterDate
    );

    return filtered;
  }, [tasks, debouncedSearch, selectedStatus, selectedPriority, filterDate]);

  const openCreateModal = () => {
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
    setShowModal(true);
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

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <Card className={`${glassClass} border-amber-200/50`}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 ring-2 ring-white/20">
                <Clock className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-purple-500 bg-clip-text text-transparent mb-1">
                  Your Tasks
                </h1>
                <p className="text-gray-600 text-sm font-medium">Manage daily actions with priorities and deadlines</p>
              </div>
            </div>
            <Button
              onClick={openCreateModal}
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-5 w-5" /> 
              Create Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      {tasks.length > 0 && (
        <Card className={glassClass}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
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

                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Task Cards */}
      {filteredTasks.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center">
              <Clock className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Tasks Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add tasks to break down your goals into daily actions and stay organized.
            </p>
            <Button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-8 py-3 rounded-xl shadow-lg"
            >
              Create Your First Task
            </Button>
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

            return (
              <Card key={task.id} className={`${glassClass} hover:shadow-xl transition-all duration-300`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-gray-900">{task.title || "Untitled Task"}</CardTitle>
                  <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 gap-1">
                    <span>Priority: {task.priority}</span>
                    {task.dueDate && <span>{new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </CardHeader>

                {task.description && (
                  <CardContent className="space-y-2 text-sm text-gray-600 cursor-pointer" onClick={() => toggleDesc(task.id)}>
                    {displayDesc}
                    {task.description.length > 100 && (
                      <span className="text-purple-600 font-medium ml-1">{isExpanded ? " Show less" : " Show more"}</span>
                    )}
                  </CardContent>
                )}

                <CardContent className="flex gap-2 flex-wrap">
                  <Badge className={badgeVariants.status[task.status]}>{task.status}</Badge>
                  <Badge className={badgeVariants.priority[task.priority]}>{task.priority}</Badge>
                  {task.goalId && <span className="text-xs text-gray-500">Goal: {getLinkedTitle(task.goalId, goals)}</span>}
                  {task.visionId && <span className="text-xs text-gray-500">Vision: {getLinkedTitle(task.visionId, visions)}</span>}
                </CardContent>

                <CardFooter className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2">
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => toggleTaskStatus(task.id, task.status === "Done" ? "Todo" : "In Progress")}>
                      {task.status === "Done" ? "Undo" : "Toggle"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditModal(task)}>
                      <Edit3 className="h-3 w-3 mr-1" /> Edit
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(task.id)} className="text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </CardFooter>
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
        <DialogContent className="backdrop-blur-xl bg-white/95 border-2 border-amber-200/60 shadow-2xl shadow-amber-900/20 rounded-3xl max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-purple-500 p-6 rounded-t-3xl">
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
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 to-purple-500"></span>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="task-title"
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                placeholder="e.g., Complete React tutorial chapter 3"
                className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl transition-all"
                required 
              />
              <p className="text-xs text-gray-500 font-medium">Give your task a clear and actionable title</p>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="task-description" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 to-purple-500"></span>
                Description
              </Label>
              <Textarea 
                id="task-description"
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Add any additional details or notes about this task..."
                className="min-h-[120px] text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl transition-all resize-none"
              />
              <p className="text-xs text-gray-500 font-medium">Provide additional context (optional)</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="task-priority" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 to-purple-500"></span>
                  Priority
                </Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as typeof priorityOptions[number] })}>
                  <SelectTrigger id="task-priority" className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="task-status" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 to-purple-500"></span>
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as typeof statusOptions[number] })}>
                  <SelectTrigger id="task-status" className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 to-purple-500"></span>
                    Link to Goal
                  </Label>
                  <Select value={formData.goalId || "none"} onValueChange={(v) => setFormData({ ...formData, goalId: v === "none" ? undefined : v })}>
                    <SelectTrigger id="task-goal" className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 to-purple-500"></span>
                    Link to Vision
                  </Label>
                  <Select value={formData.visionId || "none"} onValueChange={(v) => setFormData({ ...formData, visionId: v === "none" ? undefined : v })}>
                    <SelectTrigger id="task-vision" className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl">
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
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 to-purple-500"></span>
                Due Date
              </Label>
              <Input 
                id="task-due-date"
                type="date" 
                value={formData.dueDate} 
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} 
                className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl"
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
                className="w-full sm:w-auto h-12 text-base font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-purple-500 text-white hover:from-amber-700 hover:via-amber-600 hover:to-purple-600 shadow-lg shadow-amber-600/30 hover:shadow-xl hover:shadow-amber-600/40 transition-all duration-300 rounded-xl"
              >
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
