/**
 * notFound.js
 * Catches all requests that don't match any registered route.
 * Must be registered AFTER all routes but BEFORE the error handler.
 *
 * Forwards an AppError to the global error handler rather than
 * sending a response directly — keeps error formatting centralized.
 */

import AppError from "../utils/AppError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

const notFound = (req, res, next) => {
  next(
    new AppError(
      `Route not found: ${req.method} ${req.originalUrl}`,
      HTTP_STATUS.NOT_FOUND
    )
  );
};

export default notFound;
