import API from "../lib/axios";

export interface GoalData {
  title: string;
  description: string;
}

export const getGoals = async () => {
  const res = await API.get("/goals");
  return res.data;
};

export const createGoal = async (data: GoalData) => {
  const res = await API.post("/goals", data);
  return res.data;
};

export const updateGoal = async (id: string, data: GoalData) => {
  const res = await API.put(`/goals/${id}`, data);
  return res.data;
};

export const deleteGoal = async (id: string) => {
  const res = await API.delete(`/goals/${id}`);
  return res.data;
};
