import API from "@/lib/axios";

export interface TaskPayload {
  title: string;
  description?: string;
  goal?: string | null;
  status?: "not_started" | "in_progress" | "completed" | "blocked";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  reminder?: string;
  estimatedMinutes?: number;
  tags?: string[];
  checklists?: { label: string; done?: boolean }[];
  isStandalone?: boolean;
}

export const getTasks = async (params?: { goalId?: string; status?: string; standalone?: string }) => {
  const res = await API.get("/tasks", { params });
  return res.data;
};

export const createTask = async (data: TaskPayload) => {
  const res = await API.post("/tasks", data);
  return res.data;
};

export const getTask = async (id: string) => {
  const res = await API.get(`/tasks/${id}`);
  return res.data;
};

export const updateTask = async (id: string, data: Partial<TaskPayload>) => {
  const res = await API.put(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id: string) => {
  const res = await API.delete(`/tasks/${id}`);
  return res.data;
};

