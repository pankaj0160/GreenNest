/**
 * NotFoundPage.jsx
 * 404 — page not found.
 */

import { Link } from "react-router-dom";
import ROUTES from "@/constants/routes";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
      <div className="space-y-6 max-w-lg">
        {/* Illustration */}
        <div className="relative inline-flex">
          <span className="text-[120px] leading-none select-none">🌵</span>
          <span className="absolute -top-2 -right-4 text-5xl">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Page not found
          </h1>
          <p className="text-gray-500 text-lg">
            Looks like this plant hasn't been cultivated yet.
            <br />
            Let's get you back to fertile ground.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to={ROUTES.HOME} className="btn-primary">
            🏠 Go Home
          </Link>
          <Link to={ROUTES.SHOP.ROOT} className="btn-secondary">
            Browse Plants
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
