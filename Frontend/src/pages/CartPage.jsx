import { useUser } from "../context/useContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Minus } from "lucide-react";

export default function CartPage() {
  const { cart, addToCart, decrementQty, removeFromCart } = useUser();
  const navigate = useNavigate();

  const handleClick = (item) => {
    navigate(`/foods/${item.product._id}`);
  };

  // Total price
  const total = cart.reduce((sum, item) => {
    const price =
      item.food?.price?.discountedPrice ?? item.food?.discountedPrice ?? 0;

    return sum + price * (item.quantity || 1);
  }, 0);

  if (!cart || cart.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-3">Your Cart is Empty 🛒</h1>

        <p className="text-gray-500 mb-6">
          Looks like you haven’t added anything yet
        </p>

        <Link
          to="/"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen px-4 py-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-5">
        {cart.map((item, index) => {
          if (!item.food) return null; // skip items with no food

          return (
            <div
              key={item.food._id || index}
              onClick={() => handleClick(item)}
              className="flex items-center gap-5 bg-white rounded-2xl p-4 md:p-5 shadow-md hover:shadow-lg transition duration-300 cursor-pointer border border-gray-100"
            >
              <img
                src={item.food?.image}
                alt={item.food?.name || "Food"}
                className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl shadow-sm"
              />

              <div className="flex-1">
                <h2 className="font-semibold text-lg md:text-xl text-black-800">
                  {item.food?.name}
                </h2>

                <p className="mt-2 text-green-600 font-bold text-lg">
                  ₹
                  {(item.food?.price?.discountedPrice ?? 0) *
                    (item.quantity ?? 1)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-2 shadow-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      decrementQty(item.food._id);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-200 transition"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="font-medium text-black-800 min-w-[20px] text-center">
                    {item.quantity ?? 1}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item.food._id, 1);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-200 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(item.food._id);
                  }}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout */}
      <div className="mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-auto">
          <p className="text-sm text-gray-500 mb-1">Cart Total</p>

          <div className="text-3xl font-bold text-green-600">₹{total}</div>

          <p className="text-sm text-gray-400 mt-1">Inclusive of all taxes</p>
        </div>

        <button
          onClick={() => {
            toast.success("✅ Order placed successfully!");
            setTimeout(() => {
              navigate("/checkout");
            }, 1000);
          }}
          className="w-full md:w-auto px-10 py-3 rounded-xl bg-green-600 text-white font-semibold text-lg shadow-md hover:bg-green-700 hover:shadow-lg transition duration-300"
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
