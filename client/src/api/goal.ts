import API from "@/lib/axios";

export interface GoalPayload {
  title: string;
  description: string;
  deadline?: string;
  status?: "not_started" | "in_progress" | "completed" | "paused";
  progress?: number;
  priority?: "low" | "medium" | "high" | "critical";
  vision?: string | null;
  tags?: string[];
  metrics?: {
    label: string;
    target: number;
    current?: number;
    unit?: string;
  }[];
}

export const getGoals = async (params?: { status?: string; visionId?: string }) => {
  const res = await API.get("/goals", { params });
  return res.data;
};

export const createGoal = async (data: GoalPayload) => {
  const res = await API.post("/goals", data);
  return res.data;
};

export const updateGoal = async (id: string, data: Partial<GoalPayload>) => {
  const res = await API.put(`/goals/${id}`, data);
  return res.data;
};

export const deleteGoal = async (id: string) => {
  const res = await API.delete(`/goals/${id}`);
  return res.data;
};
