import Category from "../models/Category.model.js";
import AppError from "../utils/AppError.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import MESSAGES from "../constants/messages.js";

/**
 * category.service.js
 * All category business logic.
 * Controllers call these functions and stay thin.
 *
 * Slug notes:
 *   Category.model.js has a pre-save hook that runs slugify() whenever
 *   `name` is modified. The service does NOT manually set slug — it only
 *   normalises and validates the name, then lets the model hook handle slug.
 *
 * Duplicate-check strategy:
 *   The spec requires case-insensitive duplicate prevention.
 *   MongoDB's unique index on `name` is case-sensitive by default, so
 *   "Indoor Plants" and "indoor plants" would both pass the DB constraint.
 *   We therefore perform an explicit case-insensitive regex check BEFORE
 *   any write, converting the AppError into a clear 409 instead of a
 *   raw Mongo E11000 that the error handler would produce.
 */

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Case-insensitive duplicate name check.
 * Excludes a given category ID so updates don't conflict with themselves.
 *
 * @param {string} name        - Already-trimmed candidate name
 * @param {string} [excludeId] - _id to exclude from the check (for updates)
 * @throws {AppError} 409 if a matching category name already exists
 */
const assertNoDuplicateName = async (name, excludeId = null) => {
  const query = {
    name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
  };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const exists = await Category.exists(query);
  if (exists) {
    throw new AppError(MESSAGES.CATEGORY.ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT SEED DATA
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES = [
  { name: "Indoor Plants",    description: "Plants that thrive indoors with minimal sunlight." },
  { name: "Outdoor Plants",   description: "Plants suited for gardens, balconies, and open spaces." },
  { name: "Succulents",       description: "Low-maintenance water-storing plants for any space." },
  { name: "Flowering Plants", description: "Vibrant blooms to brighten your home and garden." },
  { name: "Herbs",            description: "Culinary and medicinal herbs for kitchen gardens." },
  { name: "Bonsai",           description: "Miniature trees cultivated through careful pruning." },
  { name: "Seeds",            description: "Seeds for vegetables, flowers, herbs, and more." },
  { name: "Pots & Planters",  description: "Containers in every style, size, and material." },
  { name: "Fertilizers",      description: "Nutrients and soil amendments for healthy plants." },
  { name: "Gardening Tools",  description: "Essential tools for every gardening task." },
];

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

// ── Create Category ────────────────────────────────────────────────────────────

/**
 * Create a new category. Admin only (enforced at route level).
 *
 * Steps:
 *   1. Normalise name (trim — validator already trims, this is defensive)
 *   2. Case-insensitive duplicate check
 *   3. Create — model pre-save hook generates the slug
 *
 * @param {object} data      - { name, description }
 * @param {string} adminId   - req.user._id of the authenticated admin
 * @returns {Promise<Category>}
 */
export const createCategory = async (data, adminId) => {
  const name        = data.name.trim();
  const description = data.description ? data.description.trim() : "";

  // Duplicate name check (case-insensitive)
  await assertNoDuplicateName(name);

  // Create — pre-save hook sets slug from name automatically
  const category = await Category.create({
    name,
    description,
    createdBy: adminId,
  });

  return category;
};

// ── Get Categories (Public) ────────────────────────────────────────────────────

/**
 * Fetch all active categories, sorted alphabetically by name.
 * Returns only active categories to public consumers.
 *
 * @returns {Promise<Category[]>}
 */
export const getCategories = async () => {
  return Category.find({ isActive: true })
    .select("name slug description image isActive createdAt")
    .sort({ name: 1 })
    .lean();
};

// ── Update Category ────────────────────────────────────────────────────────────

/**
 * Update a category. Admin only (enforced at route level).
 *
 * Handles:
 *   - Partial updates (only provided fields changed)
 *   - Name change → duplicate check + slug regeneration via pre-save hook
 *   - isActive toggle (re-activation of a soft-deleted category)
 *
 * @param {string} categoryId   - req.params.id
 * @param {object} data         - { name?, description?, isActive? }
 * @returns {Promise<Category>}
 */
export const updateCategory = async (categoryId, data) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const { name, description, isActive } = data;

  // If name is being changed, normalise and check for duplicates
  if (name !== undefined) {
    const normalisedName = name.trim();

    // Only run duplicate check if the name is actually different
    if (normalisedName.toLowerCase() !== category.name.toLowerCase()) {
      await assertNoDuplicateName(normalisedName, categoryId);
    }

    // Set the new name — pre-save hook will regenerate slug
    category.name = normalisedName;
  }

  if (description !== undefined) {
    category.description = description.trim();
  }

  if (isActive !== undefined) {
    // Accept boolean true/false or string "true"/"false" from form-data
    category.isActive = isActive === true || isActive === "true";
  }

  await category.save();
  return category;
};

// ── Delete Category (Soft) ─────────────────────────────────────────────────────

/**
 * Soft-delete a category by setting isActive = false.
 * Throws if category not found or already inactive.
 *
 * Products referencing this category are NOT touched — they remain
 * in the DB and will be filtered out by the product service's
 * "category must be active" check on new product creation.
 *
 * @param {string} categoryId
 * @returns {Promise<void>}
 */
export const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (!category.isActive) {
    throw new AppError(
      "Category is already deactivated.",
      HTTP_STATUS.CONFLICT
    );
  }

  category.isActive = false;
  await category.save({ validateBeforeSave: false });
};

// ── Seed Default Categories ────────────────────────────────────────────────────

/**
 * Insert the 10 default plant categories if they do not already exist.
 * Uses case-insensitive matching so re-running the seed is idempotent.
 * Each category is created with the provided adminId as createdBy.
 *
 * Returns a summary of inserted vs skipped counts.
 *
 * @param {string} adminId
 * @returns {Promise<{ inserted: number, skipped: number, categories: string[] }>}
 */
export const seedDefaultCategories = async (adminId) => {
  let inserted = 0;
  let skipped  = 0;
  const insertedNames = [];

  for (const item of DEFAULT_CATEGORIES) {
    // Case-insensitive existence check
    const exists = await Category.exists({
      name: {
        $regex: new RegExp(
          `^${item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          "i"
        ),
      },
    });

    if (exists) {
      skipped++;
      continue;
    }

    // Create — model pre-save hook sets the slug
    await Category.create({
      name:        item.name,
      description: item.description,
      createdBy:   adminId,
    });

    inserted++;
    insertedNames.push(item.name);
  }

  return { inserted, skipped, categories: insertedNames };
};