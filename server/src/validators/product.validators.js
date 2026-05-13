import { body, query } from "express-validator";

/**
 * product.validators.js
 * Validation chains for product CRUD endpoints.
 */

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Product name is required")
    .isLength({ min: 2, max: 120 }).withMessage("Name must be 2–120 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ max: 5000 }).withMessage("Description cannot exceed 5000 characters"),

  body("shortDescription")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Short description cannot exceed 300 characters"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("discountPrice")
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage("Discount price must be a positive number")
    .custom((val, { req }) => {
      if (val !== null && parseFloat(val) >= parseFloat(req.body.price)) {
        throw new Error("Discount price must be less than the regular price");
      }
      return true;
    }),

  body("stock")
    .notEmpty().withMessage("Stock quantity is required")
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

  body("sku")
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage("SKU cannot exceed 50 characters"),

  body("category")
    .notEmpty().withMessage("Category is required")
    .isMongoId().withMessage("Category must be a valid ID"),

  body("tags")
    .optional()
    .isArray().withMessage("Tags must be an array"),

  body("careLevel")
    .optional()
    .isIn(["easy", "moderate", "hard"]).withMessage("Care level must be easy, moderate, or hard"),

  body("sunlightRequirement")
    .optional()
    .isIn(["low", "medium", "high", "direct"]).withMessage("Invalid sunlight requirement"),

  body("wateringFrequency")
    .optional()
    .isIn(["daily", "every-2-days", "weekly", "bi-weekly", "monthly"])
    .withMessage("Invalid watering frequency"),

  body("isFeatured")
    .optional()
    .isBoolean().withMessage("isFeatured must be a boolean"),
];

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 }).withMessage("Name must be 2–120 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage("Description cannot exceed 5000 characters"),

  body("shortDescription")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Short description cannot exceed 300 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("discountPrice")
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage("Discount price must be a positive number"),

  body("stock")
    .optional()
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

  body("category")
    .optional()
    .isMongoId().withMessage("Category must be a valid ID"),

  body("careLevel")
    .optional()
    .isIn(["easy", "moderate", "hard"]).withMessage("Care level must be easy, moderate, or hard"),

  body("sunlightRequirement")
    .optional()
    .isIn(["low", "medium", "high", "direct"]).withMessage("Invalid sunlight requirement"),

  body("wateringFrequency")
    .optional()
    .isIn(["daily", "every-2-days", "weekly", "bi-weekly", "monthly"])
    .withMessage("Invalid watering frequency"),

  body("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be a boolean"),

  body("isFeatured")
    .optional()
    .isBoolean().withMessage("isFeatured must be a boolean"),
];

export const productQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

  query("minPrice")
    .optional()
    .isFloat({ min: 0 }).withMessage("minPrice must be a positive number"),

  query("maxPrice")
    .optional()
    .isFloat({ min: 0 }).withMessage("maxPrice must be a positive number"),

  query("sort")
    .optional()
    .isIn(["price_asc", "price_desc", "rating_desc", "newest", "oldest"])
    .withMessage("Invalid sort option"),
];