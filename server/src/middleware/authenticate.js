import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import MESSAGES from "../constants/messages.js";

/**
 * authenticate.js
 * Verifies the JWT from either:
 *   1. Authorization header: "Bearer <token>"
 *   2. HTTP-only cookie:     jwt=<token>
 *
 * Attaches the full user document to req.user.
 * Downstream middleware (authorize) uses req.user.role.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Fallback to cookie
  if (!token && req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError(MESSAGES.AUTH.TOKEN_MISSING, HTTP_STATUS.UNAUTHORIZED));
  }

  // Verify — throws JsonWebTokenError or TokenExpiredError, caught by errorHandler
  const decoded = verifyToken(token);

  // Fetch fresh user — ensures token is still valid if user was deactivated
  const user = await User.findById(decoded.id).select("+isActive");
  if (!user) {
    return next(new AppError(MESSAGES.AUTH.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED));
  }

  if (!user.isActive) {
    return next(new AppError(MESSAGES.AUTH.ACCOUNT_INACTIVE, HTTP_STATUS.FORBIDDEN));
  }

  req.user = user;
  next();
});

export default authenticate;