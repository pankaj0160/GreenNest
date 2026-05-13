import mongoose from "mongoose";

/**
 * Product.model.js
 * Core marketplace product schema.
 *
 * Intentional design decisions:
 * - NO pre-save slug hook — slug generation (with collision resolution) is
 *   handled in product.service.js where async DB lookups are straightforward.
 * - NO discount price validation — that business rule lives in the service
 *   so it can access both price and discountPrice together cleanly.
 * - Images are stored as plain URL strings (Cloudinary handles the files).
 * - Soft-delete via isActive — preserves data for order history references.
 */

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [120, "Name cannot exceed 120 characters"],
    },

    // Slug is set by the service before calling Product.create() / .save()
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // null = no discount active
    // Discount < price rule enforced in service, not here
    discountPrice: {
      type: Number,
      default: null,
      min: [0, "Discount price cannot be negative"],
    },

    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    // Optional unique identifier — sparse so nulls don't conflict
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
      default: undefined,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor is required"],
    },

    // Array of Cloudinary secure_url strings — max 8 enforced in service
    images: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    careLevel: {
      type: String,
      enum: {
        values: ["easy", "moderate", "hard"],
        message: "Care level must be easy, moderate, or hard",
      },
      default: "easy",
    },

    sunlightRequirement: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "direct"],
        message: "Invalid sunlight requirement",
      },
      default: "medium",
    },

    wateringFrequency: {
      type: String,
      enum: {
        values: ["daily", "every-2-days", "weekly", "bi-weekly", "monthly"],
        message: "Invalid watering frequency",
      },
      default: "weekly",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Updated by review service in Phase 4
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual ───────────────────────────────────────────────────────────────────
// Convenience getter — always use this for display/cart pricing
productSchema.virtual("effectivePrice").get(function () {
  return this.discountPrice !== null && this.discountPrice !== undefined
    ? this.discountPrice
    : this.price;
});

// ── Indexes ───────────────────────────────────────────────────────────────────
productSchema.index({ slug: 1 });
productSchema.index({ vendor: 1, isActive: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
// Compound text index for full-text search (name, description, tags)
productSchema.index(
  { name: "text", description: "text", tags: "text" },
  { weights: { name: 10, tags: 5, description: 1 }, name: "product_text_search" }
);

const Product = mongoose.model("Product", productSchema);

export default Product;