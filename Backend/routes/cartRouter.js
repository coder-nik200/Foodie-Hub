const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const {
  addToCart,
  removeFromCart,
  decrementQty,
  getCart,
  clearCart,
} = require("../controllers/cartController");

// Add item
router.post("/add", protect, addToCart);

// Get cart
router.get("/", protect, getCart);

// Decrement quantity
router.put("/decrement", protect, decrementQty);

// Remove item
router.delete("/remove/:productId", protect, removeFromCart);

// Clear cart
router.delete("/clear", protect, clearCart);

module.exports = router;
