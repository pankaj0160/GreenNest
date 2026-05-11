/**
 * cartSlice.js
 * Redux slice for shopping cart state.
 *
 * In Phase 4, cart will be synced with the backend.
 * For now this slice manages local cart state and count (used in the navbar badge).
 *
 * State shape:
 * {
 *   items: [{ product, quantity, price }],
 *   totalItems: number,
 *   totalPrice: number,
 *   isLoading: boolean,
 * }
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
};

const calculateTotals = (items) => ({
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Hydrate cart from backend response
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.isLoading = false;
    },

    // Optimistic local add (Phase 4 will sync with backend)
    addToCart: (state, action) => {
      const { product, quantity = 1, price } = action.payload;
      const existing = state.items.find((i) => i.product._id === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity, price });
      }
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (i) => i.product._id !== action.payload
      );
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product._id === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },

    setCartLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartLoading,
} = cartSlice.actions;

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartIsLoading = (state) => state.cart.isLoading;

export default cartSlice.reducer;
