import API from "@/lib/axios";

export interface NotificationPayload {
  type?: "system" | "reminder" | "update" | "achievement";
  title: string;
  message: string;
  priority?: "low" | "medium" | "high";
  actionUrl?: string;
  actionText?: string;
}

export interface NotificationResponse {
  notifications: any[];
  unreadCount: number;
}

export const getNotifications = async (params?: { isRead?: boolean; type?: string; limit?: number }) => {
  const res = await API.get<NotificationResponse>("/notifications", { params });
  return res.data;
};

export const getNotification = async (id: string) => {
  const res = await API.get(`/notifications/${id}`);
  return res.data;
};

export const createNotification = async (data: NotificationPayload) => {
  const res = await API.post("/notifications", data);
  return res.data;
};

export const markAsRead = async (id: string) => {
  const res = await API.put(`/notifications/${id}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await API.put("/notifications/read-all");
  return res.data;
};

export const deleteNotification = async (id: string) => {
  const res = await API.delete(`/notifications/${id}`);
  return res.data;
};

export const clearReadNotifications = async () => {
  const res = await API.delete("/notifications/read");
  return res.data;
};

