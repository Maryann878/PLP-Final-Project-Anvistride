import API from "@/lib/axios";

export interface VisionPayload {
  title: string;
  description: string;
  status?: "planning" | "active" | "paused" | "completed" | "evolved" | "archived";
  priority?: "low" | "medium" | "high" | "critical";
  horizonYears?: number;
  progress?: number;
  startDate?: string;
  targetDate?: string;
  tags?: string[];
  focusArea?: string;
}

export const getVisions = async (params?: { status?: string }) => {
  const res = await API.get("/visions", { params });
  return res.data;
};

export const createVision = async (data: VisionPayload) => {
  const res = await API.post("/visions", data);
  return res.data;
};

export const getVision = async (id: string) => {
  const res = await API.get(`/visions/${id}`);
  return res.data;
};

export const updateVision = async (id: string, data: Partial<VisionPayload>) => {
  const res = await API.put(`/visions/${id}`, data);
  return res.data;
};

export const deleteVision = async (id: string) => {
  const res = await API.delete(`/visions/${id}`);
  return res.data;
};

