const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  addAddress,
  getAllUsers,
  blockUser,
  deleteUser,
  updateUsers,
} = require("../controllers/userController");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Private routes
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/users/:id", protect, updateProfile);
router.put("/users/change-password/:id", protect, changePassword);
router.post("/users/add-address", protect, addAddress);

// Admin routes
router.patch("/admin/users/:id/block", protect, authorize("admin"), blockUser);
router.get("/admin/users", protect, authorize("admin"), getAllUsers);
router.put("/admin/users/:id", protect, authorize("admin"), updateUsers);
router.delete("/admin/users/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
