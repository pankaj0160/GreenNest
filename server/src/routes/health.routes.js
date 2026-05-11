/**
 * health.routes.js
 * Simple health check endpoint used by:
 * - Deployment platforms (Render, Railway) to verify the service is alive
 * - Load balancers for uptime monitoring
 * - Developers to verify the server and DB are connected
 */

import { Router } from "express";
import mongoose from "mongoose";
import { successResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../constants/httpStatus.js";

const router = Router();

router.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState;

  // Mongoose connection states: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const dbStateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const isHealthy = dbStatus === 1;

  return successResponse(
    res,
    isHealthy ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE,
    isHealthy ? "Server is healthy" : "Server is degraded",
    {
      status: isHealthy ? "ok" : "degraded",
      environment: process.env.NODE_ENV,
      uptime: `${Math.floor(process.uptime())}s`,
      timestamp: new Date().toISOString(),
      database: dbStateMap[dbStatus] || "unknown",
    }
  );
});

export default router;
