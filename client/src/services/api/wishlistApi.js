import axiosInstance from "@/services/axiosInstance";

/**
 * wishlistApi.js
 * API service layer for wishlist endpoints.
 *
 * Pattern: matches authApi.js exactly —
 *   axiosInstance.<method>(path, data).then((r) => r.data)
 *
 * Both endpoints require authentication (customer role).
 * The JWT is attached automatically by the axiosInstance request interceptor.
 */

/**
 * GET /api/wishlist
 * Fetch the authenticated customer's wishlist, populated with active product details.
 * Returns an empty products array if the customer has never added anything.
 *
 * @returns {Promise<{ success, message, data: { products } }>}
 */
export const getWishlistApi = () =>
  axiosInstance.get("/wishlist").then((r) => r.data);

/**
 * POST /api/wishlist/:productId
 * Toggle a product in or out of the customer's wishlist.
 *   - If the product is not in the wishlist → adds it
 *   - If the product is already in the wishlist → removes it
 *
 * @param {string} productId - MongoDB ObjectId of the product to toggle
 * @returns {Promise<{ success, message, data: { action: 'added'|'removed', products } }>}
 */
export const toggleWishlistApi = (productId) =>
  axiosInstance.post(`/wishlist/${productId}`).then((r) => r.data);