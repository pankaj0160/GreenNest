/**
 * store/index.js
 * Redux Toolkit store configuration.
 *
 * Design decisions:
 * - Named export `store` so it can be imported in axiosInstance.js without
 *   circular dependency issues (axiosInstance is NOT imported into the store).
 * - Slices are organized by domain — each slice owns its own state shape.
 * - Redux DevTools is automatically enabled in development by RTK.
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    // Phase 2+: add more slices here as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for now — we'll handle Date objects in slices
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;
