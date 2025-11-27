import API from "@/lib/axios";

export interface IdeaPayload {
  title?: string;
  description?: string;
  status?: "draft" | "exploring" | "ready" | "implemented" | "archived";
  priority?: "low" | "medium" | "high";
  category?: string;
  linkedVision?: string;
  linkedGoal?: string;
  linkedTask?: string;
  implementationNotes?: string;
}

export const getIdeas = async (params?: { status?: string; priority?: string; category?: string }) => {
  const res = await API.get("/ideas", { params });
  return res.data;
};

export const getIdea = async (id: string) => {
  const res = await API.get(`/ideas/${id}`);
  return res.data;
};

export const createIdea = async (data: IdeaPayload) => {
  const res = await API.post("/ideas", data);
  return res.data;
};

export const updateIdea = async (id: string, data: Partial<IdeaPayload>) => {
  const res = await API.put(`/ideas/${id}`, data);
  return res.data;
};

export const deleteIdea = async (id: string) => {
  const res = await API.delete(`/ideas/${id}`);
  return res.data;
};

