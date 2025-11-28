import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppContext } from "@/context/AppContext";
import { Recycle, RefreshCcw, Trash2, AlertCircle, Eye, Target, CheckSquare2, Lightbulb, StickyNote, BookOpen, Trophy } from "lucide-react";
import { getGlobalToast } from "@/lib/toast";
import { getRecycleBinItems, removeFromRecycleBin, type RecycleItem } from "@/lib/recycleBin";
import * as recycleBinAPI from "@/api/recycleBin";

const typeIcons = {
  vision: Eye,
  goal: Target,
  task: CheckSquare2,
  idea: Lightbulb,
  note: StickyNote,
  journal: BookOpen,
  achievement: Trophy,
};

const typeBadgeColors = {
  vision: "bg-purple-100 text-purple-700",
  goal: "bg-teal-100 text-teal-700",
  task: "bg-amber-100 text-amber-700",
  idea: "bg-purple-100 text-purple-700",
  note: "bg-green-100 text-green-700",
  journal: "bg-blue-100 text-blue-700",
  achievement: "bg-amber-100 text-amber-700",
};

export default function RecycleBinPage() {
  const { addVision, addGoal, addTask, addIdea, addNote, addJournal, addAchievement, goals, visions } = useAppContext();
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<RecycleItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deletedItems, setDeletedItems] = useState<RecycleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load deleted items from backend
  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        const items = await recycleBinAPI.getRecycleItems();
        setDeletedItems(items.map((item: any) => ({
          id: item._id || item.id,
          type: item.type,
          entityId: item.entityId,
          data: item.data,
          deletedAt: item.createdAt || item.deletedAt,
          metadata: {
            parentId: item.parentId,
            parentType: item.parentType,
            originalLocation: item.originalLocation,
          },
        })));
      } catch (error) {
        console.warn('Failed to load recycle bin from backend, using localStorage:', error);
        // Fallback to localStorage
        setDeletedItems(getRecycleBinItems());
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [refreshKey]);

  const refreshItems = () => {
    setRefreshKey(prev => prev + 1);
  };

  const restoreItem = async (item: RecycleItem) => {
    try {
      const toast = getGlobalToast();
      
      // Restore via backend API
      const result = await recycleBinAPI.restoreItem(item.id);
      
      if (result.restored) {
        // The backend has already restored it, just refresh
        refreshItems();
        
        const locationInfo = item.metadata?.originalLocation 
          ? ` (restored to ${item.metadata.originalLocation})`
          : item.metadata?.parentType 
          ? ` (restored under ${item.metadata.parentType})`
          : '';
        
        toast?.({
          title: "Success!",
          description: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} restored successfully${locationInfo}!`,
          variant: "default",
        });
      } else {
        // Fallback to local restore if backend doesn't return restored item
        switch (item.type) {
          case "vision":
            addVision(item.data);
            break;
          case "goal":
            addGoal(item.data);
            break;
          case "task":
            addTask(item.data);
            break;
          case "idea":
            addIdea(item.data);
            break;
          case "note":
            addNote(item.data);
            break;
          case "journal":
            addJournal(item.data);
            break;
          case "achievement":
            addAchievement(item.data);
            break;
        }
        refreshItems();
      }
    } catch (error) {
      console.error('Restore error:', error);
      const toast = getGlobalToast();
      toast?.({
        title: "Error",
        description: "Failed to restore item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deletePermanently = (item: RecycleItem) => {
    setItemToDelete(item);
    setShowConfirmDelete(true);
  };

  const confirmPermanentDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await recycleBinAPI.deleteRecycleItem(itemToDelete.id);
      refreshItems();
      
      const toast = getGlobalToast();
      toast?.({
        title: "Deleted",
        description: `${itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)} permanently deleted!`,
        variant: "default",
      });
      setShowConfirmDelete(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      // Fallback to local delete
      removeFromRecycleBin(itemToDelete.id);
      refreshItems();
      
      const toast = getGlobalToast();
      toast?.({
        title: "Deleted",
        description: `${itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)} permanently deleted!`,
        variant: "default",
      });
      setShowConfirmDelete(false);
      setItemToDelete(null);
    }
  };

  const getParentInfo = (item: RecycleItem): string | null => {
    if (!item.metadata?.parentId || !item.metadata?.parentType) return null;
    
    const parentType = item.metadata.parentType;
    const parentId = item.metadata.parentId;
    
    if (parentType === 'goal') {
      const parent = goals.find(g => g.id === parentId);
      return parent ? `Goal: ${parent.title}` : null;
    }
    if (parentType === 'vision') {
      const parent = visions.find(v => v.id === parentId);
      return parent ? `Vision: ${parent.title}` : null;
    }
    
    return `${parentType}: ${parentId}`;
  };

  const renderItemSummary = (item: RecycleItem) => {
    const data = item.data;
    
    switch (item.type) {
      case "vision":
        return (
          <>
            <p className="font-semibold text-gray-900">{data.title}</p>
            {data.description && <p className="text-gray-600 text-sm">{data.description}</p>}
            {data.timeframe && <p className="text-xs text-gray-500">Timeframe: {data.timeframe}</p>}
          </>
        );
      case "goal":
        return (
          <>
            <p className="font-semibold text-gray-900">{data.title}</p>
            {data.description && <p className="text-gray-600 text-sm">{data.description}</p>}
            {data.progress !== undefined && <p className="text-xs text-gray-500">Progress: {data.progress}%</p>}
          </>
        );
      case "task":
        return (
          <>
            <p className="font-semibold text-gray-900">{data.title || "Untitled Task"}</p>
            {data.description && <p className="text-gray-600 text-sm">{data.description}</p>}
            <p className="text-xs text-gray-500">{data.priority} Priority • {data.status}</p>
          </>
        );
      case "idea":
        return (
          <>
            <p className="font-semibold text-gray-900">{data.title || "Untitled Idea"}</p>
            {data.description && <p className="text-gray-600 text-sm">{data.description}</p>}
            {data.category && <p className="text-xs text-gray-500">Category: {data.category}</p>}
          </>
        );
      case "note":
        return (
          <>
            <p className="font-semibold text-gray-900">{data.title || "Untitled Note"}</p>
            <p className="text-gray-600 text-sm line-clamp-2">{data.content}</p>
          </>
        );
      case "journal":
        return (
          <>
            <p className="font-semibold text-gray-900">{data.title || "Untitled Entry"}</p>
            <p className="text-gray-600 text-sm line-clamp-2">{data.content}</p>
            {data.mood && <p className="text-xs text-gray-500">Mood: {data.mood}</p>}
          </>
        );
      case "achievement":
        return (
          <>
            <p className="font-semibold text-gray-900">{data.title}</p>
            {data.description && <p className="text-gray-600 text-sm">{data.description}</p>}
            {data.date && <p className="text-xs text-gray-500">Date: {new Date(data.date).toLocaleDateString()}</p>}
          </>
        );
      default:
        return <p className="text-gray-600">Unknown item type</p>;
    }
  };

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Enhanced Header - Modern & Professional */}
      <div className="relative">
        <div className={`${glassClass} p-6 sm:p-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Enhanced Icon with glow effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-teal-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/30 ring-2 ring-white/20 group-hover:scale-105 transition-transform duration-300">
                  <Recycle className="h-7 w-7 sm:h-8 sm:w-8 " />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent mb-2 tracking-tight leading-tight">
                  Recycle Bin
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Restore deleted items or permanently remove them</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border-2 border-amber-200 text-amber-800">
        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed">
          Items stay here until you permanently delete them. Restoring will return them to their respective pages with original data intact.
        </p>
      </div>

      {/* Stats */}
      <Card className={glassClass}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deleted Items</p>
              <p className="text-3xl font-bold text-gray-900">{deletedItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <Recycle className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deleted Items List */}
      {deletedItems.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Recycle className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Recycle Bin is Empty</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Deleted items will appear here. You can restore them or permanently delete them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {deletedItems.map((item) => {
            const TypeIcon = typeIcons[item.type] || typeIcons.vision;
            
            return (
              <Card key={item.id} className={`${glassClass} hover:shadow-xl transition-all duration-300 border-l-4 ${item.type === 'vision' ? 'border-l-purple-500' : item.type === 'goal' ? 'border-l-teal-500' : item.type === 'task' ? 'border-l-amber-500' : 'border-l-gray-400'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-5 w-5 text-gray-600" />
                      <Badge className={typeBadgeColors[item.type] || "bg-gray-100 text-gray-700"}>
                        {item.type}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      Deleted {new Date(item.deletedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {renderItemSummary(item)}
                  {getParentInfo(item) && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">From:</span> {getParentInfo(item)}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-4 border-t border-gray-200 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => restoreItem(item)}
                    className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <RefreshCcw className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deletePermanently(item)}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete Forever
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirm Permanent Delete Modal */}
      <Dialog open={showConfirmDelete} onOpenChange={(open) => {
        if (!open) {
          setShowConfirmDelete(false);
        }
      }}>
        <DialogContent className={`${glassClass} rounded-2xl max-w-md mx-auto`}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-red-900">Confirm Permanent Deletion</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to permanently delete this {itemToDelete?.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {itemToDelete && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="font-semibold text-red-900">{itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)}: "{itemToDelete.data.title || itemToDelete.data.content}"</p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDelete(false);
                setItemToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPermanentDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
