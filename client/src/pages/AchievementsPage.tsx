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
import { Search, Filter, Trophy, Edit3, Trash2, ChevronDown, ChevronUp, PlusCircle, Plus, X, Calendar, Building, Eye, FileText, Award, Medal, Image as ImageIcon } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import type { AchievementType } from "@/types";
import { getGlobalToast } from "@/lib/toast";

const typeOptions = ["certificate", "award", "recognition", "milestone", "photo", "document"] as const;
const categoryOptions = ["Professional", "Academic", "Personal", "Health & Fitness", "Creative", "Volunteer", "Sports", "Technology", "Business", "Other"] as const;

const typeIcons = {
  certificate: FileText,
  award: Trophy,
  recognition: Eye,
  milestone: Calendar,
  photo: ImageIcon,
  document: FileText,
};

const badgeVariants = {
  type: {
    certificate: "bg-blue-100 text-blue-700",
    award: "bg-amber-100 text-amber-700",
    recognition: "bg-purple-100 text-purple-700",
    milestone: "bg-green-100 text-green-700",
    photo: "bg-pink-100 text-pink-700",
    document: "bg-gray-100 text-gray-700",
  },
};

export default function AchievementsPage() {
  const { achievements, visions, goals, tasks, addAchievement, updateAchievement, deleteAchievement } = useAppContext();

  // States
  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<AchievementType | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "certificate" as typeof typeOptions[number],
    date: "",
    issuer: "",
    category: "",
    isPublic: false,
    imageUrl: "",
    documentUrl: "",
    linkedVisionId: "",
    linkedGoalId: "",
    linkedTaskId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [selectedIssuer, setSelectedIssuer] = useState<string | "all">("all");
  const [filterDate, setFilterDate] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  
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

  // Unique categories and issuers
  const uniqueCategories = useMemo(() => {
    const cats = achievements.map((a: any) => a.category).filter(Boolean);
    return Array.from(new Set(cats));
  }, [achievements]);

  const uniqueIssuers = useMemo(() => {
    const issuers = achievements.map((a: any) => a.issuer).filter(Boolean);
    return Array.from(new Set(issuers));
  }, [achievements]);

  // Filtered achievements
  const filteredAchievements = useMemo(() => {
    let filtered = achievements;

    if (debouncedSearch) {
      filtered = filtered.filter((a: any) => 
        a.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        a.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        a.issuer?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((a: any) => a.type === selectedType);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((a: any) => a.category === selectedCategory);
    }

    if (selectedIssuer !== "all") {
      filtered = filtered.filter((a: any) => a.issuer === selectedIssuer);
    }

    if (filterDate) {
      filtered = filtered.filter((a: any) => a.date === filterDate);
    }

    return filtered;
  }, [achievements, debouncedSearch, selectedType, selectedCategory, selectedIssuer, filterDate]);

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedType !== "all") count++;
    if (selectedCategory !== "all") count++;
    if (selectedIssuer !== "all") count++;
    if (filterDate) count++;
    if (searchTerm) count++;
    return count;
  };

  // Handlers
  const handleCancelEdit = () => {
    setEditingAchievement(null);
    setFormData({ title: "", description: "", type: "certificate", date: "", issuer: "", category: "", isPublic: false, imageUrl: "", documentUrl: "", linkedVisionId: "", linkedGoalId: "", linkedTaskId: "" });
    setImagePreview(null);
    setDocumentPreview(null);
  };

  const openCreateModal = () => {
    handleCancelEdit();
    setShowModal(true);
  };

  const openEditModal = (achievement: AchievementType) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description || "",
      type: achievement.type,
      date: achievement.date,
      issuer: achievement.issuer || "",
      category: achievement.category || "",
      isPublic: achievement.isPublic,
      imageUrl: achievement.imageUrl || "",
      documentUrl: achievement.documentUrl || "",
      linkedVisionId: achievement.linkedVisionId?.toString() || "",
      linkedGoalId: achievement.linkedGoalId?.toString() || "",
      linkedTaskId: achievement.linkedTaskId?.toString() || "",
    });
    setImagePreview(achievement.imageUrl || null);
    setDocumentPreview(achievement.documentUrl || null);
    setShowModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowModal(false);
    handleCancelEdit();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const toast = getGlobalToast();
      if (!file.type.startsWith('image/')) {
        toast?.({
          title: "Invalid File",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast?.({
          title: "File Too Large",
          description: "Image size should be less than 5MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setImagePreview(url);
        setFormData({ ...formData, imageUrl: url });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const toast = getGlobalToast();
      if (file.size > 10 * 1024 * 1024) {
        toast?.({
          title: "File Too Large",
          description: "Document size should be less than 10MB.",
          variant: "destructive",
        });
        return;
      }
      setDocumentPreview(file.name);
      setFormData({ ...formData, documentUrl: file.name });
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: "" });
  };

  const removeDocument = () => {
    setDocumentPreview(null);
    setFormData({ ...formData, documentUrl: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) return;

    const submitData = {
      ...formData,
      linkedVisionId: formData.linkedVisionId === "" ? undefined : formData.linkedVisionId,
      linkedGoalId: formData.linkedGoalId === "" ? undefined : formData.linkedGoalId,
      linkedTaskId: formData.linkedTaskId === "" ? undefined : formData.linkedTaskId,
      updatedAt: new Date().toISOString(),
    };

    if (editingAchievement) {
      updateAchievement(editingAchievement.id, submitData);
    } else {
      const newAchievement: AchievementType = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: formData.date,
        issuer: formData.issuer,
        category: formData.category,
        isPublic: formData.isPublic,
        imageUrl: formData.imageUrl || undefined,
        documentUrl: formData.documentUrl || undefined,
        linkedVisionId: formData.linkedVisionId || undefined,
        linkedGoalId: formData.linkedGoalId || undefined,
        linkedTaskId: formData.linkedTaskId || undefined,
        createdAt: new Date().toISOString(),
      };
      addAchievement(newAchievement);
    }

    setShowModal(false);
    handleCancelEdit();
  };

  const handleDelete = (id: string) => {
    const achievement = achievements.find((a) => a.id === id);
    deleteAchievement(id);
    const toast = getGlobalToast();
    if (toast) {
      toast({
        title: "Achievement deleted",
        description: achievement?.title ? `"${achievement.title}" has been deleted.` : "Achievement has been deleted.",
        variant: "default",
      });
    }
  };

  const toggleDesc = (id: string) => {
    setExpandedDesc(expandedDesc === id ? null : id);
  };

  // Glassmorphism class
  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <Card className={`${glassClass} border-amber-200/50`}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 ring-2 ring-white/20">
                <Trophy className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-purple-600 bg-clip-text text-transparent mb-1">
                  Your Achievements
                </h1>
                <p className="text-gray-600 text-sm font-medium">Track accomplishments and build your growth portfolio</p>
              </div>
            </div>
            <Button 
              onClick={openCreateModal} 
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusCircle className="h-5 w-5" />
              Add Achievement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters & Search - Only show when items exist */}
      {achievements.length > 0 && (
        <Card className={glassClass}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search achievements..."
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
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {typeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryOptions.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                    {uniqueCategories.map((cat: string) => (
                      !categoryOptions.includes(cat as typeof categoryOptions[number]) && (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      )
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedIssuer} onValueChange={setSelectedIssuer}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Issuers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Issuers</SelectItem>
                    {uniqueIssuers.map((issuer: string) => (
                      <SelectItem key={issuer} value={issuer}>{issuer}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats - Only show when items exist */}
      {achievements.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Trophy className="h-6 w-6 text-amber-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{achievements.length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Total Achievements</p>
          </CardContent>
        </Card>
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Award className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{achievements.filter((a: any) => a.type === "award").length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Awards</p>
          </CardContent>
        </Card>
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Medal className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{achievements.filter((a: any) => a.type === "milestone").length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Milestones</p>
          </CardContent>
        </Card>
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Eye className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{achievements.filter((a: any) => a.isPublic).length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Public</p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Achievements Gallery or Empty State */}
      {filteredAchievements.length === 0 && achievements.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-100 to-purple-100 flex items-center justify-center">
              <Trophy className="h-12 w-12 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Achievements Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your portfolio by logging your first accomplishment.
            </p>
            <Button onClick={openCreateModal} className="bg-gradient-to-r from-amber-500 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg">
              Add Your First Achievement
            </Button>
          </CardContent>
        </Card>
      ) : filteredAchievements.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Achievements Match Your Filters</h3>
            <p className="text-gray-600">Try adjusting your search or clear filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAchievements.map((achievement: any) => {
            const isExpanded = expandedDesc === achievement.id;
            const displayDesc = isExpanded ? achievement.description : (achievement.description || "").substring(0, 150) + "...";
            const TypeIcon = typeIcons[achievement.type as keyof typeof typeIcons] || FileText;

            return (
              <Card key={achievement.id} className={`${glassClass} hover:shadow-xl transition-all duration-300 border-amber-200/30 relative overflow-hidden`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-purple-600"></div>
                
                {/* Image Display */}
                {achievement.imageUrl && (
                  <div className="w-full h-48 bg-gray-100 overflow-hidden">
                    <img 
                      src={achievement.imageUrl} 
                      alt={achievement.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <TypeIcon className="h-5 w-5 text-amber-500" />
                      <CardTitle className="text-lg font-bold text-gray-900">{achievement.title}</CardTitle>
                    </div>
                    {achievement.isPublic && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <Eye className="h-3 w-3 mr-1" />
                        Public
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(achievement.date).toLocaleDateString()}
                    </span>
                  </div>
          </CardHeader>
                <CardContent className="space-y-4">
                  {achievement.description && (
                    <p 
                      className="text-gray-600 text-sm cursor-pointer hover:text-purple-600"
                      onClick={() => toggleDesc(achievement.id)}
                    >
                      {displayDesc}
                      {achievement.description.length > 150 && (
                        <span className="text-purple-600 font-medium ml-1">
                          {isExpanded ? " Show less" : " Show more"}
                        </span>
                      )}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={badgeVariants.type[achievement.type as keyof typeof badgeVariants.type] || "bg-gray-100 text-gray-700"}>
                      {achievement.type}
                    </Badge>
                    {achievement.category && (
                      <Badge variant="outline" className="text-purple-600 border-purple-200">
                        {achievement.category}
                      </Badge>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1 text-xs text-gray-500">
                    {achievement.issuer && (
                      <p className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {achievement.issuer}
                      </p>
                    )}
                    {achievement.documentUrl && (
                      <p className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Document attached
                      </p>
                    )}
                  </div>

                  {/* Linked Items */}
                  {(achievement.linkedVisionId || achievement.linkedGoalId || achievement.linkedTaskId) && (
                    <div className="text-xs text-gray-500 p-3 rounded-lg bg-amber-50 border border-amber-200">
                      {achievement.linkedVisionId && <p>Vision: {visions.find((v: any) => v.id === achievement.linkedVisionId)?.title || "Linked"}</p>}
                      {achievement.linkedGoalId && <p>Goal: {goals.find((g: any) => g.id === achievement.linkedGoalId)?.title || "Linked"}</p>}
                      {achievement.linkedTaskId && <p>Task: {tasks.find((t: any) => t.id === achievement.linkedTaskId)?.title || "Linked"}</p>}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(achievement)}>
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(achievement.id)}
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
        <DialogContent className="backdrop-blur-xl bg-white/95 border-2 border-rose-200/60 shadow-2xl shadow-rose-900/20 rounded-3xl max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-purple-500 p-6 rounded-t-3xl">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-2 ring-white/30">
                  <Trophy className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-3xl font-bold text-white mb-1">
                    {editingAchievement ? "Edit Achievement" : "Create New Achievement"}
                  </DialogTitle>
                  <DialogDescription className="text-white/90 text-base font-medium">
                    Document your accomplishment with optional evidence and linking to your visions or goals.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-8">
            <div className="space-y-2.5">
              <Label htmlFor="title" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-500"></span>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Completed Full Stack Developer Certification"
                className="h-12 text-base border-gray-300 focus:border-rose-500 focus:ring-rose-500/20 rounded-xl transition-all"
                required
              />
              <p className="text-xs text-gray-500 font-medium">Give your achievement a clear and descriptive title</p>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="description" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-500"></span>
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details about what you accomplished..."
                className="min-h-[120px] text-base border-gray-300 focus:border-rose-500 focus:ring-rose-500/20 rounded-xl transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-500"></span>
                  Type
                </Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as typeof typeOptions[number] })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-rose-500 focus:ring-rose-500/20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="date" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-500"></span>
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="h-12 text-base border-gray-300 focus:border-rose-500 focus:ring-rose-500/20 rounded-xl transition-all"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="issuer" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-500"></span>
                  Issuer/Organization
                </Label>
                <Input
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="Who issued this achievement?"
                  className="h-12 text-base border-gray-300 focus:border-rose-500 focus:ring-rose-500/20 rounded-xl transition-all"
                />
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-500"></span>
                  Category
                </Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-rose-500 focus:ring-rose-500/20 rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Image Upload */}
            <div className="space-y-2.5">
              <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-500"></span>
                Image Upload
              </Label>
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-rose-400 transition-all cursor-pointer bg-gray-50 hover:bg-rose-50/50">
                  <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-2">Upload an image of your achievement</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <Label htmlFor="image-upload" className="cursor-pointer bg-gradient-to-r from-rose-100 to-purple-100 hover:from-rose-200 hover:to-purple-200 text-rose-700 font-semibold px-6 py-2.5 rounded-xl inline-block transition-all shadow-sm hover:shadow-md">
                    Choose Image
                  </Label>
                  <p className="text-xs text-gray-500 mt-3 font-medium">Max 5MB</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl">
                  <ImageIcon className="h-6 w-6 text-rose-600" />
                  <span className="flex-1 text-sm font-semibold text-gray-700">Image uploaded</span>
                  <Button type="button" variant="ghost" size="sm" onClick={removeImage} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {/* Document Upload */}
            <div className="space-y-2.5">
              <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-500"></span>
                Document Upload
              </Label>
              {!documentPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-rose-400 transition-all cursor-pointer bg-gray-50 hover:bg-rose-50/50">
                  <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-2">Upload a document (PDF, DOC, DOCX, TXT)</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleDocumentUpload}
                    style={{ display: 'none' }}
                    id="document-upload"
                  />
                  <Label htmlFor="document-upload" className="cursor-pointer bg-gradient-to-r from-rose-100 to-purple-100 hover:from-rose-200 hover:to-purple-200 text-rose-700 font-semibold px-6 py-2.5 rounded-xl inline-block transition-all shadow-sm hover:shadow-md">
                    Choose Document
                  </Label>
                  <p className="text-xs text-gray-500 mt-3 font-medium">Max 10MB</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl">
                  <FileText className="h-6 w-6 text-rose-600" />
                  <span className="flex-1 text-sm font-semibold text-gray-700">{documentPreview}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={removeDocument} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {/* Public Toggle */}
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
              <Checkbox
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked as boolean })}
                className="h-5 w-5"
              />
              <Label htmlFor="isPublic" className="text-sm font-semibold text-gray-900 cursor-pointer">
                Make this achievement public (visible to others)
              </Label>
            </div>
            {/* Linking */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-500"></span>
                  Link to Vision
                </Label>
                <Select value={formData.linkedVisionId} onValueChange={(value) => setFormData({ ...formData, linkedVisionId: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-rose-500 focus:ring-rose-500/20 rounded-xl">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-500"></span>
                  Link to Goal
                </Label>
                <Select value={formData.linkedGoalId} onValueChange={(value) => setFormData({ ...formData, linkedGoalId: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-rose-500 focus:ring-rose-500/20 rounded-xl">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-500"></span>
                  Link to Task
                </Label>
                <Select value={formData.linkedTaskId} onValueChange={(value) => setFormData({ ...formData, linkedTaskId: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-rose-500 focus:ring-rose-500/20 rounded-xl">
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
              <Button type="submit" className="w-full sm:w-auto h-12 text-base font-bold bg-gradient-to-r from-rose-600 via-rose-500 to-purple-500 text-white hover:from-rose-700 hover:via-rose-600 hover:to-purple-600 shadow-lg shadow-rose-600/30 hover:shadow-xl hover:shadow-rose-600/40 transition-all duration-300 rounded-xl">
                {editingAchievement ? "Update Achievement" : "Add Achievement"}
              </Button>
            </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      {/* Mobile FAB */}
      {isMobile && (
        <button 
          onClick={openCreateModal}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 text-white shadow-2xl hover:shadow-xl flex items-center justify-center z-40 transition-all duration-300 hover:scale-110"
          aria-label="Add new achievement"
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
                  placeholder="Search achievements..."
                  autoFocus
                />
                {searchTerm && (
                  <p className="text-xs text-gray-500">{filteredAchievements.length} results</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {typeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
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
                    {categoryOptions.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                  setSelectedCategory("all");
                  setSelectedIssuer("all");
                  setFilterDate("");
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
