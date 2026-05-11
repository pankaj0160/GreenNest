import { Router } from "express";
import healthRouter from "./health.routes.js";
import authRouter from "./auth.routes.js";

const router = Router();

// ── Health ───────────────────────────────────────────────────────────────────
router.use("/health", healthRouter);

// ── Auth (Phase 2) ───────────────────────────────────────────────────────────
router.use("/auth", authRouter);

// ── Marketplace (Phase 3) ────────────────────────────────────────────────────
// router.use("/products", productRouter);
// router.use("/categories", categoryRouter);

// ── Commerce (Phase 4) ───────────────────────────────────────────────────────
// router.use("/cart", cartRouter);
// router.use("/orders", orderRouter);

// ── Services (Phase 5) ───────────────────────────────────────────────────────
// router.use("/gardeners", gardenerRouter);
// router.use("/bookings", bookingRouter);

// ── Admin (Phase 6) ──────────────────────────────────────────────────────────
// router.use("/admin", adminRouter);

// ── AI (Phase 8+) ────────────────────────────────────────────────────────────
// router.use("/ai", aiRouter);

export default router;