import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: ["customer", "vendor", "gardener", "admin"],
      default: "customer",
    },
    avatar: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Email verification
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpiry: {
      type: Date,
      select: false,
    },
    // Password reset
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
      select: false,
    },
    // Track last login for analytics (Phase 6)
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// email already indexed via unique:true
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// ── Pre-save Hook: Hash password ──────────────────────────────────────────────
// Only re-hash if password field was actually modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Instance Method: Compare password ────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance Method: Safe user object (strip sensitive fields) ────────────────
userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    isEmailVerified: this.isEmailVerified,
    isActive: this.isActive,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model("User", userSchema);

export default User;