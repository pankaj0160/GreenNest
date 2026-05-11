import AppError from "../utils/AppError.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import MESSAGES from "../constants/messages.js";

/**
 * authorize.js
 * Role-based access control middleware.
 * Must be used AFTER authenticate (needs req.user).
 *
 * Usage:
 *   router.delete("/users/:id", authenticate, authorize("admin"), deleteUser)
 *   router.post("/products", authenticate, authorize("vendor", "admin"), createProduct)
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN));
    }
    next();
  };
};

export default authorize;