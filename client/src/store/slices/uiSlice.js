/**
 * uiSlice.js
 * Global UI state that doesn't belong to a specific domain.
 * - Toast notifications
 * - Modal open/close states
 * - Mobile sidebar visibility
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Toast queue
  toasts: [], // [{ id, type: 'success'|'error'|'warning'|'info', message, duration }]

  // Mobile sidebar
  isSidebarOpen: false,

  // Global loading overlay (for full-page operations)
  isGlobalLoading: false,
};

let toastIdCounter = 0;

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addToast: (state, action) => {
      const { type = "info", message, duration = 4000 } = action.payload;
      state.toasts.push({
        id: ++toastIdCounter,
        type,
        message,
        duration,
      });
    },

    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },

    clearAllToasts: (state) => {
      state.toasts = [];
    },

    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },

    setGlobalLoading: (state, action) => {
      state.isGlobalLoading = action.payload;
    },
  },
});

export const {
  addToast,
  removeToast,
  clearAllToasts,
  toggleSidebar,
  closeSidebar,
  setGlobalLoading,
} = uiSlice.actions;

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectToasts = (state) => state.ui.toasts;
export const selectIsSidebarOpen = (state) => state.ui.isSidebarOpen;
export const selectIsGlobalLoading = (state) => state.ui.isGlobalLoading;

// ── Toast helpers (convenience action creators) ──────────────────────────────
export const showSuccessToast = (message) =>
  addToast({ type: "success", message });
export const showErrorToast = (message) =>
  addToast({ type: "error", message });
export const showInfoToast = (message) =>
  addToast({ type: "info", message });
export const showWarningToast = (message) =>
  addToast({ type: "warning", message });

export default uiSlice.reducer;
