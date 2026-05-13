import slugify from "slugify";
import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";
import { uploadMultipleImages, deleteImageFromCloudinary } from "../utils/cloudinaryUpload.js";
import AppError from "../utils/AppError.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import MESSAGES from "../constants/messages.js";

/**
 * product.service.js
 * All product business logic lives here.
 * Controllers call these functions and stay thin.
 *
 * Responsibilities moved OUT of the model (per instructions):
 * - Slug generation (unique, collision-safe)
 * - Discount price validation against price
 * - Image count enforcement (defense-in-depth after multer)
 */

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a URL-safe slug from a product name.
 * Resolves collisions by appending an incrementing suffix.
 *
 * @param {string} name      - Raw product name
 * @param {string} [excludeId] - Product _id to exclude from collision check (for updates)
 * @returns {Promise<string>} - Unique slug
 */
const generateUniqueSlug = async (name, excludeId = null) => {
  const base = slugify(name, { lower: true, strict: true, trim: true });
  let slug = base;
  let counter = 0;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };

    const exists = await Product.exists(query);
    if (!exists) break;

    counter++;
    slug = `${base}-${counter}`;
  }

  return slug;
};

/**
 * Validate that discountPrice < price.
 * Centralised here so the same rule is enforced on create AND update.
 *
 * @param {number|null} discountPrice
 * @param {number}      price
 */
const validateDiscountPrice = (discountPrice, price) => {
  if (discountPrice === null || discountPrice === undefined) return;
  if (parseFloat(discountPrice) >= parseFloat(price)) {
    throw new AppError(
      "Discount price must be strictly less than the regular price.",
      HTTP_STATUS.BAD_REQUEST
    );
  }
};

/**
 * Build a MongoDB sort object from a query string sort param.
 *
 * Supported values: price_asc | price_desc | rating_desc | newest | oldest
 * Default: newest (createdAt desc)
 */
const buildSortObject = (sort) => {
  const sortMap = {
    price_asc:    { price: 1 },
    price_desc:   { price: -1 },
    rating_desc:  { averageRating: -1 },
    newest:       { createdAt: -1 },
    oldest:       { createdAt: 1 },
  };
  return sortMap[sort] || { createdAt: -1 };
};

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC SERVICE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

// ── Create Product ────────────────────────────────────────────────────────────

/**
 * Create a new product for the authenticated vendor.
 *
 * @param {object} productData  - Validated body fields
 * @param {string} vendorId     - req.user._id (already authenticated vendor)
 * @param {Array}  files        - req.files from multer (may be empty)
 * @returns {Promise<Product>}
 */
