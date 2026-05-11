/**
 * db.js
 * Handles MongoDB connection lifecycle.
 *
 * Design decisions:
 * - Retry logic: transient network issues during startup should not crash the server permanently.
 *   We retry 3 times with a 5s delay before giving up.
 * - Graceful shutdown: when the process receives SIGINT (Ctrl+C), we close the DB connection
 *   cleanly to avoid connection leaks in development.
 * - Event listeners: log connection state changes so ops can see DB health in logs.
 */

import mongoose from "mongoose";
import env from "./env.js";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const connectDB = async (attempt = 1) => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      // These options are the recommended defaults for mongoose 7+
      serverSelectionTimeoutMS: 5000, // Fail fast if no server found
      socketTimeoutMS: 45000,         // How long to wait on queries
    });

    console.log(
      `✅  MongoDB connected: ${conn.connection.host} [${env.NODE_ENV}]`
    );
  } catch (error) {
    console.error(
      `❌  MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`
    );

    if (attempt < MAX_RETRIES) {
      console.log(`   Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      return connectDB(attempt + 1);
    }

    console.error("   All retry attempts exhausted. Shutting down.");
    process.exit(1);
  }
};

// ── Connection Event Listeners ──────────────────────────────────────────────

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️   MongoDB disconnected.");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄  MongoDB reconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error(`💥  MongoDB error: ${err.message}`);
});

// ── Graceful Shutdown ───────────────────────────────────────────────────────

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("\n🛑  MongoDB connection closed due to app termination.");
  process.exit(0);
});

export default connectDB;
