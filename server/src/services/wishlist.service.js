import Wishlist from "../models/Wishlist.model.js";
import Product from "../models/Product.model.js";
import AppError from "../utils/AppError.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import MESSAGES from "../constants/messages.js";

/**
 * wishlist.service.js
 * All wishlist business logic.
 *
 * Design decisions:
 * - findOneAndUpdate with upsert for find-or-create: single atomic DB round trip
 *   instead of findOne → create → save.
 * - Toggle uses $pull / $addToSet: both are atomic and safe under concurrent
 *   requests (no race condition between the "is product in list?" check and the write).
 * - GET wishlist populates only active products using a match condition on populate,
 *   so soft-deleted products are silently excluded from the response.
 * - A missing wishlist on GET returns an empty array, not a 404 — a customer
 *   with no wishlist has just never added anything yet.
 */

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

// ── Get Wishlist ───────────────────────────────────────────────────────────────

/**
 * Return the authenticated customer's wishlist, populated with active product details.
 * Returns an empty products array if the customer has never added anything.
 *
 * @param {string} userId - req.user._id
 * @returns {Promise<{ products: Product[] }>}
 */
export const getWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ user: userId }).populate({
    path: "products",
    match: { isActive: true }, // silently exclude soft-deleted products
    select:
      "name slug price discountPrice images category averageRating stock careLevel",
    populate: {
      path: "category",
      select: "name slug",
    },
  });

  // Customer has never added anything yet — return empty shape
  if (!wishlist) {
    return { products: [] };
  }

  // populate match filters in-memory: the products array may contain null
  // entries for any ObjectIds that didn't match the match condition.
  // Filter those out before returning.
  const activeProducts = wishlist.products.filter(Boolean);

  return { products: activeProducts };
};

// ── Toggle Wishlist ────────────────────────────────────────────────────────────

/**
 * Add or remove a product from the customer's wishlist (toggle).
 *
 * Steps:
 *   1. Verify product exists and is active
 *   2. Find-or-create the wishlist (upsert)
 *   3. Check whether the product is already in the list
 *   4. Remove it ($pull) if present, add it ($addToSet) if absent
 *   5. Return action taken + updated wishlist
 *
 * @param {string} userId    - req.user._id
 * @param {string} productId - req.params.productId (validated as MongoId)
 * @returns {Promise<{ action: 'added'|'removed', products: Product[] }>}
 */
export const toggleWishlist = async (userId, productId) => {
  // 1. Verify product exists and is active
  const product = await Product.findById(productId).select("_id isActive name");
  if (!product) {
    throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (!product.isActive) {
    throw new AppError(
      "This product is no longer available.",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // 2. Find-or-create wishlist in one atomic operation.
  //    upsert:true creates the document if none exists for this user.
  //    setDefaultsOnInsert ensures the products array is initialised as [].
  let wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, products: [] } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // 3. Check membership — compare ObjectIds as strings for safety
  const isInWishlist = wishlist.products.some(
    (id) => id.toString() === productId.toString()
  );

  let action;

  if (isInWishlist) {
    // 4a. Remove — $pull removes all matching elements atomically
    await Wishlist.updateOne(
      { user: userId },
      { $pull: { products: product._id } }
    );
    action = "removed";
  } else {
    // 4b. Add — $addToSet prevents duplicates atomically
    await Wishlist.updateOne(
      { user: userId },
      { $addToSet: { products: product._id } }
    );
    action = "added";
  }

  // 5. Re-fetch the updated wishlist with populated active products
  const updatedWishlist = await Wishlist.findOne({ user: userId }).populate({
    path: "products",
    match: { isActive: true },
    select:
      "name slug price discountPrice images category averageRating stock careLevel",
    populate: {
      path: "category",
      select: "name slug",
    },
  });

  // Filter out populate-match nulls (same as getWishlist)
  const activeProducts = updatedWishlist
    ? updatedWishlist.products.filter(Boolean)
    : [];

  return { action, products: activeProducts };
};