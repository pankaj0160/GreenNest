/**
 * healthApi.js
 * API service for the health check endpoint.
 * Used in Phase 1 to verify frontend-backend connectivity.
 */

import axiosInstance from "@/services/axiosInstance";

export const checkHealth = async () => {
  const response = await axiosInstance.get("/health");
  return response.data;
};
