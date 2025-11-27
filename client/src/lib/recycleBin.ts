/**
 * Recycle Bin Utility
 * Handles saving deleted items to recycle bin with metadata for restoration
 */

import * as recycleBinAPI from '@/api/recycleBin';

export type RecycleItemType = "vision" | "goal" | "task" | "idea" | "note" | "journal" | "achievement";

export interface RecycleItem {
  id: string;
  type: RecycleItemType;
  data: any; // The full item data
  deletedAt: string;
  metadata?: {
    // Store relationship information for restoration
    parentId?: string; // e.g., goalId for tasks, visionId for goals
    parentType?: string; // e.g., "goal" for tasks, "vision" for goals
    originalLocation?: string; // e.g., "goals/123/tasks" for tasks under goals
    [key: string]: any; // Allow additional metadata
  };
}

const STORAGE_KEY = 'anvistride-deleted-items';

/**
 * Save an item to the recycle bin
 */
export const saveToRecycleBin = async (
  item: any,
  type: RecycleItemType,
  metadata?: RecycleItem['metadata']
): Promise<void> => {
  try {
    // Save to backend
    await recycleBinAPI.createRecycleItem({
      type,
      entityId: item.id || item._id || Date.now().toString(),
      data: { ...item }, // Deep copy to preserve all data
      parentId: metadata?.parentId,
      parentType: metadata?.parentType,
      originalLocation: metadata?.originalLocation,
    });
  } catch (error) {
    console.error('Error saving to recycle bin (backend):', error);
    // Fallback to localStorage
    try {
      const deletedItems = getRecycleBinItems();
      
      const recycleItem: RecycleItem = {
        id: item.id || Date.now().toString(),
        type,
        data: { ...item }, // Deep copy to preserve all data
        deletedAt: new Date().toISOString(),
        metadata: metadata || {},
      };
      
      deletedItems.push(recycleItem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deletedItems));
    } catch (localError) {
      console.error('Error saving to recycle bin (localStorage):', localError);
    }
  }
};

/**
 * Get all items from recycle bin
 */
export const getRecycleBinItems = (): RecycleItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error reading recycle bin:', error);
    return [];
  }
};

/**
 * Remove an item from recycle bin (after restore or permanent delete)
 */
export const removeFromRecycleBin = (id: string): void => {
  try {
    const deletedItems = getRecycleBinItems();
    const updated = deletedItems.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing from recycle bin:', error);
  }
};

/**
 * Clear all items from recycle bin
 */
export const clearRecycleBin = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recycle bin:', error);
  }
};

/**
 * Get items by type
 */
export const getRecycleBinItemsByType = (type: RecycleItemType): RecycleItem[] => {
  return getRecycleBinItems().filter(item => item.type === type);
};

