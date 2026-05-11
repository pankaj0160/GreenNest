/**
 * AppError.js
 * Custom error class that extends the native Error.
 *
 * Why a custom error class?
 * - Distinguishes operational errors (expected: 404, 401, validation) from
 *   programmer errors (unexpected: cannot read property of undefined).
 * - The `isOperational` flag tells the global error handler whether to send
 *   a detailed message to the client or a generic "Something went wrong."
 * - Attaches a `statusCode` so controllers don't need to hardcode status codes
 *   in the error handler.
 *
 * Usage:
 *   throw new AppError("Product not found", 404);
 *   throw new AppError("Invalid credentials", 401);
 */

class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Marks this as a known, handled error
    this.errors = errors;      // Optional: field-level validation errors array

    // Captures the stack trace, excluding this constructor call itself
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
