/**
 * main.jsx
 * React application entry point.
 *
 * Provider order matters:
 * 1. Redux Provider — must wrap everything since axiosInstance reads the store
 * 2. QueryClientProvider — TanStack Query cache, wraps the router
 * 3. AppRouter — React Router, all routes + layouts
 *
 * ReactQueryDevtools is included in development only (tree-shaken in production by Vite).
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { store } from "@/store";
import AppRouter from "@/routes/AppRouter";
import "@/index.css";

// ── QueryClient Configuration ────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // Data is fresh for 5 minutes
      gcTime: 1000 * 60 * 10,    // Keep unused data in cache for 10 minutes
      retry: 1,                   // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch when tab regains focus (can be noisy)
    },
    mutations: {
      retry: 0, // Don't retry mutations — could cause duplicate actions
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        {/* DevTools panel — only visible in development */}
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
