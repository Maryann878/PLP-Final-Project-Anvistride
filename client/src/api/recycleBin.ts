import API from "@/lib/axios";

export interface RecycleItem {
  id: string;
  type: "vision" | "goal" | "task" | "idea" | "note" | "journal" | "achievement";
  entityId: string;
  data: any;
  parentId?: string;
  parentType?: string;
  originalLocation?: string;
  createdAt: string;
}

export interface CreateRecycleItemPayload {
  type: "vision" | "goal" | "task" | "idea" | "note" | "journal" | "achievement";
  entityId: string;
  data: any;
  parentId?: string;
  parentType?: string;
  originalLocation?: string;
}

export const createRecycleItem = async (data: CreateRecycleItemPayload) => {
  const res = await API.post("/recycle", data);
  return res.data;
};

export const getRecycleItems = async (params?: { type?: string }) => {
  const res = await API.get("/recycle", { params });
  return res.data;
};

export const getRecycleItem = async (id: string) => {
  const res = await API.get(`/recycle/${id}`);
  return res.data;
};

export const restoreItem = async (id: string) => {
  const res = await API.post(`/recycle/${id}/restore`);
  return res.data;
};

export const deleteRecycleItem = async (id: string) => {
  const res = await API.delete(`/recycle/${id}`);
  return res.data;
};

export const clearRecycleBin = async () => {
  const res = await API.delete("/recycle");
  return res.data;
};

