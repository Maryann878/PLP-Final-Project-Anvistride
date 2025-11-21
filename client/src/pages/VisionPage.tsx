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
import { getGlobalToast } from "@/lib/toast";
import BackButton from "@/components/BackButton";
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
  const { visions, goals, tasks, ideas, addVision, updateVision, deleteVision } = useAppContext();
  const navigate = useNavigate();

  // States
  const [showModal, setShowModal] = useState(false);
  const [editingVision, setEditingVision] = useState<VisionType | null>(null);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [newlyCreatedVision, setNewlyCreatedVision] = useState<VisionType | null>(null);
  const [expandedVisionId, setExpandedVisionId] = useState<string | null>(null);
  
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

  // Visions with auto-calculated progress
  const visionsWithProgress: VisionWithCounts[] = useMemo(() => {
    return visions.map((vision: VisionType) => {
      const linkedGoals = goals.filter(goal => goal.linkedVisionId?.toString() === vision.id.toString());
      let totalProgress = 0;
      if (linkedGoals.length > 0) {
        const completedGoals = linkedGoals.filter(goal => goal.status === "Completed");
        totalProgress = Math.round((completedGoals.length / linkedGoals.length) * 100);
      }
      const linkedTasks = tasks.filter(task => task.visionId?.toString() === vision.id.toString());
      const linkedIdeas = ideas.filter(idea => idea.linkedVisionId?.toString() === vision.id.toString());
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

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* HEADER */}
      <Card className={`${glassClass} border-purple-200/50`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/30 ring-2 ring-white/20">
                <Eye className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent mb-1">
                  Your Visions
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Define your long-term aspirations and dreams</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <BackButton variant="ghost" showText={false} className="md:hidden" />
              <Button 
                onClick={openCreateModal} 
                className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-initial"
              >
                <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" /> 
                <span className="hidden sm:inline">New Vision</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEARCH & FILTERS */}
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

      {/* VISIONS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisions.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">No visions found.</p>
        ) : (
          filteredVisions.map(vision => (
            <Card key={vision.id} className={glassClass}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{vision.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleUpdateClick(vision)}>
                      <Edit3 size={16} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(vision.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge className={badgeVariants.status[vision.status]}>{vision.status}</Badge>
                  {vision.priority && (
                    <Badge className={badgeVariants.priority[vision.priority]}>{vision.priority}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {expandedDesc === vision.id ? vision.description : vision.description?.slice(0, 80)}
                  {vision.description && vision.description.length > 80 && (
                    <Button variant="link" size="sm" onClick={() => toggleDesc(vision.id)}>
                      {expandedDesc === vision.id ? "Show Less" : "...Read More"}
                    </Button>
                  )}
                </p>
                <Progress value={vision.progress} className="mt-2" />
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button size="sm" variant="outline" onClick={() => toggleLinkedItems(vision.id)}>
                  {expandedVisionId === vision.id ? "Hide Linked" : "Show Linked"}
                </Button>
                <Button size="sm" onClick={() => handleCreateGoalFromVision(vision.id)}>New Goal</Button>
              </CardFooter>
              {expandedVisionId === vision.id && (
                <div className="p-4 border-t border-gray-200">
                  <p>Goals: {vision.linkedGoalsCount}</p>
                  <p>Tasks: {vision.linkedTasksCount}</p>
                  <p>Ideas: {vision.linkedIdeasCount}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <Dialog open={showModal} onOpenChange={(open) => {
        if (!open) {
          handleCloseCreateModal();
        }
      }}>
        <DialogContent className="backdrop-blur-xl bg-white/95 border-2 border-purple-200/60 shadow-2xl shadow-purple-900/20 rounded-3xl max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-0">
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
          <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-8">
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
            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-100 mt-6">
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
    </div>
  );
}
