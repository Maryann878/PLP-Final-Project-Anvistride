import API from "../lib/axios";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: LoginData) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

export interface VerifyEmailData {
  token: string;
}

export const verifyEmail = async (data: VerifyEmailData) => {
  const res = await API.post("/auth/verify-email", data);
  return res.data;
};

export interface ResendVerificationData {
  email: string;
}

export const resendVerificationEmail = async (data: ResendVerificationData) => {
  const res = await API.post("/auth/resend-verification", data);
  return res.data;
};

export interface ForgotPasswordData {
  email: string;
}

export const forgotPassword = async (data: ForgotPasswordData) => {
  const res = await API.post("/auth/forgot-password", data);
  return res.data;
};

export interface ResetPasswordData {
  token: string;
  password: string;
}

export const resetPassword = async (data: ResetPasswordData) => {
  const res = await API.post("/auth/reset-password", data);
  return res.data;
};