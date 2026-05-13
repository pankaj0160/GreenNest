import { body } from "express-validator";

export const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Category name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
];

export const updateCategoryValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

  body("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be a boolean"),
];