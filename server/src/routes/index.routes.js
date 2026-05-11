/**
 * index.routes.js
 * Central route registry — all API routes are mounted here.
 *
 * Why centralize routes?
 * - app.js stays clean and doesn't grow with every new route file.
 * - A single file shows the complete API surface at a glance.
 * - Easy to add versioning (e.g., /api/v2) later.
 */

import { Router } from "express";
import healthRouter from "./health.routes.js";

// Phase 2+ routes will be imported and mounted here
// import authRouter from "./auth.routes.js";
// import userRouter from "./user.routes.js";
// import productRouter from "./product.routes.js";
// import categoryRouter from "./category.routes.js";
// import cartRouter from "./cart.routes.js";
// import orderRouter from "./order.routes.js";
// import bookingRouter from "./booking.routes.js";
// import gardenerRouter from "./gardener.routes.js";
// import adminRouter from "./admin.routes.js";
// import aiRouter from "./ai.routes.js";

const router = Router();

// ── Health ──────────────────────────────────────────────────────────────────
router.use("/health", healthRouter);

// ── Auth (Phase 2) ──────────────────────────────────────────────────────────
// router.use("/auth", authRouter);

// ── Users (Phase 2) ─────────────────────────────────────────────────────────
// router.use("/users", userRouter);

// ── Marketplace (Phase 3) ───────────────────────────────────────────────────
// router.use("/products", productRouter);
// router.use("/categories", categoryRouter);

// ── Commerce (Phase 4) ──────────────────────────────────────────────────────
// router.use("/cart", cartRouter);
// router.use("/orders", orderRouter);

// ── Services (Phase 5) ──────────────────────────────────────────────────────
// router.use("/gardeners", gardenerRouter);
// router.use("/bookings", bookingRouter);

// ── Admin (Phase 6) ─────────────────────────────────────────────────────────
// router.use("/admin", adminRouter);

// ── AI (Phase 8+) ───────────────────────────────────────────────────────────
// router.use("/ai", aiRouter);

export default router;
