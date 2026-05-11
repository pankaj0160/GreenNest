/**
 * useAuth.js
 * Custom hook that provides clean access to auth state and actions.
 *
 * Why a hook instead of using useSelector directly?
 * - Single import for all auth needs in any component.
 * - Hides Redux implementation detail from components.
 * - Centralizes role-check helpers so components don't need switch statements.
 *
 * Usage:
 *   const { user, isAuthenticated, isCustomer, isVendor } = useAuth();
 */

import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsAuthLoading,
  selectIsInitialized,
  selectUserRole,
  logoutUser,
} from "@/store/slices/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsAuthLoading);
  const isInitialized = useSelector(selectIsInitialized);
  const role = useSelector(selectUserRole);

  // Role helpers — used for conditional rendering and route guards
  const isCustomer = role === "customer";
  const isVendor = role === "vendor";
  const isGardener = role === "gardener";
  const isAdmin = role === "admin";

  // Has at least one of the provided roles
  const hasRole = (...roles) => roles.includes(role);

  const logout = () => dispatch(logoutUser());

  return {
    user,
    role,
    isAuthenticated,
    isLoading,
    isInitialized,
    isCustomer,
    isVendor,
    isGardener,
    isAdmin,
    hasRole,
    logout,
  };
};

export default useAuth;
