import API from "@/lib/axios";

export interface AchievementPayload {
  title: string;
  description?: string;
  achievedOn?: string;
  relatedVision?: string | null;
  relatedGoal?: string | null;
  visibility?: "private" | "connections" | "public";
  evidenceUrl?: string;
  impactScore?: number;
}

export const getAchievements = async (params?: {
  visionId?: string;
  goalId?: string;
  visibility?: string;
}) => {
  const res = await API.get("/achievements", { params });
  return res.data;
};

export const createAchievement = async (payload: AchievementPayload) => {
  const res = await API.post("/achievements", payload);
  return res.data;
};

export const updateAchievement = async (id: string, payload: Partial<AchievementPayload>) => {
  const res = await API.put(`/achievements/${id}`, payload);
  return res.data;
};

export const deleteAchievement = async (id: string) => {
  const res = await API.delete(`/achievements/${id}`);
  return res.data;
};

