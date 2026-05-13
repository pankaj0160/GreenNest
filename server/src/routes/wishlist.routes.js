import { Router } from "express";
import * as wishlistController from "../controllers/wishlist.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";
import { wishlistProductValidator } from "../validators/wishlist.validators.js";

const router = Router();

/**
 * wishlist.routes.js
 *
 * All wishlist routes require:
 *   1. authenticate — valid JWT
 *   2. authorize("customer") — vendors, gardeners, admins are excluded
 *
 * Routes:
 *   GET  /api/wishlist              — fetch customer's wishlist (populated)
 *   POST /api/wishlist/:productId   — toggle product in/out of wishlist
 *
 * No ordering concern — different HTTP methods, different path shapes.
 */

/**
 * GET /api/wishlist
 * Returns the customer's wishlist populated with active product details.
 * Returns empty products array if wishlist has never been created.
 */
router.get(
  "/",
  authenticate,
  authorize("customer"),
  wishlistController.getWishlist
);

/**
 * POST /api/wishlist/:productId
 * Toggle: adds product if absent, removes it if already present.
 * Validates productId is a valid MongoId before hitting the service.
 */
router.post(
  "/:productId",
  authenticate,
  authorize("customer"),
  wishlistProductValidator,
  validate,
  wishlistController.toggleWishlist
);

export default router;