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
import { Search, Filter, Lightbulb, Edit3, Trash2, ChevronDown, ChevronUp, PlusCircle, Plus, X, CheckCircle, Play, Pause, Flag } from "lucide-react";
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-purple-500 bg-clip-text text-transparent mb-1">
                  Your Ideas
                </h1>
                <p className="text-gray-600 text-sm font-medium">Capture and organize spontaneous inspiration</p>
              </div>
            </div>
            <Button 
              onClick={openCreateModal} 
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusCircle className="h-5 w-5" />
              Capture Idea
            </Button>
          </div>
        </CardContent>
      </Card>

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
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center">
              <Lightbulb className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Ideas Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Capture your spontaneous ideas and organize them for future implementation.
            </p>
            <Button onClick={openCreateModal} className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-8 py-3 rounded-xl shadow-lg">
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
            const displayDesc = isExpanded ? idea.description : (idea.description || "").substring(0, 150) + "...";
            const isImplemented = idea.status === "Implemented";

            return (
              <Card key={idea.id} className={`${glassClass} hover:shadow-xl transition-all duration-300 ${isImplemented ? 'border-purple-400/50 bg-gradient-to-br from-purple-50/50 to-teal-50/30' : 'border-purple-200/30'}`}>
                {isImplemented && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-teal-500"></div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold text-gray-900">{idea.title || "Untitled Idea"}</CardTitle>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                    {idea.implementedAt && <span className="text-purple-600 font-medium">Implemented: {new Date(idea.implementedAt).toLocaleDateString()}</span>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {idea.description && (
                    <p 
                      className="text-gray-600 text-sm cursor-pointer hover:text-purple-600"
                      onClick={() => toggleDesc(idea.id)}
                    >
                      {displayDesc}
                      {idea.description.length > 150 && (
                        <span className="text-purple-600 font-medium ml-1">
                          {isExpanded ? " Show less" : " Show more"}
                        </span>
                      )}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={badgeVariants.status[idea.status as keyof typeof badgeVariants.status] || "bg-gray-100 text-gray-700"}>
                      {idea.status}
                    </Badge>
                    {idea.priority && (
                      <Badge className={badgeVariants.priority[idea.priority as keyof typeof badgeVariants.priority] || "bg-gray-100 text-gray-700"}>
                        {idea.priority} Priority
                      </Badge>
                    )}
                    {idea.category && (
                      <Badge variant="outline" className="text-purple-600 border-purple-200">
                        {idea.category}
                      </Badge>
                    )}
                  </div>

                  {/* Implementation Notes */}
                  {idea.implementationNotes && (
                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <p className="text-xs font-semibold text-purple-700 mb-1">Implementation Notes:</p>
                      <p className="text-sm text-gray-700">{idea.implementationNotes}</p>
                    </div>
                  )}

                  {/* Linked Items */}
                  {(idea.linkedVisionId || idea.linkedGoalId || idea.linkedTaskId) && (
                    <div className="text-xs text-gray-500 space-y-1">
                      {idea.linkedVisionId && <p>Vision: {visions.find((v: any) => v.id === idea.linkedVisionId)?.title || "Linked"}</p>}
                      {idea.linkedGoalId && <p>Goal: {goals.find((g: any) => g.id === idea.linkedGoalId)?.title || "Linked"}</p>}
                      {idea.linkedTaskId && <p>Task: {tasks.find((t: any) => t.id === idea.linkedTaskId)?.title || "Linked"}</p>}
                    </div>
                  )}

                  {/* Quick Status Actions */}
                  <div className="flex gap-2">
                    {idea.status === "Draft" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusChange(idea.id, "Exploring")}
                        className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start Exploring
                      </Button>
                    )}
                    {idea.status === "Exploring" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleStatusChange(idea.id, "Ready")}
                          className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Ready
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleStatusChange(idea.id, "Draft")}
                          className="flex-1 text-gray-600 border-gray-200 hover:bg-gray-50"
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      </>
                    )}
                    {idea.status === "Ready" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusChange(idea.id, "Implemented")}
                        className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Implemented
                      </Button>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(idea)}>
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(idea.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
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

      {/* Mobile FAB */}
      {isMobile && (
        <button 
          onClick={openCreateModal}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-teal-500 text-white shadow-2xl hover:shadow-xl flex items-center justify-center z-40 transition-all duration-300 hover:scale-110"
          aria-label="Capture new idea"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

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
