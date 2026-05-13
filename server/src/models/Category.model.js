import mongoose from "mongoose";
import slugify from "slugify";

/**
 * Category.model.js
 * Plant categories managed by admin.
 * Soft-delete via isActive flag — data preserved for historical orders/products.
 */

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    image: {
      type: String,
      default: null, // Cloudinary URL
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ── Auto-generate slug from name ─────────────────────────────────────────────
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// ── Indexes ───────────────────────────────────────────────────────────────────
categorySchema.index({ name: "text" }); // text search support

const Category = mongoose.model("Category", categorySchema);

export default Category;