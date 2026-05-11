/**
 * server.js
 * Application entry point.
 *
 * Responsibilities:
 * - Connect to MongoDB
 * - Start the HTTP server
 * - Handle unhandled promise rejections and uncaught exceptions
 *
 * Why handle unhandledRejection and uncaughtException?
 * - These are the "last resort" safety nets for errors that escape all try/catch blocks.
 * - We log them and exit gracefully so the process manager (PM2, Docker) can restart cleanly.
 * - Continuing after an uncaughtException is unsafe — the process state may be corrupted.
 */

import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

// ── Unhandled Rejection Handler ──────────────────────────────────────────────
// Catches async errors that were never caught (e.g., a rejected promise with no .catch)
process.on("unhandledRejection", (reason, promise) => {
  console.error("💥  UNHANDLED REJECTION:", reason);
  console.error("   Promise:", promise);
  // Gracefully shut down
  server.close(() => {
    process.exit(1);
  });
});

// ── Uncaught Exception Handler ───────────────────────────────────────────────
// Catches synchronous errors that bubbled all the way up
process.on("uncaughtException", (err) => {
  console.error("💥  UNCAUGHT EXCEPTION:", err.name, err.message);
  console.error(err.stack);
  process.exit(1); // Must exit — process state is unreliable after this
});

// ── Start Sequence ───────────────────────────────────────────────────────────

const startServer = async () => {
  // 1. Connect to MongoDB first — if DB fails, don't start accepting requests
  await connectDB();

  // 2. Start HTTP server
  const server = app.listen(env.PORT, () => {
    console.log(`\n🌱  GreenNest API is running`);
    console.log(`   Environment : ${env.NODE_ENV}`);
    console.log(`   Port        : ${env.PORT}`);
    console.log(`   Health      : http://localhost:${env.PORT}/api/health\n`);
  });

  return server;
};

const server = await startServer();

export default server;
