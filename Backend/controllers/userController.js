const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler");

// Generate JWT token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
};

// @desc Register user
// @route POST /api/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email, and password",
    });
  }

  // Check if user exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  // Create user
  user = await User.create({
    name,
    email,
    password,
    role: "user",
  });

  sendTokenResponse(user, 201, res);
});

// @desc Login user
// @route POST /api/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Check if user is blocked
  if (user.isBlocked) {
    return res.status(403).json({
      success: false,
      message: "Your account has been blocked",
    });
  }

  sendTokenResponse(user, 200, res);
});

// @desc Logout user
// @route POST /api/auth/logout
// @access Private
exports.logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

// @desc Get current logged in user
// @route GET /api/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc Update user profile
// @route PUT /api/users/:id
// @access Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { name, phone, profilePic } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone, profilePic },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

// @desc Update password
// @route PUT /api/users/change-password/:id
// @access Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide old password and new password",
    });
  }

  const user = await User.findById(req.user.id).select("+password");

  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Old password is incorrect",
    });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// @desc Add address
// @route POST /api/users/add-address
// @access Private
exports.addAddress = asyncHandler(async (req, res, next) => {
  const { street, city, state, zipCode, isDefault } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: {
        addresses: { street, city, state, zipCode, isDefault },
      },
    },
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: "Address added successfully",
    user,
  });
});

// @desc Get all users (Admin)
// @route GET /api/admin/users
// @access Private (Admin only)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({
    role: { $in: ["user", "customer", "admin"] },
  }).select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc Update user (Admin)
// @route PUT /api/admin/users/:id
// @access Private (Admin only)
exports.updateUsers = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role }, // update data
    { new: true }, // return updated document
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});

// @desc Block/Unblock user (Admin)
// @route PATCH /api/admin/users/:id/block
// @access Private (Admin only)
exports.blockUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  user.isBlocked = !user.isBlocked;

  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    user,
  });
});

// @desc Delete user (Admin)
// @route DELETE /api/admin/users/:id
// @access Private (Admin only)
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
