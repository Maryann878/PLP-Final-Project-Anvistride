import API from "@/lib/axios";

export interface JournalPayload {
  entryDate?: string;
  mood?: "very_low" | "low" | "neutral" | "good" | "great";
  summary?: string;
  highlights?: string[];
  gratitude?: string[];
  lessons?: string[];
  nextSteps?: string[];
}

export const getJournalEntries = async (params?: { from?: string; to?: string }) => {
  const res = await API.get("/journal", { params });
  return res.data;
};

export const createJournalEntry = async (payload: JournalPayload) => {
  const res = await API.post("/journal", payload);
  return res.data;
};

export const updateJournalEntry = async (id: string, payload: Partial<JournalPayload>) => {
  const res = await API.put(`/journal/${id}`, payload);
  return res.data;
};

export const deleteJournalEntry = async (id: string) => {
  const res = await API.delete(`/journal/${id}`);
  return res.data;
};

