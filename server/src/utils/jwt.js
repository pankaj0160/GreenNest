import jwt from "jsonwebtoken";
import env from "../config/env.js";

/**
 * Sign a JWT access token.
 * @param {string} userId - MongoDB ObjectId as string
 * @returns {string} Signed JWT
 */
export const signToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Verify a JWT and return its decoded payload.
 * Throws JsonWebTokenError or TokenExpiredError on failure —
 * these are caught and transformed by the global error handler.
 * @param {string} token
 * @returns {{ id: string, iat: number, exp: number }}
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

/**
 * Attach the JWT as an HTTP-only cookie on the response.
 * HTTP-only cookies cannot be read by JS — protects against XSS.
 * sameSite: "strict" prevents CSRF attacks.
 *
 * @param {Response} res    - Express response object
 * @param {string}   token  - Signed JWT
 */
export const attachCookie = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: env.isProd,           // HTTPS only in production
    sameSite: env.isProd ? "strict" : "lax",
    maxAge: env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000, // days → ms
  });
};

/**
 * Clear the JWT cookie on logout.
 * @param {Response} res
 */
export const clearCookie = (res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "strict" : "lax",
    expires: new Date(0), // immediately expired
  });
};