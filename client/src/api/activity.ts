import API from "@/lib/axios";

export interface ActivityPayload {
  type: "add" | "update" | "delete";
  entity: string;
  itemId: string;
  itemTitle?: string;
  action?: string;
}

export const getActivities = async (params?: { entity?: string; type?: string; limit?: number }) => {
  const res = await API.get("/activities", { params });
  return res.data;
};

export const createActivity = async (data: ActivityPayload) => {
  const res = await API.post("/activities", data);
  return res.data;
};

export const clearActivities = async () => {
  const res = await API.delete("/activities");
  return res.data;
};

