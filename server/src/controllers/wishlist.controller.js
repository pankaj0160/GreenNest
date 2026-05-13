import * as wishlistService from "../services/wishlist.service.js";
import { successResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import MESSAGES from "../constants/messages.js";

/**
 * wishlist.controller.js
 * Thin layer — reads req, calls service, sends standardised response.
 * No business logic here. Follows the exact same pattern as category.controller.js.
 */

// ── GET /api/wishlist ──────────────────────────────────────────────────────────
export const getWishlist = asyncHandler(async (req, res) => {
  const { products } = await wishlistService.getWishlist(req.user._id);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    MESSAGES.WISHLIST.FETCHED,
    { products }
  );
});

// ── POST /api/wishlist/:productId ──────────────────────────────────────────────
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { action, products } = await wishlistService.toggleWishlist(
    req.user._id,
    req.params.productId
  );

  // Pick the message based on which action was taken
  const message =
    action === "added" ? MESSAGES.WISHLIST.ADDED : MESSAGES.WISHLIST.REMOVED;

  return successResponse(
    res,
    HTTP_STATUS.OK,
    message,
    { action, products }
  );
});