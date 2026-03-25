const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middlewares/auth");

const {
  placeOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");

// User
router.post("/place-order", protect, placeOrder);
router.get("/", protect, getUserOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);

// Admin
router.get("/admin/all", protect, authorize("admin"), getAllOrders);
router.patch(
  "/admin/:id/status",
  protect,
  authorize("admin"),
  updateOrderStatus,
);

module.exports = router;