export const createProduct = async (productData, vendorId, files = []) => {
  const {
    name,
    description,
    shortDescription,
    price,
    discountPrice = null,
    stock,
    sku,
    category,
    tags,
    careLevel,
    sunlightRequirement,
    wateringFrequency,
    isFeatured,
  } = productData;

  // 1. Verify category exists and is active
  const categoryDoc = await Category.findById(category);
  if (!categoryDoc || !categoryDoc.isActive) {
    throw new AppError("Category not found or is inactive.", HTTP_STATUS.BAD_REQUEST);
  }

  // 2. Validate discount price against price (service-layer rule)
  validateDiscountPrice(discountPrice, price);

  // 3. Enforce max 8 images (defence-in-depth after multer)
  if (files.length > 8) {
    throw new AppError(
      "Cannot upload more than 8 images per product.",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // 4. Generate unique slug (service layer, not model hook)
  const slug = await generateUniqueSlug(name);

  // 5. Upload images to Cloudinary (concurrent)
  let imageUrls = [];
  if (files.length > 0) {
    imageUrls = await uploadMultipleImages(files, "greennest/products");
  }

  // 6. Create the product document
  const product = await Product.create({
    name,
    slug,
    description,
    shortDescription: shortDescription || "",
    price: parseFloat(price),
    discountPrice: discountPrice !== null ? parseFloat(discountPrice) : null,
    stock: parseInt(stock, 10),
    sku: sku || undefined,
    category,
    vendor: vendorId,
    images: imageUrls,
    tags: tags || [],
    careLevel: careLevel || "easy",
    sunlightRequirement: sunlightRequirement || "medium",
    wateringFrequency: wateringFrequency || "weekly",
    isFeatured: isFeatured === true || isFeatured === "true",
  });

  // Populate for the response
  return product.populate([
    { path: "category", select: "name slug" },
    { path: "vendor", select: "name email" },
  ]);
};

// ── Get Products (Public listing with filters) ─────────────────────────────

/**
 * Fetch paginated, filtered, sorted product list.
 * Only returns active products for public access.
 *
 * Supported query params:
 *   search      - text search across name, description, tags
 *   category    - category slug OR ObjectId
 *   minPrice    - minimum price (inclusive)
 *   maxPrice    - maximum price (inclusive)
 *   inStock     - "true" → only products with stock > 0
 *   sort        - price_asc | price_desc | rating_desc | newest | oldest
 *   page        - page number (default 1)
 *   limit       - items per page (default 12, max 48)
 *   featured    - "true" → only featured products
 *
 * @param {object} queryParams - req.query
 * @returns {Promise<{ products, pagination }>}
 */
export const getProducts = async (queryParams) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
    sort,
    featured,
    page = 1,
    limit = 12,
  } = queryParams;

  // ── Build filter ────────────────────────────────────────────────────────
  const filter = { isActive: true };

  // Full-text search (uses the text index on name, description, tags)
  if (search && search.trim()) {
    filter.$text = { $search: search.trim() };
  }

  // Category filter — accepts slug or ObjectId
  if (category) {
    // Try to resolve slug first
    const categoryDoc = await Category.findOne({
      $or: [
        { slug: category },
        // Only match by _id if it looks like a valid ObjectId (24 hex chars)
        ...(category.match(/^[a-f\d]{24}$/i) ? [{ _id: category }] : []),
      ],
      isActive: true,
    }).select("_id");

    if (categoryDoc) {
      filter.category = categoryDoc._id;
    } else {
      // Invalid category → return empty result (not an error)
      return {
        products: [],
        pagination: { total: 0, page: 1, pages: 0, limit: parseInt(limit, 10) },
      };
    }
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
  }

  // Stock filter
  if (inStock === "true") {
    filter.stock = { $gt: 0 };
  }

  // Featured filter
  if (featured === "true") {
    filter.isFeatured = true;
  }

  // ── Pagination ──────────────────────────────────────────────────────────
  const parsedPage  = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.min(48, Math.max(1, parseInt(limit, 10)));
  const skip        = (parsedPage - 1) * parsedLimit;

  // ── Sort ────────────────────────────────────────────────────────────────
  const sortObj = buildSortObject(sort);

  // If using text search, add text score to sort by relevance
  let projection = {};
  if (filter.$text) {
    projection = { score: { $meta: "textScore" } };
    // Prepend text score sort for relevance when searching
    if (!sort) {
      sortObj.score = { $meta: "textScore" };
    }
  }

  // ── Execute queries ─────────────────────────────────────────────────────
  const [products, total] = await Promise.all([
    Product.find(filter, projection)
      .populate("category", "name slug")
      .populate("vendor", "name")
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      limit: parsedLimit,
    },
  };
};

// ── Get Single Product ────────────────────────────────────────────────────────

/**
 * Fetch a single active product by ID or slug.
 *
 * @param {string} idOrSlug - MongoDB ObjectId string OR slug
 * @returns {Promise<Product>}
 */
export const getProductById = async (idOrSlug) => {
  const isObjectId = idOrSlug.match(/^[a-f\d]{24}$/i);

  const filter = {
    isActive: true,
    ...(isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }),
  };

  const product = await Product.findOne(filter)
    .populate("category", "name slug description")
    .populate("vendor", "name email");

  if (!product) {
    throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return product;
};

// ── Get Vendor's Own Products ─────────────────────────────────────────────────

/**
 * Fetch all products (active and inactive) belonging to the authenticated vendor.
 * Supports pagination and sort but not public filters.
 *
 * @param {string} vendorId
 * @param {object} queryParams
 * @returns {Promise<{ products, pagination }>}
 */
export const getVendorProducts = async (vendorId, queryParams) => {
  const { page = 1, limit = 12, sort, search } = queryParams;

  const parsedPage  = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.min(48, Math.max(1, parseInt(limit, 10)));
  const skip        = (parsedPage - 1) * parsedLimit;

  const filter = { vendor: vendorId };

  if (search && search.trim()) {
    filter.$text = { $search: search.trim() };
  }

  const sortObj = buildSortObject(sort);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      limit: parsedLimit,
    },
  };
};

// ── Update Product ────────────────────────────────────────────────────────────

/**
 * Update a product. Enforces vendor ownership.
 * Handles:
 *   - Partial updates (only provided fields changed)
 *   - Slug regeneration if name changes
 *   - Discount validation against the resolved price
 *   - New image uploads merged with/replacing existing images
 *   - Deletion of replaced images from Cloudinary
 *
 * Body field "replaceImages" = "true" → discard all existing images, use only new ones.
 * Otherwise new uploads are appended (up to 8 total).
 *
 * @param {string} productId
 * @param {string} vendorId
 * @param {object} updateData - Validated body
 * @param {Array}  files      - req.files (may be empty)
 * @returns {Promise<Product>}
 */
