import mongoose from "mongoose";

/**
 * Wishlist.model.js
 * One wishlist per user. Products stored as an array of ObjectId refs.
 * Toggle logic (add/remove) handled in service layer.
 */

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one wishlist per user
      index: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;