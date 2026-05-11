import * as authService from "../services/auth.service.js";
import { signToken, attachCookie, clearCookie } from "../utils/jwt.js";
import { successResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import MESSAGES from "../constants/messages.js";

/**
 * auth.controller.js
 * Thin layer — validates input (via middleware), calls service, sends response.
 * No business logic here.
 */

// POST /api/auth/signup
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await authService.signup({ name, email, password, role });

  return successResponse(
    res,
    HTTP_STATUS.CREATED,
    MESSAGES.AUTH.SIGNUP_SUCCESS,
    { user: user.toSafeObject() }
  );
});

// POST /api/auth/verify-email
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await authService.verifyEmail({ email, otp });

  return successResponse(res, HTTP_STATUS.OK, MESSAGES.AUTH.EMAIL_VERIFIED);
});

// POST /api/auth/resend-verification
export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authService.resendVerification({ email });

  // Always return success — don't leak whether email exists
  return successResponse(res, HTTP_STATUS.OK, MESSAGES.AUTH.VERIFICATION_EMAIL_SENT);
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.login({ email, password });
  const token = signToken(user._id.toString());

  attachCookie(res, token);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    MESSAGES.AUTH.LOGIN_SUCCESS,
    {
      user: user.toSafeObject(),
      token, // Also send in body for clients that prefer header auth
    }
  );
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  clearCookie(res);
  return successResponse(res, HTTP_STATUS.OK, MESSAGES.AUTH.LOGOUT_SUCCESS);
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  return successResponse(
    res,
    HTTP_STATUS.OK,
    MESSAGES.USER.FETCHED,
    { user: user.toSafeObject() }
  );
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authService.forgotPassword({ email });

  // Always return same message — don't reveal if email exists
  return successResponse(
    res,
    HTTP_STATUS.OK,
    MESSAGES.AUTH.PASSWORD_RESET_EMAIL_SENT
  );
});

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  await authService.resetPassword({ email, otp, password });

  return successResponse(res, HTTP_STATUS.OK, MESSAGES.AUTH.PASSWORD_RESET_SUCCESS);
});


export const deleteUnverifiedAccount = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authService.deleteUnverifiedAccount({ email });

  return successResponse(
    res,
    HTTP_STATUS.OK,
    "Unverified account deleted successfully."
  );
});