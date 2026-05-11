/**
 * DashboardLayout.jsx
 * Sidebar + content layout for vendor, gardener, and admin dashboards.
 * Phase 1: Minimal shell. Sidebar links filled in Phase 3, 5, 6.
 */

import { Outlet, Link, useLocation } from "react-router-dom";
import ROUTES from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import cn from "@/utils/cn";

const DashboardLayout = () => {
  const { role, user } = useAuth();
  const location = useLocation();

  // Navigation links vary by role
  const navLinks = {
    vendor: [
      { label: "Dashboard", to: ROUTES.VENDOR.DASHBOARD, icon: "📊" },
      { label: "Products", to: ROUTES.VENDOR.PRODUCTS, icon: "🪴" },
      { label: "Orders", to: ROUTES.VENDOR.ORDERS, icon: "📦" },
    ],
    gardener: [
      { label: "Dashboard", to: ROUTES.GARDENER.DASHBOARD, icon: "📊" },
      { label: "Services", to: ROUTES.GARDENER.SERVICES, icon: "🌿" },
      { label: "Slots", to: ROUTES.GARDENER.SLOTS, icon: "📅" },
      { label: "Bookings", to: ROUTES.GARDENER.BOOKINGS, icon: "📋" },
    ],
    admin: [
      { label: "Dashboard", to: ROUTES.ADMIN.DASHBOARD, icon: "📊" },
      { label: "Users", to: ROUTES.ADMIN.USERS, icon: "👥" },
      { label: "Vendors", to: ROUTES.ADMIN.VENDORS, icon: "🏪" },
      { label: "Gardeners", to: ROUTES.ADMIN.GARDENERS, icon: "🌿" },
      { label: "Analytics", to: ROUTES.ADMIN.ANALYTICS, icon: "📈" },
    ],
  };

  const links = navLinks[role] || [];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="text-lg font-bold text-brand-700">GreenNest</span>
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-medium tracking-wide">
            {role} Portal
          </p>
          <p className="text-sm font-medium text-gray-800 mt-0.5 truncate">
            {user?.name}
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="px-3 py-4 border-t border-gray-100">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500
                       hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
