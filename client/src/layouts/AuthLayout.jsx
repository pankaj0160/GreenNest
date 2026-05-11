/**
 * AuthLayout.jsx
 * Centered, clean layout for authentication pages (login, signup, forgot password).
 * Split-screen: left side brand panel, right side form.
 */

import { Outlet, Link } from "react-router-dom";
import ROUTES from "@/constants/routes";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* ── Left: Brand Panel ───────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 flex-col justify-between p-12">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <span className="text-3xl">🌱</span>
          <span className="text-2xl font-bold text-white tracking-tight">
            GreenNest
          </span>
        </Link>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Your AI-powered
            <br />
            gardening companion
          </h2>
          <p className="text-brand-100 text-lg leading-relaxed max-w-sm">
            Shop thousands of plants, book expert gardeners, and get personalized
            care advice — all in one place.
          </p>
        </div>

        <div className="flex items-center gap-6 text-brand-200 text-sm">
          <span>🪴 10,000+ Plants</span>
          <span>🌿 500+ Gardeners</span>
          <span>🤖 AI Assistant</span>
        </div>
      </div>

      {/* ── Right: Form Area ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-white">
        {/* Mobile logo (visible only on small screens) */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 mb-8 lg:hidden"
        >
          <span className="text-2xl">🌱</span>
          <span className="text-xl font-bold text-brand-700">GreenNest</span>
        </Link>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
