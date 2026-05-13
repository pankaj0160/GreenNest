import * as categoryService from "../services/category.service.js";
import { successResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import MESSAGES from "../constants/messages.js";

/**
 * category.controller.js
 * Thin layer — reads req, calls service, sends standardised response.
 * No business logic here. Follows the exact same pattern as product.controller.js.
 */

// ── POST /api/categories ───────────────────────────────────────────────────────
export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.user._id);

  return successResponse(
    res,
    HTTP_STATUS.CREATED,
    MESSAGES.CATEGORY.CREATED,
    { category }
  );
});

// ── GET /api/categories ────────────────────────────────────────────────────────
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();

  return successResponse(
    res,
    HTTP_STATUS.OK,
    MESSAGES.CATEGORY.LIST_FETCHED,
    { categories }
  );
});

// ── PUT /api/categories/:id ────────────────────────────────────────────────────
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    MESSAGES.CATEGORY.UPDATED,
    { category }
  );
});

// ── DELETE /api/categories/:id ─────────────────────────────────────────────────
export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    MESSAGES.CATEGORY.DELETED,
    null
  );
});

// ── POST /api/categories/seed ──────────────────────────────────────────────────
export const seedDefaultCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.seedDefaultCategories(req.user._id);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    `Seed complete. Inserted: ${result.inserted}, Skipped (already exist): ${result.skipped}.`,
    { inserted: result.inserted, skipped: result.skipped, categories: result.categories }
  );
});