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
import { Search, Filter, BookOpen, Edit3, Trash2, ChevronDown, ChevronUp, PlusCircle, Plus, X, Calendar, Smile, Heart } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { getGlobalToast } from "@/lib/toast";
import type { JournalEntryType } from "@/types";

const moodOptions = ["happy", "neutral", "sad", "excited", "stressed", "grateful", "proud", "anxious", "peaceful", "motivated", "tired", "confused", "angry", "hopeful", "lonely", "confident"] as const;

const moodIcons: Record<JournalEntryType["mood"], string> = {
  happy: "😊",
  neutral: "😐",
  sad: "😢",
  excited: "🤩",
  stressed: "😰",
  grateful: "🙏",
  proud: "💪",
  anxious: "😟",
  peaceful: "😌",
  motivated: "🔥",
  tired: "😴",
  confused: "🤔",
  angry: "😠",
  hopeful: "✨",
  lonely: "😔",
  confident: "😎",
};

const moodColors: Record<JournalEntryType["mood"], string> = {
  happy: "bg-green-100 text-green-700",
  neutral: "bg-gray-100 text-gray-700",
  sad: "bg-blue-100 text-blue-700",
  excited: "bg-orange-100 text-orange-700",
  stressed: "bg-red-100 text-red-700",
  grateful: "bg-emerald-100 text-emerald-700",
  proud: "bg-orange-100 text-orange-800",
  anxious: "bg-yellow-100 text-yellow-700",
  peaceful: "bg-cyan-100 text-cyan-700",
  motivated: "bg-pink-100 text-pink-700",
  tired: "bg-brown-100 text-brown-700",
  confused: "bg-slate-100 text-slate-700",
  angry: "bg-red-200 text-red-800",
  hopeful: "bg-purple-100 text-purple-700",
  lonely: "bg-indigo-100 text-indigo-700",
  confident: "bg-amber-100 text-amber-700",
};

const commonTags = ["work", "family", "health", "goals", "achievements", "gratitude", "reflection", "learning", "challenges", "plans", "relationship", "travel", "hobbies", "finance", "spirituality", "creativity"];

