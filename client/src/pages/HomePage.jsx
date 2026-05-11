/**
 * HomePage.jsx
 * Landing page for GreenNest.
 *
 * Phase 1: Full hero + feature sections to verify layout, routing, and styling work.
 * Phase 3+: Will add real product listings, categories, and featured gardeners.
 */

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ROUTES from "@/constants/routes";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { checkHealth } from "@/services/api/healthApi";

// ── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, description, linkTo, linkLabel }) => (
  <div className="card p-6 space-y-3">
    <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-2xl">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    <Link
      to={linkTo}
      className="inline-flex items-center text-sm text-brand-600 hover:text-brand-700
                 font-medium transition-colors"
    >
      {linkLabel} →
    </Link>
  </div>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ number, label }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-brand-600">{number}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const HomePage = () => {
  // Phase 1: Health check to verify frontend ↔ backend communication
  const { data: healthData, isError } = useQuery({
    queryKey: QUERY_KEYS.auth.me, // reusing as a test key
    queryFn: checkHealth,
    retry: false,
    staleTime: 30_000,
  });

  return (
    <div className="overflow-x-hidden">
      {/* ── DEV: Backend Status Banner ───────────────────────────── */}
      {import.meta.env.DEV && (
        <div
          className={`py-2 text-center text-xs font-medium ${
            isError
              ? "bg-red-50 text-red-600"
              : "bg-brand-50 text-brand-700"
          }`}
        >
          {isError
            ? "⚠️ Backend not connected — start the server at localhost:5000"
            : healthData
            ? `✅ Backend connected — DB: ${healthData.data?.database}`
            : "⏳ Connecting to backend..."}
        </div>
      )}

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="section bg-gradient-to-br from-brand-50 via-white to-earth-50">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="badge-green inline-flex mb-2">
              🌱 AI-Powered Gardening Platform
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Grow something{" "}
              <span className="text-gradient">beautiful</span>{" "}
              today
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Shop thousands of plants, book expert gardeners, diagnose plant
              diseases with AI, and get personalized care advice — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to={ROUTES.SHOP.ROOT} className="btn-primary px-8 py-3 text-base">
                🛍️ Shop Plants
              </Link>
              <Link to={ROUTES.SERVICES.ROOT} className="btn-secondary px-8 py-3 text-base">
                🌿 Find a Gardener
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="mt-16 flex items-center justify-center gap-6 flex-wrap">
            {["🌵", "🪴", "🌺", "🌿", "🌸", "🌱"].map((emoji, i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-2xl bg-white shadow-card flex items-center
                           justify-center text-4xl hover:shadow-card-hover transition-shadow
                           hover:-translate-y-1 transition-transform duration-200"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="10,000+" label="Plants & Products" />
            <StatCard number="500+" label="Expert Gardeners" />
            <StatCard number="50,000+" label="Happy Customers" />
            <StatCard number="4.9★" label="Average Rating" />
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="section bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to garden smarter
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              GreenNest combines a marketplace, service booking, and AI tools
              into one seamless experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="🛍️"
              title="Plant Marketplace"
              description="Browse thousands of plants, seeds, tools, and accessories from verified vendors. Filter by type, price, and availability."
              linkTo={ROUTES.SHOP.ROOT}
              linkLabel="Start shopping"
            />
            <FeatureCard
              icon="🌿"
              title="Gardener Services"
              description="Book certified local gardeners for garden setup, maintenance, pruning, and more. Real-time availability and instant booking."
              linkTo={ROUTES.SERVICES.ROOT}
              linkLabel="Find a gardener"
            />
            <FeatureCard
              icon="🤖"
              title="AI Assistant"
              description="Chat with our AI gardening expert powered by a curated knowledge base. Get instant answers to any plant care question."
              linkTo={ROUTES.AI.ASSISTANT}
              linkLabel="Ask the AI"
            />
            <FeatureCard
              icon="🔬"
              title="Plant Diagnosis"
              description="Upload a photo of your sick plant and get an AI-powered diagnosis with treatment recommendations in seconds."
              linkTo={ROUTES.AI.DIAGNOSIS}
              linkLabel="Diagnose a plant"
            />
            <FeatureCard
              icon="📅"
              title="Care Schedules"
              description="Never forget to water, fertilize, or repot again. Get personalized care reminders tailored to each of your plants."
              linkTo={ROUTES.ACCOUNT.PROFILE}
              linkLabel="Set up reminders"
            />
            <FeatureCard
              icon="🏪"
              title="Sell on GreenNest"
              description="Are you a plant vendor or nursery? Join our marketplace and reach thousands of plant lovers across the country."
              linkTo={ROUTES.AUTH.SIGNUP}
              linkLabel="Become a vendor"
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="section bg-gradient-to-r from-brand-700 to-brand-500">
        <div className="page-container text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Ready to grow your garden?
          </h2>
          <p className="text-brand-100 text-lg">
            Join 50,000+ plant lovers on GreenNest today.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to={ROUTES.AUTH.SIGNUP}
              className="btn bg-white text-brand-700 hover:bg-brand-50 px-8 py-3 text-base font-semibold"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