export const updateProduct = async (productId, vendorId, updateData, files = []) => {
  // 1. Fetch the product
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // 2. Enforce ownership — vendor can only edit their own products
  if (product.vendor.toString() !== vendorId.toString()) {
    throw new AppError(MESSAGES.PRODUCT.NOT_OWNER, HTTP_STATUS.FORBIDDEN);
  }

  const {
    name,
    description,
    shortDescription,
    price,
    discountPrice,
    stock,
    sku,
    category,
    tags,
    careLevel,
    sunlightRequirement,
    wateringFrequency,
    isFeatured,
    isActive,
    replaceImages, // "true" | "false" | undefined
  } = updateData;

  // 3. Resolve the effective price for discount validation
  //    (use incoming price if provided, else existing price)
  const effectivePrice = price !== undefined ? parseFloat(price) : product.price;

  // 4. Validate discount price against effective price
  const effectiveDiscount = discountPrice !== undefined ? discountPrice : product.discountPrice;
  if (effectiveDiscount !== null && effectiveDiscount !== undefined) {
    validateDiscountPrice(effectiveDiscount, effectivePrice);
  }

  // 5. Validate new category exists if provided
  if (category) {
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc || !categoryDoc.isActive) {
      throw new AppError("Category not found or is inactive.", HTTP_STATUS.BAD_REQUEST);
    }
  }

  // 6. Handle images
  let finalImages = [...product.images]; // start with existing
  let imagesToDelete = [];

  if (replaceImages === "true" || replaceImages === true) {
    // Replace mode — delete existing, use only new uploads
    imagesToDelete = [...product.images];
    finalImages = [];
  }

  if (files.length > 0) {
    const remainingSlots = 8 - finalImages.length;
    if (files.length > remainingSlots) {
      throw new AppError(
        `Cannot add ${files.length} image(s). Product already has ${finalImages.length} image(s). Maximum total is 8.`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const newUrls = await uploadMultipleImages(files, "greennest/products");
    finalImages = [...finalImages, ...newUrls];
  }

  // 7. Regenerate slug only if name actually changed
  let slug = product.slug;
  if (name && name !== product.name) {
    slug = await generateUniqueSlug(name, productId);
  }

  // 8. Apply updates (only set fields that were provided)
  if (name !== undefined)                  product.name = name;
  if (slug !== product.slug)              product.slug = slug;
  if (description !== undefined)           product.description = description;
  if (shortDescription !== undefined)      product.shortDescription = shortDescription;
  if (price !== undefined)                 product.price = parseFloat(price);
  if (discountPrice !== undefined)         product.discountPrice = discountPrice !== null ? parseFloat(discountPrice) : null;
  if (stock !== undefined)                 product.stock = parseInt(stock, 10);
  if (sku !== undefined)                   product.sku = sku;
  if (category !== undefined)              product.category = category;
  if (tags !== undefined)                  product.tags = tags;
  if (careLevel !== undefined)             product.careLevel = careLevel;
  if (sunlightRequirement !== undefined)   product.sunlightRequirement = sunlightRequirement;
  if (wateringFrequency !== undefined)     product.wateringFrequency = wateringFrequency;
  if (isFeatured !== undefined)            product.isFeatured = isFeatured === true || isFeatured === "true";
  if (isActive !== undefined)              product.isActive = isActive === true || isActive === "true";

  product.images = finalImages;

  // 9. Save (skips pre-save slug hook — slug already set above)
  await product.save();

  // 10. Delete old images from Cloudinary AFTER successful save
  //     (non-blocking — failures logged but don't abort the response)
  if (imagesToDelete.length > 0) {
    Promise.all(imagesToDelete.map((url) => deleteImageFromCloudinary(url))).catch(
      (err) => console.warn("[Cloudinary] Image cleanup warning:", err.message)
    );
  }

  return product.populate([
    { path: "category", select: "name slug" },
    { path: "vendor", select: "name email" },
  ]);
};

// ── Soft Delete Product ────────────────────────────────────────────────────────

/**
 * Soft-delete a product by setting isActive = false.
 * Only the owning vendor (or admin) can delete.
 *
 * @param {string} productId
 * @param {string} requestingUserId
 * @param {string} requestingUserRole
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId, requestingUserId, requestingUserRole) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Admins can delete any product; vendors only their own
  const isAdmin  = requestingUserRole === "admin";
  const isOwner  = product.vendor.toString() === requestingUserId.toString();

  if (!isAdmin && !isOwner) {
    throw new AppError(MESSAGES.PRODUCT.NOT_OWNER, HTTP_STATUS.FORBIDDEN);
  }

  product.isActive = false;
  await product.save({ validateBeforeSave: false });
};

// ── Update Stock (standalone, used by order service in Phase 4) ───────────────

/**
 * Decrement stock by a given quantity.
 * Throws if insufficient stock.
 *
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Product>}
 */
export const decrementStock = async (productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  if (product.stock < quantity) {
    throw new AppError(
      `Insufficient stock. Only ${product.stock} unit(s) available.`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  product.stock -= quantity;
  return product.save({ validateBeforeSave: false });
};