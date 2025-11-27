import API from "@/lib/axios";

export interface NotePayload {
  title?: string;
  content: string;
  tags?: string[];
  pinned?: boolean;
  relatedVision?: string | null;
  relatedGoal?: string | null;
  relatedTask?: string | null;
}

export const getNotes = async (params?: {
  tag?: string;
  pinned?: string;
  visionId?: string;
  goalId?: string;
  taskId?: string;
}) => {
  const res = await API.get("/notes", { params });
  return res.data;
};

export const createNote = async (payload: NotePayload) => {
  const res = await API.post("/notes", payload);
  return res.data;
};

export const updateNote = async (id: string, payload: Partial<NotePayload>) => {
  const res = await API.put(`/notes/${id}`, payload);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await API.delete(`/notes/${id}`);
  return res.data;
};

