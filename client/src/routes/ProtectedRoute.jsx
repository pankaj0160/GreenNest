/**
 * ProtectedRoute.jsx
 * Redirects unauthenticated users to /login.
 * Waits for auth initialization before redirecting (prevents flicker on page load).
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/account" element={<AccountPage />} />
 *   </Route>
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ROUTES from "@/constants/routes";

export const ProtectedRoute = () => {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  // While auth check is in progress, render nothing (prevents redirect flicker)
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-pulse">🌱</span>
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted location so we can redirect back after login
    return (
      <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

/**
 * RoleRoute.jsx
 * Extends ProtectedRoute — also checks if the user has the required role.
 * Redirects to home if authenticated but wrong role.
 *
 * Usage:
 *   <Route element={<RoleRoute allowedRoles={["vendor", "admin"]} />}>
 *     <Route path="/vendor/dashboard" element={<VendorDashboard />} />
 *   </Route>
 */
export const RoleRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isInitialized, role } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-4xl animate-pulse">🌱</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
    );
  }

  if (!allowedRoles.includes(role)) {
    // Authenticated but wrong role — send to home
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};
