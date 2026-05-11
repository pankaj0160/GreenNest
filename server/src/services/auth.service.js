import crypto from "crypto";
import User from "../models/User.model.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email.js";
import AppError from "../utils/AppError.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import MESSAGES from "../constants/messages.js";


/**
 * auth.service.js
 * All authentication business logic lives here.
 * Controllers call these functions — they stay thin.
 */

// ── Signup ────────────────────────────────────────────────────────────────────
export const signup = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError(
      MESSAGES.AUTH.EMAIL_ALREADY_EXISTS,
      HTTP_STATUS.CONFLICT
    );
  }

  const { otp, hashedOtp, expiry } = generateOtp();

  let user;

  try {
    user = await User.create({
      name,
      email,
      password,
      role: role || "customer",
      emailVerificationToken: hashedOtp,
      emailVerificationExpiry: expiry,
    });

    await sendVerificationEmail({
      to: email,
      name,
      otp,
    });

    return user;
  } catch (error) {
    if (user) {
      await User.deleteOne({ _id: user._id });
    }

    throw error;
  }
};

// ── Verify Email ──────────────────────────────────────────────────────────────
export const verifyEmail = async ({ email, otp }) => {
  const user = await User.findOne({ email })
    .select("+emailVerificationToken +emailVerificationExpiry");

  if (!user) {
    throw new AppError(MESSAGES.AUTH.INVALID_VERIFICATION_TOKEN, HTTP_STATUS.BAD_REQUEST);
  }

  if (user.isEmailVerified) {
    // Idempotent — already verified is fine
    return user;
  }

  if (!user.emailVerificationToken || !user.emailVerificationExpiry) {
    throw new AppError(MESSAGES.AUTH.INVALID_VERIFICATION_TOKEN, HTTP_STATUS.BAD_REQUEST);
  }

  if (user.emailVerificationExpiry < new Date()) {
    throw new AppError("Verification OTP has expired. Please request a new one.", HTTP_STATUS.BAD_REQUEST);
  }

  const hashedOtp = hashOtp(otp);
  if (user.emailVerificationToken !== hashedOtp) {
    throw new AppError(MESSAGES.AUTH.INVALID_VERIFICATION_TOKEN, HTTP_STATUS.BAD_REQUEST);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  return user;
};

// ── Resend Verification ───────────────────────────────────────────────────────
export const resendVerification = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal whether email exists — security best practice
    return;
  }

  if (user.isEmailVerified) return;

  const { otp, hashedOtp, expiry } = generateOtp();
  user.emailVerificationToken = hashedOtp;
  user.emailVerificationExpiry = expiry;
  await user.save();

  await sendVerificationEmail({ to: email, name: user.name, otp });
};

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = async ({ email, password }) => {
  // Select password explicitly (select: false on model)
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  if (!user.isEmailVerified) {
    throw new AppError(MESSAGES.AUTH.EMAIL_NOT_VERIFIED, HTTP_STATUS.FORBIDDEN);
  }

  if (!user.isActive) {
    throw new AppError(MESSAGES.AUTH.ACCOUNT_INACTIVE, HTTP_STATUS.FORBIDDEN);
  }

  // Update last login
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return user;
};

// ── Forgot Password ───────────────────────────────────────────────────────────
export const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });

  // Always respond the same way — don't reveal if email exists
  if (!user || !user.isActive) return;

  const { otp, hashedOtp, expiry } = generateOtp();
  user.passwordResetToken = hashedOtp;
  user.passwordResetExpiry = expiry;
  await user.save({ validateBeforeSave: false });

  await sendPasswordResetEmail({ to: email, name: user.name, otp });
};

// ── Reset Password ────────────────────────────────────────────────────────────
export const resetPassword = async ({ email, otp, password }) => {
  const user = await User.findOne({ email })
    .select("+passwordResetToken +passwordResetExpiry");

  if (!user || !user.passwordResetToken) {
    throw new AppError(MESSAGES.AUTH.INVALID_RESET_TOKEN, HTTP_STATUS.BAD_REQUEST);
  }

  if (user.passwordResetExpiry < new Date()) {
    throw new AppError("Reset OTP has expired. Please request a new one.", HTTP_STATUS.BAD_REQUEST);
  }

  const hashedOtp = hashOtp(otp);
  if (user.passwordResetToken !== hashedOtp) {
    throw new AppError(MESSAGES.AUTH.INVALID_RESET_TOKEN, HTTP_STATUS.BAD_REQUEST);
  }

  user.password = password; // pre-save hook will hash this
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  await user.save();

  return user;
};

// ── Get Me ────────────────────────────────────────────────────────────────────
export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  return user;
};

export const deleteUnverifiedAccount = async ({ email }) => {
  if (!email) {
    throw new AppError("Email is required.", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("No account found for this email.", 404);
  }

  if (user.isEmailVerified) {
    throw new AppError(
      "This account is already verified and cannot be deleted.",
      400
    );
  }

  await User.deleteOne({ email });

  return true;
};