import API from "@/lib/axios";

export interface ProfileInput {
  username?: string;
  avatar?: string;
  profileImage?: string; // Frontend uses profileImage, backend uses avatar
  coverImage?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  focusAreas?: string[];
  strengths?: string[];
  preferredGoalView?: "board" | "timeline" | "list";
  remindersEnabled?: boolean;
  notificationPreferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export const getMyProfile = async () => {
  const res = await API.get("/profile/me");
  return res.data;
};

export const updateMyProfile = async (data: ProfileInput) => {
  const res = await API.put("/profile/me", data);
  return res.data;
};

