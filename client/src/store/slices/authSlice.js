/**
 * authSlice.js
 * Redux slice for authentication state.
 *
 * State shape:
 * {
 *   user: { _id, name, email, role, avatar, isEmailVerified } | null,
 *   token: string | null,   ← JWT access token (in-memory, not localStorage)
 *   isAuthenticated: boolean,
 *   isLoading: boolean,     ← for login/signup requests
 *   isInitialized: boolean, ← true after getMe() resolves on app load
 * }
 *
 * isInitialized prevents the app from flickering between "unauthenticated"
 * and "authenticated" while the getMe() call is in flight on page load.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false, // Has the initial auth check completed?
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called when login/signup API returns successfully
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isInitialized = true;
    },

    // Called when getMe() resolves — user was already logged in (cookie auth)
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.isLoading = false;
    },

    // Called after logout API or 401 from interceptor
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isInitialized = true;
    },

    // Mark auth check as complete even if not authenticated
    setInitialized: (state) => {
      state.isInitialized = true;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Update user profile fields without a full re-auth
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setCredentials,
  setUser,
  logoutUser,
  setInitialized,
  setLoading,
  updateUserProfile,
} = authSlice.actions;

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthLoading = (state) => state.auth.isLoading;
export const selectIsInitialized = (state) => state.auth.isInitialized;
export const selectUserRole = (state) => state.auth.user?.role;

export default authSlice.reducer;
