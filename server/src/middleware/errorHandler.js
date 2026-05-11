/**
 * errorHandler.js
 * Global error-handling middleware — the last middleware in the Express stack.
 *
 * Design decisions:
 * - Handles Mongoose, JWT, and custom AppErrors differently.
 * - Only operational errors (AppError) send descriptive messages to clients.
 * - Programmer errors get a generic message so internals are never exposed.
 * - Development mode includes the full stack trace for debugging.
 *
 * Must be registered AFTER all routes in app.js.
 */

import env from "../config/env.js";
import AppError from "../utils/AppError.js";
import { errorResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../constants/httpStatus.js";

// ── Mongoose-specific error transformers ────────────────────────────────────

const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, HTTP_STATUS.BAD_REQUEST);

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(
    `Duplicate value for field "${field}": "${value}". Please use a different value.`,
    HTTP_STATUS.CONFLICT
  );
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return new AppError("Validation failed.", HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
};

// ── JWT error transformers ───────────────────────────────────────────────────

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", HTTP_STATUS.UNAUTHORIZED);

const handleJWTExpiredError = () =>
  new AppError("Your session has expired. Please log in again.", HTTP_STATUS.UNAUTHORIZED);

// ── Main error handler ───────────────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  // Log every error in development for debugging
  if (env.isDev) {
    console.error("💥 ERROR:", err);
  }

  let error = err;

  // Transform known error types into AppError instances
  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  // Operational errors: send the actual message
  if (error.isOperational) {
    return errorResponse(
      res,
      error.statusCode,
      error.message,
      error.errors || null,
      env.isDev ? error : null
    );
  }

  // Programmer/unknown errors: never leak internals
  console.error("💥 UNHANDLED ERROR (non-operational):", err);

  return errorResponse(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    "Something went wrong. Please try again later.",
    null,
    env.isDev ? err : null
  );
};

export default errorHandler;
