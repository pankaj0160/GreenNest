import { param } from "express-validator";

export const wishlistProductValidator = [
  param("productId")
    .notEmpty().withMessage("Product ID is required")
    .isMongoId().withMessage("Invalid product ID"),
];