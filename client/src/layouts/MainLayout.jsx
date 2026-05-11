/**
 * MainLayout.jsx
 * Primary shell layout for all authenticated/public pages.
 * Renders the Navbar at the top, an <Outlet /> for page content, and Footer.
 *
 * Phase 1: Renders a minimal placeholder navbar.
 * Phase 3+: Will be replaced with the full Navbar component.
 */

import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import ROUTES from "@/constants/routes";
import useAuth from "@/hooks/useAuth";

const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="page-container h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-bold text-brand-700 tracking-tight">
              GreenNest
            </span>
          </Link>

          {/* Nav Actions */}
          <nav className="flex items-center gap-4">
            <Link
              to={ROUTES.SHOP.ROOT}
              className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
            >
              Shop
            </Link>
            <Link
              to={ROUTES.SERVICES.ROOT}
              className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
            >
              Services
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Hi, {user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to={ROUTES.AUTH.LOGIN} className="btn-ghost text-sm py-1.5 px-3">
                  Login
                </Link>
                <Link to={ROUTES.AUTH.SIGNUP} className="btn-primary text-sm py-1.5 px-3">
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* ── Page Content ────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="page-container text-center text-sm text-gray-400">
          © {new Date().getFullYear()} GreenNest. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
