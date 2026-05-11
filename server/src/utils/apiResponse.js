/**
 * apiResponse.js
 * Utility functions for sending standardized API responses.
 *
 * Why standardize responses?
 * - Every API response has the same shape — frontend can reliably
 *   destructure `{ success, message, data }` without guessing.
 * - Centralizes status/structure logic so controllers stay clean.
 *
 * Standard response shape:
 * {
 *   success: true | false,
 *   message: "Human-readable message",
 *   data: { ... } | null,         // present on success
 *   errors: [ ... ] | null,       // present on validation failures
 *   stack: "..." | undefined      // only in development
 * }
 */

import env from "../config/env.js";

/**
 * Send a success response.
 * @param {Response} res       - Express response object
 * @param {number}   statusCode - HTTP status code (default 200)
 * @param {string}   message   - Human-readable success message
 * @param {*}        data      - Payload to send (object, array, null)
 * @param {object}   meta      - Optional pagination/extra metadata
 */
export const successResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = null,
  meta = null
) => {
  const body = {
    success: true,
    message,
    data,
  };

  if (meta) body.meta = meta;

  return res.status(statusCode).json(body);
};

/**
 * Send an error response.
 * @param {Response} res       - Express response object
 * @param {number}   statusCode - HTTP status code
 * @param {string}   message   - Human-readable error message
 * @param {Array}    errors    - Optional field-level errors (from validators)
 * @param {Error}    err       - Original error (for stack trace in dev)
 */
export const errorResponse = (
  res,
  statusCode = 500,
  message = "Something went wrong",
  errors = null,
  err = null
) => {
  const body = {
    success: false,
    message,
    errors,
  };

  // Only expose stack traces in development — never in production
  if (env.isDev && err?.stack) {
    body.stack = err.stack;
  }

  return res.status(statusCode).json(body);
};
