import axiosInstance from "@/services/axiosInstance";

/**
 * productApi.js
 * API service layer for all product-related endpoints.
 *
 * Pattern: matches authApi.js exactly —
 *   axiosInstance.<method>(path, data).then((r) => r.data)
 *
 * Image upload notes:
 *   createProduct and updateProduct accept a FormData object when images
 *   are included. FormData is passed directly to axios — it auto-detects
 *   the Content-Type and sets the correct multipart/form-data boundary.
 *   Never manually set Content-Type for FormData requests.
 *
 * All functions return the parsed response body (r.data), which has shape:
 *   { success, message, data, meta? }
 * Callers destructure `data` for the actual payload.
 */

// ── Public ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/products
 * Fetch paginated, filtered, sorted product listing.
 *
 * @param {object} params - Query params object (all optional)
 * @param {string}  params.search      - Full-text search string
 * @param {string}  params.category    - Category slug or ObjectId
 * @param {number}  params.minPrice    - Minimum price (inclusive)
 * @param {number}  params.maxPrice    - Maximum price (inclusive)
 * @param {string}  params.inStock     - "true" → in-stock only
 * @param {string}  params.sort        - price_asc | price_desc | rating_desc | newest | oldest
 * @param {number}  params.page        - Page number (default 1)
 * @param {number}  params.limit       - Items per page (default 12, max 48)
 * @param {string}  params.featured    - "true" → featured products only
 * @returns {Promise<{ success, message, data: { products }, meta: { total, page, pages, limit } }>}
 */
export const getProductsApi = (params = {}) =>
  axiosInstance.get("/products", { params }).then((r) => r.data);

/**
 * GET /api/products/:id
 * Fetch a single product by MongoDB ObjectId or slug.
 *
 * @param {string} idOrSlug
 * @returns {Promise<{ success, message, data: { product } }>}
 */
export const getProductByIdApi = (idOrSlug) =>
  axiosInstance.get(`/products/${idOrSlug}`).then((r) => r.data);

// ── Vendor ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/products/vendor/my
 * Fetch authenticated vendor's own products (active + inactive).
 * Supports pagination, sort, and text search.
 *
 * @param {object} params - { page, limit, sort, search }
 * @returns {Promise<{ success, message, data: { products }, meta: { total, page, pages, limit } }>}
 */
export const getMyProductsApi = (params = {}) =>
  axiosInstance.get("/products/vendor/my", { params }).then((r) => r.data);

/**
 * POST /api/products
 * Create a new product. Vendor only.
 *
 * Accepts a FormData object so images can be included alongside text fields.
 * Build FormData in the calling component/hook before passing here.
 *
 * FormData fields expected by backend:
 *   name, description, shortDescription, price, discountPrice,
 *   stock, sku, category, tags[], careLevel, sunlightRequirement,
 *   wateringFrequency, isFeatured
 *   images (File) — up to 8 files under the "images" field name
 *
 * @param {FormData} formData
 * @returns {Promise<{ success, message, data: { product } }>}
 */
export const createProductApi = (formData) =>
  axiosInstance.post("/products", formData).then((r) => r.data);

/**
 * PUT /api/products/:id
 * Update an existing product. Vendor must own the product.
 *
 * Accepts FormData (for image updates) or a plain object (text fields only).
 * Pass FormData when the user has selected new images; plain object otherwise.
 *
 * Additional FormData field:
 *   replaceImages "true" → discard all existing images, use only new uploads
 *
 * @param {string}          productId
 * @param {FormData|object} data
 * @returns {Promise<{ success, message, data: { product } }>}
 */
export const updateProductApi = (productId, data) =>
  axiosInstance.put(`/products/${productId}`, data).then((r) => r.data);

/**
 * DELETE /api/products/:id
 * Soft-delete a product (sets isActive = false). Vendor or admin.
 *
 * @param {string} productId
 * @returns {Promise<{ success, message, data: null }>}
 */
export const deleteProductApi = (productId) =>
  axiosInstance.delete(`/products/${productId}`).then((r) => r.data);