import multer from "multer";
import AppError from "../utils/AppError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

/**
 * upload.js
 * Multer middleware factory for product image uploads.
 *
 * Design decisions:
 * - memoryStorage: files are held in RAM as Buffer objects and streamed
 *   directly to Cloudinary — no temp files written to disk, cleaner for
 *   serverless/containerized deployments.
 * - File filter: rejects non-image MIME types at the middleware layer
 *   before any service code runs.
 * - File size: 5 MB per file (Cloudinary free tier sweet spot).
 * - Max count: enforced here AND in the service — defence in depth.
 *   The validator in the service catches edge cases (e.g. existing images
 *   on an update request).
 *
 * Usage:
 *   router.post("/", authenticate, uploadProductImages, createProduct)
 *   router.put("/:id", authenticate, uploadProductImages, updateProduct)
 */

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGE_COUNT = 8;

// ── Multer instance ──────────────────────────────────────────────────────────

const multerUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_IMAGE_COUNT, // multer rejects if > 8 files sent
  },

  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new AppError(
          `Invalid file type "${file.mimetype}". Only JPEG, PNG, and WebP images are allowed.`,
          HTTP_STATUS.BAD_REQUEST
        ),
        false
      );
    }
    cb(null, true);
  },
});

// ── Exported middleware ──────────────────────────────────────────────────────

/**
 * uploadProductImages
 * Accepts up to 8 files under the field name "images".
 * After this middleware, req.files is an array of Multer file objects
 * (each with .buffer, .mimetype, .originalname, .size).
 *
 * Multer errors (LIMIT_FILE_SIZE, LIMIT_FILE_COUNT, invalid type) are
 * caught and forwarded to the global error handler as AppError instances.
 */
export const uploadProductImages = (req, res, next) => {
  multerUpload.array("images", MAX_IMAGE_COUNT)(req, res, (err) => {
    if (!err) return next();

    // Transform multer-specific errors into AppError for consistent formatting
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new AppError(
          `File too large. Each image must be under ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`,
          HTTP_STATUS.BAD_REQUEST
        )
      );
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return next(
        new AppError(
          `Too many images. Maximum ${MAX_IMAGE_COUNT} images allowed per product.`,
          HTTP_STATUS.BAD_REQUEST
        )
      );
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return next(
        new AppError(
          `Unexpected field. Use "images" as the field name for file uploads.`,
          HTTP_STATUS.BAD_REQUEST
        )
      );
    }

    // Pass through AppError thrown inside fileFilter
    if (err instanceof AppError) return next(err);

    // Unknown multer error — treat as operational with a readable message
    return next(
      new AppError(err.message || "File upload error.", HTTP_STATUS.BAD_REQUEST)
    );
  });
};

export { MAX_IMAGE_COUNT };