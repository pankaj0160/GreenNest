/**
 * messages.js
 * Centralized string constants for API response messages.
 *
 * Why: Prevents typo-driven inconsistencies in response messages across controllers.
 * Groups messages by domain for easy lookup.
 */

const MESSAGES = {
  // ── General ─────────────────────────────────────────────────────────────
  SUCCESS: "Success",
  SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",
  NOT_FOUND: "Resource not found.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  VALIDATION_ERROR: "Validation failed.",
  TOO_MANY_REQUESTS: "Too many requests. Please slow down.",

  // ── Auth ─────────────────────────────────────────────────────────────────
  AUTH: {
    SIGNUP_SUCCESS: "Account created successfully. Please verify your email.",
    LOGIN_SUCCESS: "Logged in successfully.",
    LOGOUT_SUCCESS: "Logged out successfully.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    EMAIL_NOT_VERIFIED: "Please verify your email before logging in.",
    EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
    EMAIL_VERIFIED: "Email verified successfully.",
    VERIFICATION_EMAIL_SENT: "Verification email sent. Please check your inbox.",
    INVALID_VERIFICATION_TOKEN: "Invalid or expired verification token.",
    PASSWORD_RESET_EMAIL_SENT: "Password reset link sent to your email.",
    INVALID_RESET_TOKEN: "Invalid or expired password reset token.",
    PASSWORD_RESET_SUCCESS: "Password reset successfully. Please log in.",
    ACCOUNT_INACTIVE: "Your account has been deactivated. Contact support.",
    TOKEN_MISSING: "Authentication token missing.",
    TOKEN_INVALID: "Invalid or expired token.",
  },

  // ── User ─────────────────────────────────────────────────────────────────
  USER: {
    FETCHED: "User fetched successfully.",
    UPDATED: "User updated successfully.",
    DELETED: "User deleted successfully.",
    NOT_FOUND: "User not found.",
  },

  // ── Product ──────────────────────────────────────────────────────────────
  PRODUCT: {
    CREATED: "Product created successfully.",
    UPDATED: "Product updated successfully.",
    DELETED: "Product deleted successfully.",
    FETCHED: "Product fetched successfully.",
    LIST_FETCHED: "Products fetched successfully.",
    NOT_FOUND: "Product not found.",
    NOT_OWNER: "You are not authorised to modify this product.",
  },

  // ── Category ─────────────────────────────────────────────────────────────
  CATEGORY: {
    CREATED: "Category created successfully.",
    UPDATED: "Category updated successfully.",
    DELETED: "Category deleted successfully.",
    FETCHED: "Category fetched successfully.",
    LIST_FETCHED: "Categories fetched successfully.",
    NOT_FOUND: "Category not found.",
    ALREADY_EXISTS: "A category with this name already exists.",
  },

  // ── Wishlist ──────────────────────────────────────────────────────────────
  WISHLIST: {
    FETCHED: "Wishlist fetched successfully.",
    ADDED: "Product added to wishlist.",
    REMOVED: "Product removed from wishlist.",
    CLEARED: "Wishlist cleared.",
  },

  // ── Order ────────────────────────────────────────────────────────────────
  ORDER: {
    PLACED: "Order placed successfully.",
    FETCHED: "Order fetched successfully.",
    LIST_FETCHED: "Orders fetched successfully.",
    UPDATED: "Order status updated.",
    NOT_FOUND: "Order not found.",
    CANNOT_CANCEL: "This order cannot be cancelled at this stage.",
  },

  // ── Booking ──────────────────────────────────────────────────────────────
  BOOKING: {
    CREATED: "Booking confirmed successfully.",
    CANCELLED: "Booking cancelled.",
    FETCHED: "Booking fetched successfully.",
    LIST_FETCHED: "Bookings fetched successfully.",
    NOT_FOUND: "Booking not found.",
    SLOT_UNAVAILABLE: "This slot is no longer available.",
    CONFLICT: "A booking conflict exists for this time slot.",
  },

  // ── Upload ───────────────────────────────────────────────────────────────
  UPLOAD: {
    SUCCESS: "File uploaded successfully.",
    FAILED: "File upload failed.",
    INVALID_TYPE: "Invalid file type. Only images are allowed.",
    TOO_LARGE: "File size exceeds the 5MB limit.",
  },
};

export default MESSAGES;