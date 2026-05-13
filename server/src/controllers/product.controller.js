import * as productService from "../services/product.service.js";
import { successResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import MESSAGES from "../constants/messages.js";

/**
 * product.controller.js
 * Thin layer — reads req, calls service, sends standardised response.
 * No business logic here. Follows the exact same pattern as auth.controller.js.
 */

// ── POST /api/products ────────────────────────────────────────────────────────
export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(
    req.body,
    req.user._id,
    req.files || []  // multer populates req.files (array field)
  );

  return successResponse(
    res,
    HTTP_STATUS.CREATED,
    MESSAGES.PRODUCT.CREATED,
    { product }
  );
});

// ── GET /api/products ─────────────────────────────────────────────────────────
export const getProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.getProducts(req.query);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    MESSAGES.PRODUCT.LIST_FETCHED,
    { products },
    pagination  // pagination goes into meta (5th arg of successResponse)
  );
});

// ── GET /api/products/vendor/my ───────────────────────────────────────────────
// NOTE: This route MUST be registered BEFORE /:id to avoid "my" being
// treated as a Mongo ObjectId.
export const getMyProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.getVendorProducts(
    req.user._id,
    req.query
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    MESSAGES.PRODUCT.LIST_FETCHED,
    { products },
    pagination
  );
});

// ── GET /api/products/:id ─────────────────────────────────────────────────────
export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    MESSAGES.PRODUCT.FETCHED,
    { product }
  );
});

// ── PUT /api/products/:id ─────────────────────────────────────────────────────
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.user._id,
    req.body,
    req.files || []
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    MESSAGES.PRODUCT.UPDATED,
    { product }
  );
});

// ── DELETE /api/products/:id ──────────────────────────────────────────────────
export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(
    req.params.id,
    req.user._id,
    req.user.role
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    MESSAGES.PRODUCT.DELETED,
    null
  );
});