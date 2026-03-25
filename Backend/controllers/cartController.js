const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../middlewares/asyncHandler");

// Helper to recalc totals
const calculateCartTotals = async (cart) => {
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  let total = 0;

  for (const item of cart.items) {
    const product = item.product.price
      ? item.product
      : await Product.findById(item.product);

    const price = product?.price?.discountedPrice || 0;
    total += item.quantity * price;
  }

  cart.totalPrice = total;
};

// ================= ADD TO CART =================
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({
      success: false,
      message: "Please provide product ID and quantity",
    });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  if (!product.isAvailable) {
    return res
      .status(400)
      .json({ success: false, message: "Product is not available" });
  }

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
  }

  const existingItem = cart.items.find((item) =>
    item.product.equals(productId),
  );
  if (existingItem) {
    existingItem.quantity += parseInt(quantity);
  } else {
    cart.items.push({ product: productId, quantity: parseInt(quantity) });
  }

  await calculateCartTotals(cart);
  await cart.save();
  await cart.populate("items.product");

  // Add `food` key for frontend
  const itemsWithFood = cart.items.map((item) => ({
    ...item.toObject(),
    food: item.product,
  }));

  res.status(200).json({
    success: true,
    message: "Item added to cart",
    cart: { ...cart.toObject(), items: itemsWithFood },
  });
});

// ================= GET CART =================
exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product",
  );

  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: { items: [], totalItems: 0, totalPrice: 0 },
    });
  }

  const itemsWithFood = cart.items.map((item) => ({
    ...item.toObject(),
    food: item.product,
  }));

  res.status(200).json({
    success: true,
    cart: { ...cart.toObject(), items: itemsWithFood },
  });
});

// ================= DECREMENT QTY =================
exports.decrementQty = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }

  const item = cart.items.find((i) => i.product.equals(productId));
  if (!item) {
    return res
      .status(404)
      .json({ success: false, message: "Item not in cart" });
  }

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart.items = cart.items.filter((i) => !i.product.equals(productId));
  }

  await calculateCartTotals(cart);
  await cart.save();
  await cart.populate("items.product");

  const itemsWithFood = cart.items.map((i) => ({
    ...i.toObject(),
    food: i.product,
  }));

  res.status(200).json({
    success: true,
    cart: { ...cart.toObject(), items: itemsWithFood },
  });
});

// ================= REMOVE ITEM =================
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }

  cart.items = cart.items.filter((i) => !i.product.equals(productId));
  await calculateCartTotals(cart);
  await cart.save();
  await cart.populate("items.product");

  const itemsWithFood = cart.items.map((i) => ({
    ...i.toObject(),
    food: i.product,
  }));

  res.status(200).json({
    success: true,
    message: "Item removed",
    cart: { ...cart.toObject(), items: itemsWithFood },
  });
});

// ================= CLEAR CART =================
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: { items: [], totalItems: 0, totalPrice: 0 },
    });
  }

  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;
  await cart.save();

  res.status(200).json({ success: true, message: "Cart cleared", cart });
});
