/**
 * AppRouter.jsx
 * Central route registry for the entire application.
 *
 * Structure:
 * - Public routes (MainLayout): Home, Shop, Services, Product Detail
 * - Auth routes (AuthLayout): Login, Signup, Forgot/Reset Password
 * - Protected routes: Account, Cart, Checkout
 * - Vendor routes (DashboardLayout + RoleRoute): Vendor dashboard
 * - Gardener routes (DashboardLayout + RoleRoute): Gardener dashboard
 * - Admin routes (DashboardLayout + RoleRoute): Admin dashboard
 *
 * Phase 1: Only Home and NotFound are real pages.
 *          All other routes render placeholders.
 */

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Route guards
import { ProtectedRoute, RoleRoute } from "./ProtectedRoute";

// Pages — real (Phase 1)
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

// Pages — placeholder (filled in later phases)
import PlaceholderPage from "@/pages/PlaceholderPage";

const router = createBrowserRouter([
  // ── Public Routes ────────────────────────────────────────────────────────
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },

      // Phase 3: Marketplace
      { path: "/shop", element: <PlaceholderPage title="Shop" /> },
      { path: "/shop/:productId", element: <PlaceholderPage title="Product Detail" /> },
      { path: "/shop/category/:slug", element: <PlaceholderPage title="Category" /> },

      // Phase 5: Services
      { path: "/services", element: <PlaceholderPage title="Gardener Services" /> },
      { path: "/services/gardener/:gardenerId", element: <PlaceholderPage title="Gardener Profile" /> },

      // ── Protected Routes (any authenticated user) ──────────────────────
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/account/profile", element: <PlaceholderPage title="My Profile" /> },
          { path: "/account/orders", element: <PlaceholderPage title="My Orders" /> },
          { path: "/account/bookings", element: <PlaceholderPage title="My Bookings" /> },
          { path: "/wishlist", element: <PlaceholderPage title="Wishlist" /> },
          { path: "/cart", element: <PlaceholderPage title="Cart" /> },
          { path: "/checkout", element: <PlaceholderPage title="Checkout" /> },
          { path: "/orders/:orderId", element: <PlaceholderPage title="Order Detail" /> },
          { path: "/bookings/:bookingId", element: <PlaceholderPage title="Booking Detail" /> },
        ],
      },
    ],
  },

  // ── Auth Routes ──────────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <PlaceholderPage title="Login" /> },
      { path: "/signup", element: <PlaceholderPage title="Sign Up" /> },
      { path: "/forgot-password", element: <PlaceholderPage title="Forgot Password" /> },
      { path: "/reset-password/:token", element: <PlaceholderPage title="Reset Password" /> },
      { path: "/verify-email", element: <PlaceholderPage title="Verify Email" /> },
    ],
  },

  // ── Vendor Dashboard (Phase 3) ───────────────────────────────────────────
  {
    element: <RoleRoute allowedRoles={["vendor"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/vendor/dashboard", element: <PlaceholderPage title="Vendor Dashboard" /> },
          { path: "/vendor/products", element: <PlaceholderPage title="My Products" /> },
          { path: "/vendor/products/new", element: <PlaceholderPage title="Add Product" /> },
          { path: "/vendor/products/:productId/edit", element: <PlaceholderPage title="Edit Product" /> },
          { path: "/vendor/orders", element: <PlaceholderPage title="Vendor Orders" /> },
        ],
      },
    ],
  },

  // ── Gardener Dashboard (Phase 5) ────────────────────────────────────────
  {
    element: <RoleRoute allowedRoles={["gardener"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/gardener/dashboard", element: <PlaceholderPage title="Gardener Dashboard" /> },
          { path: "/gardener/services", element: <PlaceholderPage title="My Services" /> },
          { path: "/gardener/slots", element: <PlaceholderPage title="Availability Slots" /> },
          { path: "/gardener/bookings", element: <PlaceholderPage title="My Bookings" /> },
        ],
      },
    ],
  },

  // ── Admin Dashboard (Phase 6) ────────────────────────────────────────────
  {
    element: <RoleRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/admin/dashboard", element: <PlaceholderPage title="Admin Dashboard" /> },
          { path: "/admin/users", element: <PlaceholderPage title="User Management" /> },
          { path: "/admin/vendors", element: <PlaceholderPage title="Vendor Approvals" /> },
          { path: "/admin/gardeners", element: <PlaceholderPage title="Gardener Approvals" /> },
          { path: "/admin/analytics", element: <PlaceholderPage title="Analytics" /> },
        ],
      },
    ],
  },

  // ── 404 ──────────────────────────────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
