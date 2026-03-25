import { useState } from "react";
import { useUser } from "../context/useContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { placeOrderAPI } from "../api/axios";

export default function Checkout() {
  const { cart, clearCart } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (item.food?.price?.discountedPrice ?? 0) * (item.quantity || 1),
    0,
  );
  const deliveryFee = subtotal > 0 ? 30 : 0; // flat delivery fee
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: cart.map((item) => ({
          food: item.food._id,
          quantity: item.quantity,
          price: item.food.price?.discountedPrice ?? 0,
        })),
        totalAmount: total,
      };

      await placeOrderAPI(orderData);

      toast.success("✅ Order placed successfully!");
      clearCart();
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-3">No items to checkout 🛒</h1>
        <p className="text-gray-500 mb-6">Your cart is empty.</p>
        <Link
          to="/"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Cart Items */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        {cart.map((item) => (
          <div
            key={item.food._id}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.food.image}
                alt={item.food.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h2 className="font-semibold">{item.food.name}</h2>
                <p className="text-gray-500 text-sm">
                  Qty: {item.quantity} × ₹
                  {item.food.price?.discountedPrice ?? 0}
                </p>
              </div>
            </div>
            <p className="font-bold text-green-600">
              ₹{(item.food.price?.discountedPrice ?? 0) * (item.quantity || 1)}
            </p>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6 space-y-3">
        <h2 className="text-xl font-bold mb-2">Order Summary</h2>
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee:</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between font-bold text-green-600 text-lg">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="mt-6 w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
