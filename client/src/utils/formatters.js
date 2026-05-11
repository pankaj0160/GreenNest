/**
 * formatters.js
 * Utility functions for formatting data for display.
 * Keeps formatting logic out of components.
 */

/**
 * Format a number as Indian Rupees currency string.
 * @param {number} amount
 * @returns {string} e.g., "₹1,299"
 */
export const formatCurrency = (amount) => {
  if (amount == null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date string into human-readable format.
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} e.g., "12 Jul 2024"
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(date));
};

/**
 * Format a date as relative time.
 * @param {string|Date} date
 * @returns {string} e.g., "2 days ago"
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const then = new Date(date);
  const diffMs = then - now;
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffSecs) < 60) return rtf.format(diffSecs, "second");
  if (Math.abs(diffMins) < 60) return rtf.format(diffMins, "minute");
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  return rtf.format(diffDays, "day");
};

/**
 * Truncate a string to a given length.
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export const truncate = (str, length = 100) => {
  if (!str) return "";
  return str.length > length ? `${str.slice(0, length)}...` : str;
};

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Generate initials from a name (for avatar fallback).
 * @param {string} name
 * @returns {string} e.g., "John Doe" → "JD"
 */
export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};
