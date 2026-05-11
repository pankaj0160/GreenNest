/**
 * asyncHandler.js
 * Wraps async express route handlers to automatically catch rejected promises
 * and forward them to the global error handler via next(err).
 *
 * Why: Without this, every async controller needs its own try/catch block.
 * With this, controllers stay clean and errors bubble up consistently.
 *
 * Usage:
 *   router.get("/", asyncHandler(async (req, res) => {
 *     const data = await someAsyncOperation();
 *     res.json(data);
 *   }));
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
