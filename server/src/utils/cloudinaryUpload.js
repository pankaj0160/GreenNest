import { v2 as cloudinary } from "cloudinary";
import env from "../config/env.js";
import AppError from "./AppError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

/**
 * cloudinaryUpload.js
 * Utility for uploading and deleting images on Cloudinary.
 *
 * Why a separate utility (not inline in the service)?
 * - Keeps Cloudinary SDK knowledge out of business logic.
 * - Easier to swap storage provider later (S3, GCS) by changing only this file.
 * - Centralizes upload options (folder, quality, format) in one place.
 *
 * Configuration is handled by config/cloudinary.js which calls cloudinary.config().
 * We import cloudinary here after that has been called.
 */

// Ensure cloudinary is configured before any upload calls
// (config/cloudinary.js is imported in server.js / app.js startup)
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a single image Buffer to Cloudinary.
 *
 * @param {Buffer} buffer      - File buffer from multer memoryStorage
 * @param {string} mimetype    - MIME type (e.g. "image/jpeg")
 * @param {string} folder      - Cloudinary folder path (e.g. "greennest/products")
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export const uploadImageToCloudinary = (buffer, mimetype, folder = "greennest/products") => {
  return new Promise((resolve, reject) => {
    // Derive the resource format from mimetype
    const format = mimetype.split("/")[1]; // "jpeg" | "png" | "webp"

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format: format === "jpg" ? "jpeg" : format,
        quality: "auto:good",       // Smart compression
        fetch_format: "auto",       // Serve WebP to capable browsers
        transformation: [
          { width: 1200, height: 1200, crop: "limit" }, // Cap at 1200×1200
        ],
      },
      (error, result) => {
        if (error) {
          return reject(
            new AppError(
              `Cloudinary upload failed: ${error.message}`,
              HTTP_STATUS.INTERNAL_SERVER_ERROR
            )
          );
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Upload multiple image buffers concurrently.
 *
 * @param {Array<{ buffer: Buffer, mimetype: string }>} files
 * @param {string} folder
 * @returns {Promise<string[]>} Array of secure Cloudinary URLs
 */
export const uploadMultipleImages = async (files, folder = "greennest/products") => {
  if (!files || files.length === 0) return [];

  const uploads = files.map((file) =>
    uploadImageToCloudinary(file.buffer, file.mimetype, folder)
  );

  // Promise.all — fail fast if any upload fails
  const results = await Promise.all(uploads);
  return results.map((r) => r.url);
};

/**
 * Delete an image from Cloudinary by its public ID.
 * Extracted from the stored URL if needed.
 *
 * @param {string} publicIdOrUrl - Cloudinary public_id OR full secure_url
 * @returns {Promise<void>}
 */
export const deleteImageFromCloudinary = async (publicIdOrUrl) => {
  if (!publicIdOrUrl) return;

  let publicId = publicIdOrUrl;

  // If a full URL was passed, extract the public_id
  // e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/greennest/products/abc.jpg
  //       → greennest/products/abc
  if (publicIdOrUrl.startsWith("http")) {
    const parts = publicIdOrUrl.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex !== -1) {
      // Skip the version segment (v1234567890)
      const afterUpload = parts.slice(uploadIndex + 1);
      if (afterUpload[0]?.startsWith("v") && /^v\d+$/.test(afterUpload[0])) {
        afterUpload.shift();
      }
      const withExt = afterUpload.join("/");
      publicId = withExt.replace(/\.[^/.]+$/, ""); // strip extension
    }
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // Non-fatal — log but don't crash the request if delete fails
    console.warn(`[Cloudinary] Failed to delete image: ${publicId}`);
  }
};