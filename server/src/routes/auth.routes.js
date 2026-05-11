import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import authenticate from "../middleware/authenticate.js";
import validate from "../middleware/validate.js";
import {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
  deleteUnverifiedValidator,
} from "../validators/auth.validators.js";

const router = Router();

// ── Public Routes ───────────────────────────────────────────

router.post(
  "/signup",
  signupValidator,
  validate,
  authController.signup
);

router.post(
  "/verify-email",
  verifyEmailValidator,
  validate,
  authController.verifyEmail
);

router.post(
  "/resend-verification",
  forgotPasswordValidator,
  validate,
  authController.resendVerification
);

router.post(
  "/login",
  loginValidator,
  validate,
  authController.login
);

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordValidator,
  validate,
  authController.resetPassword
);

router.post(
  "/delete-unverified",
  deleteUnverifiedValidator,
  validate,
  authController.deleteUnverifiedAccount
);

// ── Protected Routes ───────────────────────────────────────

router.post(
  "/logout",
  authenticate,
  authController.logout
);

router.get(
  "/me",
  authenticate,
  authController.getMe
);

export default router;