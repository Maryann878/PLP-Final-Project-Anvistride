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
import { Search, Filter, Lightbulb, Edit3, Trash2, ChevronDown, ChevronUp, PlusCircle, Plus, X, CheckCircle, Play, Pause, Flag, Calendar } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { getGlobalToast } from "@/lib/toast";
import type { IdeaType } from "@/types";

const statusOptions = ["Draft", "Exploring", "Ready", "Implemented", "Archived"] as const;
const priorityOptions = ["Low", "Medium", "High"] as const;

const badgeVariants = {
  status: {
    Draft: "bg-gray-100 text-gray-700",
    Exploring: "bg-blue-100 text-blue-700",
    Ready: "bg-green-100 text-green-700",
    Implemented: "bg-purple-100 text-purple-700",
    Archived: "bg-gray-200 text-gray-600",
  },
  priority: {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
  },
};

export default function IdeasPage() {
  const { ideas, visions, goals, tasks, addIdea, updateIdea, deleteIdea } = useAppContext();

  // States
  const [showModal, setShowModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState<IdeaType | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Draft" as typeof statusOptions[number],
    priority: "Medium" as typeof priorityOptions[number],
    category: "",
    implementationNotes: "",
    linkedVisionId: "",
    linkedGoalId: "",
    linkedTaskId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<string | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);
  
  // Mobile states
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // All categories
  const allCategories = useMemo(() => {
    const cats = ideas.map((i: any) => i.category).filter(Boolean);
    return Array.from(new Set(cats));
  }, [ideas]);

  // Filtered ideas
  const filteredIdeas = useMemo(() => {
    let filtered = ideas;

    if (debouncedSearch) {
      filtered = filtered.filter((i: any) => 
        i.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        i.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((i: any) => i.status === selectedStatus);
    }

    if (selectedPriority !== "all") {
      filtered = filtered.filter((i: any) => i.priority === selectedPriority);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((i: any) => i.category === selectedCategory);
    }

    return filtered;
  }, [ideas, debouncedSearch, selectedStatus, selectedPriority, selectedCategory]);

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedStatus !== "all") count++;
    if (selectedPriority !== "all") count++;
    if (selectedCategory !== "all") count++;
    if (searchTerm) count++;
    return count;
  };

  // Handlers
  const handleCancelEdit = () => {
    setEditingIdea(null);
    setFormData({ title: "", description: "", status: "Draft", priority: "Medium", category: "", implementationNotes: "", linkedVisionId: "", linkedGoalId: "", linkedTaskId: "" });
  };

  const openCreateModal = () => {
    handleCancelEdit();
    setShowModal(true);
  };

  const openEditModal = (idea: IdeaType) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title || "",
      description: idea.description || "",
      status: idea.status,
      priority: idea.priority || "Medium",
      category: idea.category || "",
      implementationNotes: idea.implementationNotes || "",
      linkedVisionId: idea.linkedVisionId?.toString() || "",
      linkedGoalId: idea.linkedGoalId?.toString() || "",
      linkedTaskId: idea.linkedTaskId?.toString() || "",
    });
    setShowModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowModal(false);
    handleCancelEdit();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const submitData = {
      ...formData,
      description: formData.description || "",
      implementedAt: formData.status === "Implemented" ? new Date().toISOString() : undefined,
      linkedVisionId: formData.linkedVisionId === "" ? undefined : formData.linkedVisionId,
      linkedGoalId: formData.linkedGoalId === "" ? undefined : formData.linkedGoalId,
      linkedTaskId: formData.linkedTaskId === "" ? undefined : formData.linkedTaskId,
      updatedAt: new Date().toISOString(),
    };

    if (editingIdea) {
      updateIdea(editingIdea.id, submitData);
    } else {
      const newIdea: IdeaType = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        category: formData.category,
        implementationNotes: formData.implementationNotes,
        linkedVisionId: formData.linkedVisionId || undefined,
        linkedGoalId: formData.linkedGoalId || undefined,
        linkedTaskId: formData.linkedTaskId || undefined,
        createdAt: new Date().toISOString(),
        implementedAt: formData.status === "Implemented" ? new Date().toISOString() : undefined,
      };
      addIdea(newIdea);
    }

    setShowModal(false);
    handleCancelEdit();
  };

  const handleDelete = (id: string) => {
    const idea = ideas.find((i: any) => i.id === id);
    deleteIdea(id);
    const toast = getGlobalToast();
    if (toast) {
      toast({
        title: "Idea deleted",
        description: idea?.title ? `"${idea.title}" has been deleted.` : "Idea has been deleted.",
        variant: "default",
      });
    }
  };

  const handleStatusChange = (ideaId: string, newStatus: typeof statusOptions[number]) => {
    const idea = ideas.find((i: any) => i.id === ideaId);
    if (!idea) return;

    const implementedAt = newStatus === "Implemented" && idea.status !== "Implemented" 
      ? new Date().toISOString() 
      : newStatus !== "Implemented" ? undefined : idea.implementedAt;

    updateIdea(ideaId, { status: newStatus, implementedAt });
  };

  const toggleDesc = (id: string) => {
    setExpandedDesc(expandedDesc === id ? null : id);
  };

  // Glassmorphism class
  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <Card className={`${glassClass} border-yellow-200/50`}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 via-yellow-400 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-yellow-500/30 ring-2 ring-white/20">
                <Lightbulb className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-2 tracking-tight leading-tight">
                  Your Ideas
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  Capture and organize spontaneous inspiration
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ideas Statistics - Compact */}
      <div className="flex items-center justify-between gap-3 relative">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-50 to-purple-50 border border-yellow-200/50">
          <Lightbulb className="h-4 w-4 text-yellow-600" />
          <span className="text-lg font-bold text-gray-900">{ideas.length}</span>
          <span className="text-xs text-gray-600 font-medium">Total Ideas</span>
        </div>
        <Button 
          onClick={openCreateModal} 
          className="hidden sm:flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <PlusCircle className="h-5 w-5" />
          Capture Idea
        </Button>
        {/* Mobile FAB - Top Right */}
        {isMobile && (
          <button 
            onClick={openCreateModal}
            className="absolute top-0 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-teal-500 text-white shadow-xl hover:shadow-2xl flex items-center justify-center z-40 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Capture idea"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filters & Search - Only show when items exist */}
      {ideas.length > 0 && (
        <Card className={glassClass}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    {priorityOptions.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats - Only show when items exist */}
      {ideas.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Lightbulb className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{ideas.length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Total Ideas</p>
          </CardContent>
        </Card>
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{ideas.filter((i: any) => i.status === "Implemented").length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Implemented</p>
          </CardContent>
        </Card>
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Play className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{ideas.filter((i: any) => i.status === "Exploring").length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Exploring</p>
          </CardContent>
        </Card>
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Flag className="h-6 w-6 text-teal-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{ideas.filter((i: any) => i.status === "Ready").length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Ready</p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Ideas Grid or Empty State */}
      {filteredIdeas.length === 0 && ideas.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 sm:p-16 text-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-yellow-100 via-yellow-50 to-purple-100 dark:from-yellow-900/30 dark:to-purple-900/30 flex items-center justify-center shadow-lg shadow-yellow-500/10 animate-pulse-slow">
              <Lightbulb className="h-14 w-14 sm:h-16 sm:w-16 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Ideas Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Capture your spontaneous ideas and organize them for future implementation.
            </p>
            <Button 
              onClick={openCreateModal} 
              className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-purple-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
            >
              Capture Your First Idea
            </Button>
          </CardContent>
        </Card>
      ) : filteredIdeas.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Ideas Match Your Filters</h3>
            <p className="text-gray-600">Try adjusting your search criteria or clear the filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIdeas.map((idea: any) => {
            const isExpanded = expandedDesc === idea.id;
            const displayDesc = isExpanded ? idea.description : (idea.description || "").substring(0, 100) + "...";
            const isImplemented = idea.status === "Implemented";

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
              <Card key={idea.id} className={`${glassClass} hover:shadow-lg transition-all duration-300 border border-gray-200/80 overflow-hidden flex flex-col ${isImplemented ? 'bg-gradient-to-br from-purple-50/30 to-teal-50/20' : ''}`}>
                {isImplemented && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-teal-500"></div>
                )}
                {/* Header Section */}
                <CardHeader className="pb-3 px-5 pt-5">
                  <div className="flex justify-between items-start gap-2 sm:gap-3">
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex-1 leading-tight pr-2">{idea.title || "Untitled Idea"}</CardTitle>
                    <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => openEditModal(idea)}
                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                        title="Edit Idea"
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(idea.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 text-red-600 hover:text-red-700"
                        title="Delete Idea"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge className={`${badgeVariants.status[idea.status as keyof typeof badgeVariants.status] || "bg-gray-100 text-gray-700"} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                      {idea.status}
                    </Badge>
                    {idea.priority && (
                      <Badge className={`${badgeVariants.priority[idea.priority as keyof typeof badgeVariants.priority] || "bg-gray-100 text-gray-700"} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                        {idea.priority}
                      </Badge>
                    )}
                    {idea.category && (
                      <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 rounded-full text-amber-600 border-amber-200 bg-amber-50">
                        {idea.category}
                      </Badge>
                    )}
                    {idea.implementedAt && (
                      <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 rounded-full text-purple-600 border-purple-200 bg-purple-50">
                        Implemented: {new Date(idea.implementedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                {/* Description */}
                <CardContent className="px-5 pt-0 pb-4 flex-1">
                  {idea.description && (
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                      {displayDesc}
                      {idea.description.length > 100 && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => toggleDesc(idea.id)} 
                          className="h-auto p-0 ml-1 text-amber-600 font-medium text-sm"
                        >
                          {isExpanded ? "Show Less" : "...Read More"}
                        </Button>
                      )}
                    </p>
                  )}
                  {!idea.description && (
                    <p className="text-sm text-gray-400 italic">No description</p>
                  )}
                </CardContent>

                {/* Implementation Notes */}
                {idea.implementationNotes && (
                  <div className="px-5 pb-4">
                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <p className="text-xs font-semibold text-purple-700 mb-1">Implementation Notes:</p>
                      <p className="text-sm text-gray-700">{idea.implementationNotes}</p>
                    </div>
                  </div>
                )}

                {/* Linked Items */}
                {(idea.linkedVisionId || idea.linkedGoalId || idea.linkedTaskId) && (
                  <div className="px-5 pb-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {idea.linkedVisionId && (
                        <span className="px-2 py-1 rounded bg-purple-50 border border-purple-200 text-purple-700">
                          Vision: {visions.find((v: any) => v.id === idea.linkedVisionId)?.title || "Linked"}
                        </span>
                      )}
                      {idea.linkedGoalId && (
                        <span className="px-2 py-1 rounded bg-teal-50 border border-teal-200 text-teal-700">
                          Goal: {goals.find((g: any) => g.id === idea.linkedGoalId)?.title || "Linked"}
                        </span>
                      )}
                      {idea.linkedTaskId && (
                        <span className="px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-700">
                          Task: {tasks.find((t: any) => t.id === idea.linkedTaskId)?.title || "Linked"}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Status Actions */}
                {(idea.status === "Draft" || idea.status === "Exploring" || idea.status === "Ready") && (
                  <div className="px-5 pb-4">
                    <div className="flex gap-2">
                      {idea.status === "Draft" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleStatusChange(idea.id, "Exploring")}
                          className="flex-1 text-xs font-medium border-blue-200 text-blue-600 hover:bg-blue-50 h-9"
                        >
                          <Play className="h-3.5 w-3.5 mr-1.5" />
                          Start Exploring
                        </Button>
                      )}
                      {idea.status === "Exploring" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleStatusChange(idea.id, "Ready")}
                            className="flex-1 text-xs font-medium border-green-200 text-green-600 hover:bg-green-50 h-9"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                            Mark Ready
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleStatusChange(idea.id, "Draft")}
                            className="flex-1 text-xs font-medium border-gray-200 text-gray-600 hover:bg-gray-50 h-9"
                          >
                            <Pause className="h-3.5 w-3.5 mr-1.5" />
                            Pause
                          </Button>
                        </>
                      )}
                      {idea.status === "Ready" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleStatusChange(idea.id, "Implemented")}
                          className="flex-1 text-xs font-medium border-purple-200 text-purple-600 hover:bg-purple-50 h-9"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Mark Implemented
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200 mx-5"></div>

                {/* Date at Bottom */}
                <div className="px-5 pt-3 pb-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="font-medium">{formatDate(idea.createdAt)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={(open) => {
        if (!open) {
          handleCloseCreateModal();
        }
      }}>
        <DialogContent className="backdrop-blur-xl bg-white/95 border-2 border-yellow-200/60 shadow-2xl shadow-yellow-900/20 rounded-3xl max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-purple-500 p-6 rounded-t-3xl">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-2 ring-white/30">
                  <Lightbulb className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-3xl font-bold text-white mb-1">
                    {editingIdea ? "Edit Idea" : "Capture New Idea"}
                  </DialogTitle>
                  <DialogDescription className="text-white/90 text-base font-medium">
                    Record your inspiration and organize it for future implementation.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-8">
            <div className="space-y-2.5">
              <Label htmlFor="title" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-600 to-purple-500"></span>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., AI-powered task suggestions"
                className="h-12 text-base border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl transition-all"
                required
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="description" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-600 to-purple-500"></span>
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your idea and why it matters..."
                className="min-h-[120px] text-base border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl transition-all resize-none"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="category" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-600 to-purple-500"></span>
                Category
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Feature, Design, Marketing"
                className="h-12 text-base border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl transition-all"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-600 to-purple-500"></span>
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as typeof statusOptions[number] })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl">
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
                <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-600 to-purple-500"></span>
                  Priority
                </Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as typeof priorityOptions[number] })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl">
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
            {formData.status === "Implemented" && (
              <div className="space-y-2.5">
                <Label htmlFor="implementationNotes" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-600 to-purple-500"></span>
                  Implementation Notes
                </Label>
                <Textarea
                  id="implementationNotes"
                  value={formData.implementationNotes}
                  onChange={(e) => setFormData({ ...formData, implementationNotes: e.target.value })}
                  placeholder="How was this implemented? What was the outcome?"
                  className="min-h-[100px] text-base border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl transition-all resize-none"
                />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-600 to-purple-500"></span>
                  Link to Vision
                </Label>
                <Select value={formData.linkedVisionId} onValueChange={(value) => setFormData({ ...formData, linkedVisionId: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl">
                    <SelectValue placeholder="Vision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {visions.map((vision: any) => (
                      <SelectItem key={vision.id} value={vision.id.toString()}>{vision.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-600 to-purple-500"></span>
                  Link to Goal
                </Label>
                <Select value={formData.linkedGoalId} onValueChange={(value) => setFormData({ ...formData, linkedGoalId: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl">
                    <SelectValue placeholder="Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {goals.map((goal: any) => (
                      <SelectItem key={goal.id} value={goal.id.toString()}>{goal.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-600 to-purple-500"></span>
                  Link to Task
                </Label>
                <Select value={formData.linkedTaskId} onValueChange={(value) => setFormData({ ...formData, linkedTaskId: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl">
                    <SelectValue placeholder="Task" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {tasks.map((task: any) => (
                      <SelectItem key={task.id} value={task.id.toString()}>{task.title || "Untitled"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-100 mt-6">
              <Button type="button" variant="outline" onClick={handleCloseCreateModal} className="w-full sm:w-auto h-12 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto h-12 text-base font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-purple-500 text-white hover:from-yellow-700 hover:via-yellow-600 hover:to-purple-600 shadow-lg shadow-yellow-600/30 hover:shadow-xl hover:shadow-yellow-600/40 transition-all duration-300 rounded-xl">
                {editingIdea ? "Update Idea" : "Capture Idea"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      {/* Mobile Slide Menu */}
      {showMobileMenu && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMenu(false)}></div>
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Search & Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search ideas..."
                  autoFocus
                />
                {searchTerm && (
                  <p className="text-xs text-gray-500">{filteredIdeas.length} results</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    {priorityOptions.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                  setSelectedPriority("all");
                  setSelectedCategory("all");
                  setShowMobileMenu(false);
                }}
                className="w-full"
              >
                Clear Filters ({getActiveFiltersCount()})
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