export default function JournalPage() {
  const { journal, visions, goals, tasks, addJournal, updateJournal, deleteJournal } = useAppContext();

  // States
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntryType | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split('T')[0],
    mood: "neutral" as JournalEntryType["mood"],
    tags: [] as string[],
    linkedVisionId: "",
    linkedGoalId: "",
    linkedTaskId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | "all">("all");
  const [selectedTag, setSelectedTag] = useState<string | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);
  
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

  // All unique tags from entries
  const allTags = useMemo(() => {
    const tags = journal.flatMap((entry: any) => entry.tags || []);
    return Array.from(new Set(tags)).filter(Boolean);
  }, [journal]);

  // Filtered journal entries
  const filteredEntries = useMemo(() => {
    let filtered = journal;

    if (debouncedSearch) {
      filtered = filtered.filter((entry: any) => 
        entry.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        entry.content.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        entry.tags?.some((tag: string) => tag.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
    }

    if (selectedMood !== "all") {
      filtered = filtered.filter((entry: any) => entry.mood === selectedMood);
    }

    if (selectedTag !== "all") {
      filtered = filtered.filter((entry: any) => entry.tags?.includes(selectedTag));
    }

    if (selectedDate) {
      filtered = filtered.filter((entry: any) => entry.date === selectedDate);
    }

    return filtered;
  }, [journal, debouncedSearch, selectedMood, selectedTag, selectedDate]);

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedMood !== "all") count++;
    if (selectedTag !== "all") count++;
    if (selectedDate) count++;
    if (searchTerm) count++;
    return count;
  };

  // Handlers
  const handleCancelEdit = () => {
    setEditingEntry(null);
    setFormData({ title: "", content: "", date: new Date().toISOString().split('T')[0], mood: "neutral", tags: [], linkedVisionId: "", linkedGoalId: "", linkedTaskId: "" });
    setTagInput("");
    setShowCustomTagInput(false);
  };

  const openCreateModal = () => {
    handleCancelEdit();
    setShowModal(true);
  };

  const openEditModal = (entry: JournalEntryType) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title || "",
      content: entry.content,
      date: entry.date,
      mood: entry.mood,
      tags: entry.tags || [],
      linkedVisionId: entry.linkedVisionId?.toString() || "",
      linkedGoalId: entry.linkedGoalId?.toString() || "",
      linkedTaskId: entry.linkedTaskId?.toString() || "",
    });
    setShowModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowModal(false);
    handleCancelEdit();
  };

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
    setTagInput("");
    setShowCustomTagInput(false);
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    // Auto-generate title if empty
    const entryTitle = formData.title.trim() || `Journal Entry ${journal.length + 1}`;

    const submitData = {
      ...formData,
      title: entryTitle,
      linkedVisionId: formData.linkedVisionId === "" ? undefined : formData.linkedVisionId,
      linkedGoalId: formData.linkedGoalId === "" ? undefined : formData.linkedGoalId,
      linkedTaskId: formData.linkedTaskId === "" ? undefined : formData.linkedTaskId,
      updatedAt: new Date().toISOString(),
    };

    if (editingEntry) {
      updateJournal(editingEntry.id, submitData);
    } else {
      const newEntry: JournalEntryType = {
        id: Date.now().toString(),
        title: entryTitle,
        content: formData.content,
        date: formData.date,
        mood: formData.mood,
        tags: formData.tags,
        linkedVisionId: formData.linkedVisionId || undefined,
        linkedGoalId: formData.linkedGoalId || undefined,
        linkedTaskId: formData.linkedTaskId || undefined,
        createdAt: new Date().toISOString(),
      };
      addJournal(newEntry);
    }

    setShowModal(false);
    handleCancelEdit();
  };

  const handleDelete = (id: string) => {
    const journalEntry = journal.find((j) => j.id === id);
    deleteJournal(id);
    const toast = getGlobalToast();
    if (toast) {
      toast({
        title: "Journal entry deleted",
        description: journalEntry?.title ? `"${journalEntry.title}" has been deleted.` : "Journal entry has been deleted.",
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
      <Card className={`${glassClass} border-blue-200/50`}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-400 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 ring-2 ring-white/20">
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-2 tracking-tight leading-tight">
                  Daily Journal
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  Reflect on your day and track your mood
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Statistics - Compact */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50">
          <BookOpen className="h-4 w-4 text-blue-600" />
          <span className="text-lg font-bold text-gray-900">{journal.length}</span>
          <span className="text-xs text-gray-600 font-medium">Total Entries</span>
        </div>
        <Button 
          onClick={openCreateModal} 
          className="hidden sm:flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <PlusCircle className="h-5 w-5" />
          New Entry
        </Button>
      </div>

      {/* Filters & Search - Only show when items exist */}
      {journal.length > 0 && (
        <Card className={glassClass}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search journal entries..."
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
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    placeholder="Filter by date"
                  />
                </div>
                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Moods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Moods</SelectItem>
                    {moodOptions.map(mood => (
                      <SelectItem key={mood} value={mood}>
                        {moodIcons[mood]} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag: string) => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats - Only show when items exist */}
      {journal.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{journal.length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Total Entries</p>
          </CardContent>
        </Card>
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Smile className="h-6 w-6 text-teal-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{journal.length > 0 ? journal[0].mood : "neutral"}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Latest Mood</p>
          </CardContent>
        </Card>
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Heart className="h-6 w-6 text-pink-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{journal.filter((e: any) => e.tags?.includes("gratitude")).length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Gratitude Logged</p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Journal Entries or Empty State */}
      {filteredEntries.length === 0 && journal.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Journal Entries Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your journaling journey by capturing your first reflection.
            </p>
            <Button onClick={openCreateModal} className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-8 py-3 rounded-xl shadow-lg">
              Create Your First Entry
            </Button>
          </CardContent>
        </Card>
      ) : filteredEntries.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Entries Match Your Filters</h3>
            <p className="text-gray-600">Try adjusting your search or clear filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredEntries.map((entry: any) => {
            const isExpanded = expandedContent === entry.id;
            const displayContent = isExpanded ? entry.content : (entry.content || "").substring(0, 100) + "...";

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
              <Card key={entry.id} className={`${glassClass} hover:shadow-lg transition-all duration-300 border border-gray-200/80 overflow-hidden flex flex-col`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-teal-500"></div>
                {/* Header Section */}
                <CardHeader className="pb-3 px-5 pt-5">
                  <div className="flex justify-between items-start gap-2 sm:gap-3">
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex-1 leading-tight pr-2">{entry.title || "Untitled Entry"}</CardTitle>
                    <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => openEditModal(entry)}
                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                        title="Edit Entry"
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(entry.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 text-red-600 hover:text-red-700"
                        title="Delete Entry"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge className={`${moodColors[entry.mood as keyof typeof moodColors] || "bg-gray-100 text-gray-700"} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                      <span className="mr-1">{moodIcons[entry.mood as keyof typeof moodIcons]}</span>
                      {entry.mood}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 rounded-full border-blue-200 text-blue-700 bg-blue-50">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Badge>
                  </div>
                </CardHeader>

                {/* Description */}
                <CardContent className="px-5 pt-0 pb-4 flex-1">
                  {entry.content && (
                    <div 
                      className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-3 p-4 rounded-lg bg-purple-50/50 border-l-4 border-purple-500"
                    >
                      {displayContent}
                      {entry.content.length > 100 && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => toggleContent(entry.id)} 
                          className="h-auto p-0 ml-1 text-purple-600 font-medium text-sm"
                        >
                          {isExpanded ? "Show Less" : "...Read More"}
                        </Button>
                      )}
                    </div>
                  )}
                  {!entry.content && (
                    <p className="text-sm text-gray-400 italic">No content</p>
                  )}
                </CardContent>

                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="px-5 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs font-semibold px-2.5 py-1 rounded-full text-purple-600 border-purple-200 bg-purple-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Linked Items */}
                {(entry.linkedVisionId || entry.linkedGoalId || entry.linkedTaskId) && (
                  <div className="px-5 pb-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {entry.linkedVisionId && (
                        <span className="px-2 py-1 rounded bg-purple-50 border border-purple-200 text-purple-700">
                          Vision: {visions.find((v: any) => v.id === entry.linkedVisionId)?.title || "Linked"}
                        </span>
                      )}
                      {entry.linkedGoalId && (
                        <span className="px-2 py-1 rounded bg-teal-50 border border-teal-200 text-teal-700">
                          Goal: {goals.find((g: any) => g.id === entry.linkedGoalId)?.title || "Linked"}
                        </span>
                      )}
                      {entry.linkedTaskId && (
                        <span className="px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-700">
                          Task: {tasks.find((t: any) => t.id === entry.linkedTaskId)?.title || "Linked"}
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
                    <span className="font-medium">{formatDate(entry.createdAt)}</span>
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
        <DialogContent className="backdrop-blur-xl bg-white/95 border-2 border-blue-200/60 shadow-2xl shadow-blue-900/20 rounded-3xl max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 p-6 rounded-t-3xl">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-2 ring-white/30">
                  <BookOpen className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-3xl font-bold text-white mb-1">
                    {editingEntry ? "Edit Journal Entry" : "Create New Journal Entry"}
                  </DialogTitle>
                  <DialogDescription className="text-white/90 text-base font-medium">
                    Reflect on your day, track your mood, and capture your thoughts.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-8">
            <div className="space-y-2.5">
              <Label htmlFor="date" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-500"></span>
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all"
                required
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="title" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-500"></span>
                Title <span className="text-xs text-gray-500 font-normal">(Optional - auto-generated if blank)</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What's on your mind today?"
                className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all"
              />
              <p className="text-xs text-gray-500 font-medium">Give your entry a title or leave blank for auto-generation</p>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="content" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-500"></span>
                Your Thoughts <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write about your day, thoughts, feelings, or anything you want to remember..."
                className="min-h-[160px] text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all resize-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-500"></span>
                  How are you feeling?
                </Label>
                <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value as typeof moodOptions[number] })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {moodOptions.map(mood => (
                      <SelectItem key={mood} value={mood}>
                        {moodIcons[mood]} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-500"></span>
                  Tags
                </Label>
                <div className="flex gap-2">
                  <Select value={tagInput} onValueChange={(value) => {
                    if (value === "custom") {
                      setShowCustomTagInput(true);
                      setTagInput("");
                    } else {
                      handleAddTag(value);
                    }
                  }}>
                    <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
                      <SelectValue placeholder="Select or add tag" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {commonTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                      <SelectItem value="custom">+ Add Custom Tag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {showCustomTagInput && (
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Enter custom tag"
                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => handleAddTag(tagInput)}
                  disabled={!tagInput.trim()}
                  className="h-12 px-4"
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-12 w-12"
                  onClick={() => {
                    setShowCustomTagInput(false);
                    setTagInput("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-red-300 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-500"></span>
                  Link to Vision
                </Label>
                <Select value={formData.linkedVisionId} onValueChange={(value) => setFormData({ ...formData, linkedVisionId: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-500"></span>
                  Link to Goal
                </Label>
                <Select value={formData.linkedGoalId} onValueChange={(value) => setFormData({ ...formData, linkedGoalId: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-500"></span>
                  Link to Task
                </Label>
                <Select value={formData.linkedTaskId} onValueChange={(value) => setFormData({ ...formData, linkedTaskId: value })}>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
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
              <Button type="submit" className="w-full sm:w-auto h-12 text-base font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 text-white hover:from-blue-700 hover:via-blue-600 hover:to-purple-600 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 rounded-xl">
                {editingEntry ? "Update Entry" : "Create Entry"}
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
          aria-label="Create new journal entry"
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
                  placeholder="Search entries..."
                  autoFocus
                />
                {searchTerm && (
                  <p className="text-xs text-gray-500">{filteredEntries.length} results</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Mood</Label>
                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Moods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Moods</SelectItem>
                    {moodOptions.map(mood => (
                      <SelectItem key={mood} value={mood}>
                        {moodIcons[mood]} {mood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Tag</Label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag: string) => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedMood("all");
                  setSelectedTag("all");
                  setSelectedDate("");
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
