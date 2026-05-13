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
    // Broadest key — invalidate to refetch everything product-related
    all: ["products"],

    // Public listing with filters/sort/pagination.
    // Each unique filters object gets its own cache entry.
    // Usage: QUERY_KEYS.products.list({ category: "indoor-plants", page: 2 })
    list: (filters) => ["products", "list", filters],

    // Single product by id or slug
    detail: (id) => ["products", id],

    // Vendor's own product list — supports pagination/sort params.
    // Changed from static array to factory fn so different pages/sorts
    // don't collide in the cache.
    // Usage: QUERY_KEYS.products.vendorList({ page: 1, sort: "newest" })
    vendorList: (params) => ["products", "vendor", params],

    // Static key for invalidating ALL vendor product queries at once
    // Usage: queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.vendor })
    vendor: ["products", "vendor"],
  },

  // ── Categories ────────────────────────────────────────────────────────────
  categories: {
    // Broadest key — invalidate to refetch all category queries
    all: ["categories"],

    // Public active category list (alphabetical, no params needed).
    // Kept as a stable array so all consumers share one cache entry.
    list: ["categories", "list"],

    // Single category by slug (used in product filter breadcrumbs)
    detail: (slug) => ["categories", slug],
  },

  // ── Wishlist ──────────────────────────────────────────────────────────────
  wishlist: {
    // Single entry per user — wishlist has no sub-keys needed
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