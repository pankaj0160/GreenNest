import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMeApi } from "@/services/api/authApi";
import { setUser, setInitialized } from "@/store/slices/authSlice";

/**
 * useAuthInit.js
 * Runs once on app mount — calls GET /auth/me to restore session from cookie.
 *
 * Why: On page refresh, Redux state is cleared. The JWT cookie persists.
 * This hook re-hydrates the auth state from the cookie before rendering
 * any protected routes — preventing false "not authenticated" redirects.
 *
 * Called in App.jsx (or main layout), not in individual pages.
 */
const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getMeApi();
        dispatch(setUser(data.data.user));
      } catch {
        // Not logged in — that's fine, just mark as initialized
        dispatch(setInitialized());
      }
    };

    initAuth();
  }, [dispatch]);
};

export default useAuthInit;