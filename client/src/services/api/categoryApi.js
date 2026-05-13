import axiosInstance from "@/services/axiosInstance";

/**
 * categoryApi.js
 * API service layer for all category-related endpoints.
 *
 * Pattern: matches authApi.js exactly —
 *   axiosInstance.<method>(path, data).then((r) => r.data)
 *
 * Public:
 *   getCategories — no auth required, used in product filter UI
 *
 * Admin only:
 *   createCategory, updateCategory, deleteCategory, seedCategories
 *   (auth enforced server-side; axiosInstance attaches JWT automatically)
 */

// ── Public ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/categories
 * Fetch all active categories sorted alphabetically.
 * No authentication required.
 *
 * @returns {Promise<{ success, message, data: { categories } }>}
 */
export const getCategoriesApi = () =>
  axiosInstance.get("/categories").then((r) => r.data);

// ── Admin ──────────────────────────────────────────────────────────────────────

/**
 * POST /api/categories
 * Create a new category. Admin only.
 *
 * @param {{ name: string, description?: string }} data
 * @returns {Promise<{ success, message, data: { category } }>}
 */
export const createCategoryApi = (data) =>
  axiosInstance.post("/categories", data).then((r) => r.data);

/**
 * PUT /api/categories/:id
 * Update a category's name, description, or active status. Admin only.
 * Partial update — only send fields that should change.
 *
 * @param {string}  categoryId
 * @param {{ name?: string, description?: string, isActive?: boolean }} data
 * @returns {Promise<{ success, message, data: { category } }>}
 */
export const updateCategoryApi = (categoryId, data) =>
  axiosInstance.put(`/categories/${categoryId}`, data).then((r) => r.data);

/**
 * DELETE /api/categories/:id
 * Soft-delete a category (sets isActive = false). Admin only.
 * Returns 409 if the category is already inactive.
 *
 * @param {string} categoryId
 * @returns {Promise<{ success, message, data: null }>}
 */
export const deleteCategoryApi = (categoryId) =>
  axiosInstance.delete(`/categories/${categoryId}`).then((r) => r.data);

/**
 * POST /api/categories/seed
 * Idempotent seed of the 10 default plant categories. Admin only.
 * Safe to call multiple times — existing categories are skipped.
 *
 * @returns {Promise<{ success, message, data: { inserted, skipped, categories } }>}
 */
export const seedCategoriesApi = () =>
  axiosInstance.post("/categories/seed").then((r) => r.data);