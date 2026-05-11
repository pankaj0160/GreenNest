/**
 * routes.js
 * Centralized route path constants.
 *
 * Why: Prevents route string typos scattered across Link, navigate(), and useMatch calls.
 * Change a route path here and it updates everywhere.
 *
 * Usage:
 *   import ROUTES from "@/constants/routes";
 *   <Link to={ROUTES.HOME}>Home</Link>
 *   navigate(ROUTES.AUTH.LOGIN);
 */

const ROUTES = {
  // ── Public ────────────────────────────────────────────────────────────────
  HOME: "/",
  NOT_FOUND: "*",

  // ── Auth ──────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password/:token",
    VERIFY_EMAIL: "/verify-email",
  },

  // ── Marketplace ───────────────────────────────────────────────────────────
  SHOP: {
    ROOT: "/shop",
    PRODUCT: "/shop/:productId",
    CATEGORY: "/shop/category/:slug",
    WISHLIST: "/wishlist",
    SEARCH: "/shop/search",
  },

  // ── Cart & Orders ─────────────────────────────────────────────────────────
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: {
    ROOT: "/orders",
    DETAIL: "/orders/:orderId",
  },

  // ── Gardener Services ─────────────────────────────────────────────────────
  SERVICES: {
    ROOT: "/services",
    GARDENER: "/services/gardener/:gardenerId",
    BOOKING_CONFIRM: "/services/booking/:bookingId/confirm",
  },
  BOOKINGS: {
    ROOT: "/bookings",
    DETAIL: "/bookings/:bookingId",
  },

  // ── User Account ──────────────────────────────────────────────────────────
  ACCOUNT: {
    ROOT: "/account",
    PROFILE: "/account/profile",
    ADDRESSES: "/account/addresses",
    ORDERS: "/account/orders",
    BOOKINGS: "/account/bookings",
  },

  // ── Vendor Dashboard ──────────────────────────────────────────────────────
  VENDOR: {
    ROOT: "/vendor",
    DASHBOARD: "/vendor/dashboard",
    PRODUCTS: "/vendor/products",
    ADD_PRODUCT: "/vendor/products/new",
    EDIT_PRODUCT: "/vendor/products/:productId/edit",
    ORDERS: "/vendor/orders",
  },

  // ── Gardener Dashboard ────────────────────────────────────────────────────
  GARDENER: {
    ROOT: "/gardener",
    DASHBOARD: "/gardener/dashboard",
    SERVICES: "/gardener/services",
    SLOTS: "/gardener/slots",
    BOOKINGS: "/gardener/bookings",
  },

  // ── Admin Dashboard ───────────────────────────────────────────────────────
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    VENDORS: "/admin/vendors",
    GARDENERS: "/admin/gardeners",
    PRODUCTS: "/admin/products",
    ORDERS: "/admin/orders",
    ANALYTICS: "/admin/analytics",
  },

  // ── AI Features ───────────────────────────────────────────────────────────
  AI: {
    ASSISTANT: "/ai/assistant",
    DIAGNOSIS: "/ai/diagnosis",
  },
};

export default ROUTES;
