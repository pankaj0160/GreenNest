import nodemailer from "nodemailer";
import env from "../config/env.js";

/**
 * Create the nodemailer transporter.
 * In development, if EMAIL_USER is not set, logs emails to console instead.
 */
const createTransporter = () => {
  if (!env.EMAIL_USER) {
    return null; // dev fallback: log to console
  }
  return nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_PORT === 465,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
};

/**
 * Core send function.
 * @param {object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 */
const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  if (!transporter) {
    // Dev mode: log instead of sending
    console.log("\n📧  [DEV] Email would be sent:");
    console.log(`   To      : ${to}`);
    console.log(`   Subject : ${subject}`);
    console.log(`   Body    : ${html.replace(/<[^>]+>/g, "").trim().slice(0, 200)}`);
    console.log("");
    return;
  }

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

// ── Email Templates ───────────────────────────────────────────────────────────

/**
 * Send email verification OTP.
 */
export const sendVerificationEmail = async ({ to, name, otp }) => {
  await sendEmail({
    to,
    subject: "Verify your GreenNest account",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#15803d;margin:0 0 8px;">🌱 Welcome to GreenNest, ${name}!</h2>
        <p style="color:#6b7280;margin:0 0 24px;">Use the OTP below to verify your email address. It expires in <strong>15 minutes</strong>.</p>
        <div style="background:#f0fdf4;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#15803d;">${otp}</span>
        </div>
        <p style="color:#9ca3af;font-size:13px;">If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
  });
};

/**
 * Send password reset OTP.
 */
export const sendPasswordResetEmail = async ({ to, name, otp }) => {
  await sendEmail({
    to,
    subject: "Reset your GreenNest password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#15803d;margin:0 0 8px;">🔐 Password Reset</h2>
        <p style="color:#6b7280;margin:0 0 8px;">Hi ${name}, use the OTP below to reset your password. It expires in <strong>15 minutes</strong>.</p>
        <div style="background:#fef2f2;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#dc2626;">${otp}</span>
        </div>
        <p style="color:#9ca3af;font-size:13px;">If you didn't request a password reset, please ignore this email. Your account is safe.</p>
      </div>
    `,
  });
};