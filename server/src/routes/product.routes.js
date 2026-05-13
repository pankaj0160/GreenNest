import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";
import { uploadProductImages } from "../middleware/upload.js";
import {
  createProductValidator,
  updateProductValidator,
  productQueryValidator,
} from "../validators/product.validators.js";

const router = Router();

/**
 * product.routes.js
 *
 * Route ordering is critical:
 *   /vendor/my  MUST come before /:id
 *   Otherwise Express will try to match "my" as a Mongo ObjectId → CastError
 *
 * Middleware chain per route:
 *   Public GET  → (no auth)
 *   Vendor CUD  → authenticate → authorize("vendor") → validate → uploadProductImages → controller
 *   Admin del   → authenticate → authorize("admin", "vendor") → controller
 */

// ── Public routes ─────────────────────────────────────────────────────────────

/**
 * GET /api/products
 * Public product listing with filters, search, sort, pagination.
 * Query: search, category, minPrice, maxPrice, inStock, sort, page, limit, featured
 */
router.get(
  "/",
  productQueryValidator,
  validate,
  productController.getProducts
);

// ── Vendor-protected routes ───────────────────────────────────────────────────

/**
 * GET /api/products/vendor/my
 * Returns ALL products (active + inactive) for the authenticated vendor.
 * MUST be defined before /:id.
 */
router.get(
  "/vendor/my",
  authenticate,
  authorize("vendor", "admin"),
  productController.getMyProducts
);

/**
 * POST /api/products
 * Create a new product. Vendors only.
 * Accepts multipart/form-data with up to 8 images under the "images" field.
 *
 * Middleware order matters:
 *   1. authenticate  — attach req.user
 *   2. authorize     — confirm vendor role
 *   3. uploadProductImages — parse multipart, populate req.files
 *   4. createProductValidator — validate req.body (available after multer parses it)
 *   5. validate      — collect express-validator errors
 *   6. controller
 *
 * Why validator AFTER upload? Multer parses multipart/form-data into req.body.
 * Validators run on req.body — they must run after multer, not before.
 */
router.post(
  "/",
  authenticate,
  authorize("vendor"),
  uploadProductImages,
  createProductValidator,
  validate,
  productController.createProduct
);

// ── Routes with :id param ─────────────────────────────────────────────────────

/**
 * GET /api/products/:id
 * Public — fetch single product by MongoDB ObjectId or slug.
 */
router.get(
  "/:id",
  productController.getProduct
);

/**
 * PUT /api/products/:id
 * Update a product. Vendor must own the product.
 * Accepts multipart/form-data (for image updates) or JSON (text fields only).
 *
 * Multer is always run — if Content-Type is not multipart, req.files = [].
 * This lets the same route handle text-only updates AND image updates.
 */
router.put(
  "/:id",
  authenticate,
  authorize("vendor"),
  uploadProductImages,
  updateProductValidator,
  validate,
  productController.updateProduct
);

/**
 * DELETE /api/products/:id
 * Soft-delete. Vendor (own product) or admin.
 */
router.delete(
  "/:id",
  authenticate,
  authorize("vendor", "admin"),
  productController.deleteProduct
);

export default router;