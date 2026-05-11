import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

/**
 * validate.js
 * Runs after express-validator chains and short-circuits the request
 * if any validation errors exist. Formats errors as an array so the
 * frontend can display per-field messages.
 *
 * Usage:
 *   router.post("/signup", signupValidator, validate, signupController)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return next(
      new AppError("Validation failed.", HTTP_STATUS.BAD_REQUEST, formatted)
    );
  }
  next();
};

export default validate;