/**
 * app.js
 * Express application configuration.
 *
 * Responsibilities:
 * - Register global middleware (security, logging, parsing)
 * - Mount all API routes
 * - Register 404 and global error handlers
 *
 * Intentionally separated from server.js:
 * - app.js = "what the app does"
 * - server.js = "how the app runs" (port binding, DB connection)
 * This separation makes the app easier to test (import app without starting a server).
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";

import env from "./config/env.js";
import apiRouter from "./routes/index.routes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// ── Security Middleware ──────────────────────────────────────────────────────

// helmet: sets secure HTTP headers (XSS protection, no sniff, frameguard, etc.)
app.use(helmet());

// cors: allow requests from the frontend origin
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,           // Required for cookies to be sent cross-origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Request Parsing ──────────────────────────────────────────────────────────

app.use(express.json({ limit: "10mb" }));           // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies
app.use(cookieParser());                             // Parse cookies (for JWT in cookies)

// ── Sanitization ─────────────────────────────────────────────────────────────

// mongoSanitize: strips $, . from request body/params to prevent NoSQL injection
app.use(mongoSanitize());

// ── Logging ──────────────────────────────────────────────────────────────────

// morgan: HTTP request logging
// 'dev' format in development, 'combined' (Apache-style) in production
if (env.isDev) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ── API Routes ───────────────────────────────────────────────────────────────

app.use("/api", apiRouter);

// ── 404 Handler ──────────────────────────────────────────────────────────────
// Catches any request that didn't match a route above
app.use(notFound);

// ── Global Error Handler ─────────────────────────────────────────────────────
// Must be LAST — Express identifies error handlers by their 4-argument signature
app.use(errorHandler);

export default app;
