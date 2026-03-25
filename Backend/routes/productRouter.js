const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getAllCategory,
  getProductsByCategoryId,
  getDrinkFoods,
  getSweetFoods,
  getAdminProducts,
  updateProductStock,
  updateProductStatus,
  getDashboardStats,
  searchProducts,
  searchFoods,
} = require("../controllers/productController");

// Product routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);

// Category routes
router.get("/categories", getAllCategory);
router.get("/categories/:id", getProductsByCategoryId);

// Sweets and Drinks
router.get("/sweet", getSweetFoods);
router.get("/drinks", getDrinkFoods);

// router.get("/search/:query", searchProducts);
router.get("/search", searchFoods);

// Admin routes (must come before /:id)
router.get("/admin/stats", protect, authorize("admin"), getDashboardStats);
router.get("/admin", protect, authorize("admin"), getAdminProducts);
router.patch(
  "/admin/:id/stock",
  protect,
  authorize("admin"),
  updateProductStock,
);
router.patch(
  "/admin/:id/status",
  protect,
  authorize("admin"),
  updateProductStatus,
);

// Product by ID (keep this LAST)
router.get("/:id", getProductById);

// Standard CRUD
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;
