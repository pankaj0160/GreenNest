import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Route guards
import { ProtectedRoute, RoleRoute } from "./ProtectedRoute";

// Pages — real
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import SignupPage from "@/pages/auth/SignupPage";
import LoginPage from "@/pages/auth/LoginPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";

// Placeholder for unbuilt pages
import PlaceholderPage from "@/pages/PlaceholderPage";

const router = createBrowserRouter([
  // ── Public Routes ────────────────────────────────────────────────────────
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/shop", element: <PlaceholderPage title="Shop" /> },
      { path: "/shop/:productId", element: <PlaceholderPage title="Product Detail" /> },
      { path: "/shop/category/:slug", element: <PlaceholderPage title="Category" /> },
      { path: "/services", element: <PlaceholderPage title="Gardener Services" /> },
      { path: "/services/gardener/:gardenerId", element: <PlaceholderPage title="Gardener Profile" /> },

      // ── Protected Routes ───────────────────────────────────────────────
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
      { path: "/login",           element: <LoginPage /> },
      { path: "/signup",          element: <SignupPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password/:token", element: <ResetPasswordPage /> },
      { path: "/verify-email",    element: <VerifyEmailPage /> },
    ],
  },

  // ── Vendor Dashboard ─────────────────────────────────────────────────────
  {
    element: <RoleRoute allowedRoles={["vendor"]} />,
    children: [{
      element: <DashboardLayout />,
      children: [
        { path: "/vendor/dashboard", element: <PlaceholderPage title="Vendor Dashboard" /> },
        { path: "/vendor/products", element: <PlaceholderPage title="My Products" /> },
        { path: "/vendor/products/new", element: <PlaceholderPage title="Add Product" /> },
        { path: "/vendor/products/:productId/edit", element: <PlaceholderPage title="Edit Product" /> },
        { path: "/vendor/orders", element: <PlaceholderPage title="Vendor Orders" /> },
      ],
    }],
  },

  // ── Gardener Dashboard ───────────────────────────────────────────────────
  {
    element: <RoleRoute allowedRoles={["gardener"]} />,
    children: [{
      element: <DashboardLayout />,
      children: [
        { path: "/gardener/dashboard", element: <PlaceholderPage title="Gardener Dashboard" /> },
        { path: "/gardener/services", element: <PlaceholderPage title="My Services" /> },
        { path: "/gardener/slots", element: <PlaceholderPage title="Availability Slots" /> },
        { path: "/gardener/bookings", element: <PlaceholderPage title="My Bookings" /> },
      ],
    }],
  },

  // ── Admin Dashboard ──────────────────────────────────────────────────────
  {
    element: <RoleRoute allowedRoles={["admin"]} />,
    children: [{
      element: <DashboardLayout />,
      children: [
        { path: "/admin/dashboard", element: <PlaceholderPage title="Admin Dashboard" /> },
        { path: "/admin/users", element: <PlaceholderPage title="User Management" /> },
        { path: "/admin/vendors", element: <PlaceholderPage title="Vendor Approvals" /> },
        { path: "/admin/gardeners", element: <PlaceholderPage title="Gardener Approvals" /> },
        { path: "/admin/analytics", element: <PlaceholderPage title="Analytics" /> },
      ],
    }],
  },

  // ── 404 ──────────────────────────────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;