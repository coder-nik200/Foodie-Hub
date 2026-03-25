const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");
const asyncHandler = require("../middlewares/asyncHandler");

// @desc Get all products with filters
// @route GET /api/products
// @access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const { category, search, sort, page = 1, limit = 10 } = req.query;

  let query = { isAvailable: true };

  // Filter by category
  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    query.category = category;
  }

  // Search by name or description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  let sortQuery = {};
  if (sort) {
    if (sort === "price-low") sortQuery.price = 1;
    if (sort === "price-high") sortQuery.price = -1;
    if (sort === "rating") sortQuery.rating = -1;
    if (sort === "newest") sortQuery.createdAt = -1;
  } else {
    sortQuery.createdAt = -1;
  }

  const products = await Product.find(query)
    .sort(sortQuery)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    products,
  });
});

// @desc Get single product
// @route GET /api/products/:id
// @access Public
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// @desc Create product (Admin)
// @route POST /api/admin/products
// @access Private (Admin only)
exports.createProduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    price,
    originalPrice,
    category,
    image,
    stock,
    preparationTime,
    ingredients,
    isSpicy,
    isVegetarian,
  } = req.body;

  if (!name || !description || !price || !category || !image) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  const product = await Product.create({
    name,
    description,
    price,
    originalPrice: originalPrice || price,
    category,
    image,
    stock,
    preparationTime,
    ingredients,
    isSpicy,
    isVegetarian,
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

// @desc Update product (Admin)
// @route PUT /api/admin/products/:id
// @access Private (Admin only)
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

// @desc Delete product (Admin)
// @route DELETE /api/admin/products/:id
// @access Private (Admin only)
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// @desc Get featured products
// @route GET /api/products/featured
// @access Public
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({
    isAvailable: true,
    rating: { $gte: 4 },
  })
    .sort({ rating: -1 })
    .limit(51);

  res.status(200).json({
    success: true,
    products,
  });
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getAllCategory = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

// @desc Get products by categories
// @route GET /api/foods/categories/:id
// @access Public
exports.getProductsByCategoryId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  const products = await Product.find({ category: id }).populate(
    "category",
    "name image",
  );

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// @desc Get products by sweet
// @route GET /api/foods/sweet
// @access Public
exports.getSweetFoods = asyncHandler(async (req, res) => {
  const sweetCategory = await Category.findOne({
    name: { $regex: "^sweets$", $options: "i" },
  });

  if (!sweetCategory) {
    return res.status(404).json({
      success: false,
      message: "Sweet category not found",
    });
  }

  const sweets = await Product.find({
    category: sweetCategory._id,
    isAvailable: true,
  }).populate("category", "name image");

  res.status(200).json({
    success: true,
    count: sweets.length,
    products: sweets,
  });
});

// @desc Get products by drinks
// @route GET /api/foods/drinks
// @access Public
exports.getDrinkFoods = asyncHandler(async (req, res) => {
  const drinkCategory = await Category.findOne({
    name: { $regex: "^Beverages$", $options: "i" },
  });

  if (!drinkCategory) {
    return res.status(404).json({
      success: false,
      message: "Drink category not found",
    });
  }

  const drinks = await Product.find({
    category: drinkCategory._id,
    isAvailable: true,
  }).populate("category", "name image");

  res.status(200).json({
    success: true,
    count: drinks.length,
    products: drinks,
  });
});

// @desc Get all products for admin (with filters and all statuses)
// @route GET /api/foods/admin
// @access Private (Admin only)
exports.getAdminProducts = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 20 } = req.query;

  let query = {};

  // Search by name or description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by category
  if (category && category !== "all") {
    if (mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    }
  }

  const skip = (page - 1) * limit;

  const data = await Product.find(query)
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    count: data.length,
    total,
    pages: Math.ceil(total / limit),
    data,
  });
});

// @desc Update product stock
// @route PATCH /api/foods/admin/:id/stock
// @access Private (Admin only)
exports.updateProductStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;

  if (stock === undefined || stock < 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid stock quantity",
    });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stock },
    { new: true },
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Stock updated successfully",
    product,
  });
});

// @desc Update product status (isAvailable)
// @route PATCH /api/foods/admin/:id/status
// @access Private (Admin only)
exports.updateProductStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Please provide valid status",
    });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isAvailable: isActive },
    { new: true },
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Status updated successfully",
    product,
  });
});

// @desc get stats (isAvailable)
// @route GET /api/foods/admin/stats
// @access Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Total products
    const totalProducts = await Product.countDocuments();

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Pending orders
    const pendingOrders = await Order.countDocuments({ status: "Pending" });

    // Delivered orders
    const deliveredOrders = await Order.countDocuments({
      status: "Delivered",
    });

    // Revenue from delivered orders
    const deliveredOrdersData = await Order.find({
      status: "Delivered",
    });

    // Revenue calculation
    const revenueData = await Order.aggregate([
      {
        $match: { status: "Delivered" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Monthly revenue
    const monthlyRevenue = {};

    deliveredOrdersData.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
      });

      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.totalAmount;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const query = req.params.query;

    const products = await Product.find({
      $or: [
        { name: new RegExp(query, "i") },
        { category: new RegExp(query, "i") },
        { usp: new RegExp(query, "i") },
        {
          description: new RegExp(query, "i"),
        },
      ],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
};

exports.searchFoods = async (req, res) => {
  try {
    const q = req.query.q;

    const foods = await Product.find({
      name: { $regex: q, $options: "i" },
    }).limit(10);

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
