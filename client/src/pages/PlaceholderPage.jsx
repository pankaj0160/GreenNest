/**
 * PlaceholderPage.jsx
 * Temporary placeholder rendered for routes that aren't implemented yet.
 * Shows the page title and the phase it belongs to.
 * Will be removed as real pages are built in later phases.
 */

import { useNavigate } from "react-router-dom";

const PlaceholderPage = ({ title = "Coming Soon" }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-4 max-w-md">
        <span className="text-6xl">🚧</span>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500">
          This page is under construction and will be built in an upcoming phase.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary mt-4"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default PlaceholderPage;
