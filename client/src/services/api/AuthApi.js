import axiosInstance from "@/services/axiosInstance";

export const signupApi = (data) =>
  axiosInstance.post("/auth/signup", data).then((r) => r.data);

export const verifyEmailApi = (data) =>
  axiosInstance.post("/auth/verify-email", data).then((r) => r.data);

export const resendVerificationApi = (data) =>
  axiosInstance.post("/auth/resend-verification", data).then((r) => r.data);

export const loginApi = (data) =>
  axiosInstance.post("/auth/login", data).then((r) => r.data);

export const logoutApi = () =>
  axiosInstance.post("/auth/logout").then((r) => r.data);

export const getMeApi = () =>
  axiosInstance.get("/auth/me").then((r) => r.data);

export const forgotPasswordApi = (data) =>
  axiosInstance.post("/auth/forgot-password", data).then((r) => r.data);

export const resetPasswordApi = (data) =>
  axiosInstance.post("/auth/reset-password", data).then((r) => r.data);

export const deleteUnverifiedAccountApi = (data) =>
  axiosInstance.post("/auth/delete-unverified", data).then((r) => r.data);