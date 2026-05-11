import crypto from "crypto";

/**
 * Generate a 6-digit numeric OTP and its SHA-256 hash.
 * We store the hash in DB, never the raw OTP —
 * same principle as password hashing.
 *
 * @returns {{ otp: string, hashedOtp: string, expiry: Date }}
 */
export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  return { otp, hashedOtp, expiry };
};

/**
 * Hash an incoming OTP for comparison against the stored hash.
 * @param {string} otp
 * @returns {string}
 */
export const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};