/**
 * cloudinary.js
 * Configures and exports the Cloudinary v2 SDK instance.
 * Import this wherever file upload to Cloudinary is needed.
 */

import { v2 as cloudinary } from "cloudinary";
import env from "./env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS URLs
});

export default cloudinary;
