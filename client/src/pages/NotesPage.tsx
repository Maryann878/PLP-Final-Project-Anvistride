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
import { Search, Filter, StickyNote, Edit3, Trash2, ChevronDown, ChevronUp, PlusCircle, Plus, X, Calendar } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { getGlobalToast } from "@/lib/toast";
import type { NoteType } from "@/types";

const categoryOptions = ["Product", "Design", "Development", "Marketing", "Operations", "Personal"] as const;

export default function NotesPage() {
  const { notes, visions, goals, tasks, addNote, updateNote, deleteNote } = useAppContext();

  // States
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteType | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Product" as typeof categoryOptions[number],
    linkedVisionId: "",
    linkedGoalId: "",
    linkedTaskId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  
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

  // All categories from notes
  const allCategories = useMemo(() => {
    const cats = notes.map((n: any) => n.category).filter(Boolean);
    return Array.from(new Set(cats));
  }, [notes]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    if (debouncedSearch) {
      filtered = filtered.filter((n: any) => 
        n.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        n.content.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((n: any) => n.category === selectedCategory);
    }

    return filtered;
  }, [notes, debouncedSearch, selectedCategory]);

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (searchTerm) count++;
    return count;
  };

  // Handlers
  const handleCancelEdit = () => {
    setEditingNote(null);
    setFormData({ title: "", content: "", category: "Product", linkedVisionId: "", linkedGoalId: "", linkedTaskId: "" });
  };

  const openCreateModal = () => {
    handleCancelEdit();
    setShowModal(true);
  };

  const openEditModal = (note: NoteType) => {
    setEditingNote(note);
    setFormData({
      title: note.title || "",
      content: note.content,
      category: (note.category as typeof categoryOptions[number]) || "Product",
      linkedVisionId: note.linkedVisionId?.toString() || "",
      linkedGoalId: note.linkedGoalId?.toString() || "",
      linkedTaskId: note.linkedTaskId?.toString() || "",
    });
    setShowModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowModal(false);
    handleCancelEdit();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    // Auto-generate title if empty
    const noteTitle = formData.title.trim() || `Note ${notes.length + 1}`;

    const submitData = {
      ...formData,
      title: noteTitle,
      linkedVisionId: formData.linkedVisionId === "" ? undefined : formData.linkedVisionId,
      linkedGoalId: formData.linkedGoalId === "" ? undefined : formData.linkedGoalId,
      linkedTaskId: formData.linkedTaskId === "" ? undefined : formData.linkedTaskId,
      updatedAt: new Date().toISOString(),
    };

    if (editingNote) {
      updateNote(editingNote.id, submitData);
    } else {
      const newNote: NoteType = {
        id: Date.now().toString(),
        title: noteTitle,
        content: formData.content,
        category: formData.category,
        linkedVisionId: formData.linkedVisionId || undefined,
        linkedGoalId: formData.linkedGoalId || undefined,
        linkedTaskId: formData.linkedTaskId || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addNote(newNote);
    }

    setShowModal(false);
    handleCancelEdit();
  };

  const handleDelete = (id: string) => {
    const note = notes.find((n) => n.id === id);
    deleteNote(id);
    const toast = getGlobalToast();
    if (toast) {
      toast({
        title: "Note deleted",
        description: note?.title ? `"${note.title}" has been deleted.` : "Note has been deleted.",
        variant: "default",
      });
    }
  };

  const toggleContent = (id: string) => {
    setExpandedContent(expandedContent === id ? null : id);
  };

  // Glassmorphism class
  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <Card className={`${glassClass} border-green-200/50`}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 via-green-400 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-green-500/30 ring-2 ring-white/20">
                <StickyNote className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-2 tracking-tight leading-tight">
                  Your Notes
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  Store detailed documentation and thoughts
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Statistics - Compact */}
      <div className="flex items-center justify-between gap-3 relative">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 border border-green-200/50">
          <StickyNote className="h-4 w-4 text-green-600" />
          <span className="text-lg font-bold text-gray-900">{notes.length}</span>
          <span className="text-xs text-gray-600 font-medium">Total Notes</span>
        </div>
        <Button 
          onClick={openCreateModal} 
          className="hidden sm:flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <PlusCircle className="h-5 w-5" />
          Create Note
        </Button>
        {/* Mobile FAB - Top Right */}
        {isMobile && (
          <button 
            onClick={openCreateModal}
            className="absolute top-0 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-teal-500 text-white shadow-xl hover:shadow-2xl flex items-center justify-center z-40 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Create new note"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filters & Search - Only show when items exist */}
      {notes.length > 0 && (
        <Card className={glassClass}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notes..."
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
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryOptions.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                    {allCategories.map((cat: string) => (
                      !categoryOptions.includes(cat as typeof categoryOptions[number]) && (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      )
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats - Only show when items exist */}
      {notes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <StickyNote className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{notes.length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Total Notes</p>
          </CardContent>
        </Card>
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Filter className="h-6 w-6 text-teal-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{new Set(notes.map((n: any) => n.category).filter(Boolean)).size}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Categories</p>
          </CardContent>
        </Card>
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Search className="h-6 w-6 text-amber-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{filteredNotes.length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Filtered Results</p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Notes Grid or Empty State */}
      {filteredNotes.length === 0 && notes.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 sm:p-16 text-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-100 via-green-50 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 flex items-center justify-center shadow-lg shadow-green-500/10 animate-pulse-slow">
              <StickyNote className="h-14 w-14 sm:h-16 sm:w-16 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Notes Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Create your first note to store ideas, research, or any documentation.
            </p>
            <Button 
              onClick={openCreateModal} 
              className="bg-gradient-to-r from-green-500 via-green-400 to-teal-500 hover:from-green-600 hover:via-green-500 hover:to-teal-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              Create Your First Note
            </Button>
          </CardContent>
        </Card>
      ) : filteredNotes.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Notes Match Your Search</h3>
            <p className="text-gray-600">Try adjusting your search or clear filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note: any) => {
            const isExpanded = expandedContent === note.id;
            const displayContent = isExpanded ? note.content : (note.content || "").substring(0, 100) + "...";

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
              <Card key={note.id} className={`${glassClass} hover:shadow-lg transition-all duration-300 border border-gray-200/80 overflow-hidden flex flex-col`}>
                {/* Header Section */}
                <CardHeader className="pb-3 px-5 pt-5">
                  <div className="flex justify-between items-start gap-2 sm:gap-3">
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex-1 leading-tight pr-2">{note.title || "Untitled Note"}</CardTitle>
                    <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => openEditModal(note)}
                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                        title="Edit Note"
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(note.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 text-red-600 hover:text-red-700"
                        title="Delete Note"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {note.category && (
                      <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 rounded-full text-green-600 border-green-200 bg-green-50">
                        {note.category}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                {/* Description */}
                <CardContent className="px-5 pt-0 pb-4 flex-1">
                  {note.content && (
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                      {displayContent}
                      {note.content.length > 100 && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => toggleContent(note.id)} 
                          className="h-auto p-0 ml-1 text-green-600 font-medium text-sm"
                        >
                          {isExpanded ? "Show Less" : "...Read More"}
                        </Button>
                      )}
                    </p>
                  )}
                  {!note.content && (
                    <p className="text-sm text-gray-400 italic">No content</p>
                  )}
                </CardContent>

                {/* Linked Items */}
                {(note.linkedVisionId || note.linkedGoalId || note.linkedTaskId) && (
                  <div className="px-5 pb-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {note.linkedVisionId && (
                        <span className="px-2 py-1 rounded bg-purple-50 border border-purple-200 text-purple-700">
                          Vision: {visions.find((v: any) => v.id === note.linkedVisionId)?.title || "Linked"}
                        </span>
                      )}
                      {note.linkedGoalId && (
                        <span className="px-2 py-1 rounded bg-teal-50 border border-teal-200 text-teal-700">
                          Goal: {goals.find((g: any) => g.id === note.linkedGoalId)?.title || "Linked"}
                        </span>
                      )}
                      {note.linkedTaskId && (
                        <span className="px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-700">
                          Task: {tasks.find((t: any) => t.id === note.linkedTaskId)?.title || "Linked"}
                        </span>
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
                    <span className="font-medium">{formatDate(note.createdAt)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={(open: boolean) => {
        if (!open) {
          handleCloseCreateModal();
        }
      }}>
        <DialogContent className="backdrop-blur-xl bg-white/95 border-2 border-green-200/60 shadow-2xl shadow-green-900/20 rounded-3xl max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-r from-green-600 via-green-500 to-teal-500 p-6 rounded-t-3xl">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-2 ring-white/30">
                  <StickyNote className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-3xl font-bold text-white mb-1">
                    {editingNote ? "Edit Note" : "Create New Note"}
                  </DialogTitle>
                  <DialogDescription className="text-white/90 text-base font-medium">
                    Store your thoughts, research, or documentation with optional categorization and linking.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-8">
            <div className="space-y-2.5">
              <Label htmlFor="title" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-600 to-teal-500"></span>
                Title <span className="text-xs text-gray-500 font-normal">(Optional - auto-generated if blank)</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Brand guidelines research"
                className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all"
              />
              <p className="text-xs text-gray-500 font-medium">Give your note a title or leave blank for auto-generation</p>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="content" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-600 to-teal-500"></span>
                Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write down your thoughts, insights, or important information..."
                className="min-h-[160px] text-base border-gray-300 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all resize-none"
                required
              />
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-600 to-teal-500"></span>
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value: string) => setFormData({ ...formData, category: value as typeof categoryOptions[number] })}>
                <SelectTrigger className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500/20 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-600 to-teal-500"></span>
                  Link to Vision
                </Label>
                <Select value={formData.linkedVisionId} onValueChange={(value: string) => setFormData({ ...formData, linkedVisionId: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500/20 rounded-xl">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-600 to-teal-500"></span>
                  Link to Goal
                </Label>
                <Select value={formData.linkedGoalId} onValueChange={(value: string) => setFormData({ ...formData, linkedGoalId: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500/20 rounded-xl">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-600 to-teal-500"></span>
                  Link to Task
                </Label>
                <Select value={formData.linkedTaskId} onValueChange={(value: string) => setFormData({ ...formData, linkedTaskId: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500/20 rounded-xl">
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
              <Button type="submit" className="w-full sm:w-auto h-12 text-base font-bold bg-gradient-to-r from-green-600 via-green-500 to-teal-500 text-white hover:from-green-700 hover:via-green-600 hover:to-teal-600 shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-300 rounded-xl">
                {editingNote ? "Update Note" : "Create Note"}
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
                  placeholder="Search notes..."
                  autoFocus
                />
                {searchTerm && (
                  <p className="text-xs text-gray-500">{filteredNotes.length} results</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryOptions.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
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
