/**
 * queryKeys.js
 * Central registry for all TanStack Query cache keys.
 *
 * Why: Prevents key string duplication and typos across useQuery/useMutation calls.
 * Using factory functions (not plain strings) enables precise cache invalidation.
 *
 * Pattern: Each domain has a base key array + factory functions for parameterized keys.
 *
 * Usage:
 *   useQuery({ queryKey: QUERY_KEYS.products.list({ category: "succulents" }) })
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all })
 */

export const QUERY_KEYS = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    me: ["auth", "me"],
  },

  // ── Users ─────────────────────────────────────────────────────────────────
  users: {
    all: ["users"],
    detail: (id) => ["users", id],
  },

  // ── Products ──────────────────────────────────────────────────────────────
  products: {
    all: ["products"],
    list: (filters) => ["products", "list", filters],
    detail: (id) => ["products", id],
    vendorProducts: ["products", "vendor"],
  },

  // ── Categories ────────────────────────────────────────────────────────────
  categories: {
    all: ["categories"],
    detail: (slug) => ["categories", slug],
  },

  // ── Wishlist ──────────────────────────────────────────────────────────────
  wishlist: {
    all: ["wishlist"],
  },

  // ── Cart ──────────────────────────────────────────────────────────────────
  cart: {
    all: ["cart"],
  },

  // ── Orders ────────────────────────────────────────────────────────────────
  orders: {
    all: ["orders"],
    list: (filters) => ["orders", "list", filters],
    detail: (id) => ["orders", id],
  },

  // ── Gardeners ─────────────────────────────────────────────────────────────
  gardeners: {
    all: ["gardeners"],
    list: (filters) => ["gardeners", "list", filters],
    detail: (id) => ["gardeners", id],
    slots: (gardenerId, date) => ["gardeners", gardenerId, "slots", date],
  },

  // ── Bookings ──────────────────────────────────────────────────────────────
  bookings: {
    all: ["bookings"],
    list: (filters) => ["bookings", "list", filters],
    detail: (id) => ["bookings", id],
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
  admin: {
    users: (filters) => ["admin", "users", filters],
    analytics: ["admin", "analytics"],
    pendingVendors: ["admin", "vendors", "pending"],
    pendingGardeners: ["admin", "gardeners", "pending"],
  },

  // ── AI ────────────────────────────────────────────────────────────────────
  ai: {
    diagnosisHistory: ["ai", "diagnosis"],
    chatHistory: (sessionId) => ["ai", "chat", sessionId],
  },
};
