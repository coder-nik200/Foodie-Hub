const Order = require("../models/Order");
const Cart = require("../models/Cart");

// // @desc Place order from cart
// // @route POST /api/orders/place-order
// // @access Private
exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price.discountedPrice,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount: cart.totalPrice,
    });

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    cart.totalItems = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Order failed",
    });
  }
};

// // @desc Get user orders
// // @route GET /api/orders
// // @access Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

// // @desc Get order by id
// // @route GET /api/orders/:id
// // @access Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};

// // @desc Cancel order
// // @route PUT /api/orders/:id/cancel
// // @access Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true },
    );

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cancel failed",
    });
  }
};

// // @desc Get all orders (Admin)
// // @route GET /api/orders/admin/all
// // @access Private Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all orders",
    });
  }
};

// // @desc Update order status (Admin)
// // @route PUT /api/orders/admin/:id/status
// // @access Private Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Status update failed",
    });
  }
};
