import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
} from "../validators/category.validators.js";

const router = Router();

/**
 * category.routes.js
 *
 * Public:
 *   GET /api/categories         — active categories, alphabetical
 *
 * Admin only:
 *   POST   /api/categories/seed — idempotent seed of 10 default categories
 *   POST   /api/categories      — create new category
 *   PUT    /api/categories/:id  — update name / description / isActive
 *   DELETE /api/categories/:id  — soft delete (isActive = false)
 *
 * Route ordering note:
 *   /seed is POST. /:id mutation routes are PUT and DELETE.
 *   There is no HTTP method collision so ordering is not a concern here —
 *   Express differentiates /seed vs /:id by method for PUT/DELETE.
 *   For POST we define /seed first as best practice for explicit routes.
 */

// ── Public ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/categories
 * Returns all active categories sorted A→Z.
 * No authentication required — used by product listing filters.
 */
router.get(
  "/",
  categoryController.getCategories
);

// ── Admin — explicit routes before param routes ───────────────────────────────

/**
 * POST /api/categories/seed
 * One-time (idempotent) seed of 10 default plant categories.
 * Defined BEFORE POST "/" would cause conflict? No — same method, different paths.
 * Express matches "/seed" literally before "/:id" for the same method.
 *
 * Note: if this were GET /seed vs GET /:id, order would matter.
 * POST /seed vs POST / are different paths; no conflict.
 */
router.post(
  "/seed",
  authenticate,
  authorize("admin"),
  categoryController.seedDefaultCategories
);

/**
 * POST /api/categories
 * Create a single category.
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  createCategoryValidator,
  validate,
  categoryController.createCategory
);

// ── Admin — param routes ──────────────────────────────────────────────────────

/**
 * PUT /api/categories/:id
 * Update name, description, or isActive status.
 * Partial update — only provided fields are changed.
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateCategoryValidator,
  validate,
  categoryController.updateCategory
);

/**
 * DELETE /api/categories/:id
 * Soft-delete: sets isActive = false.
 * Returns 409 if already inactive.
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  categoryController.deleteCategory
);

export default router;