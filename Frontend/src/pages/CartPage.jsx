import { useContext } from "react";
import { UserContext } from "../useContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cart, removeFromCart } = useContext(UserContext);
  const navigate = useNavigate();

  const getItemLink = (item) => {
    const id = item.variantId || item.id;
    // Prefer explicit variantId prefix where category may be missing
    if (typeof id === "string") {
      if (id.startsWith("sw_") || id.startsWith("sw"))
        return `/foods/sweet/${id}`;
      if (id.startsWith("dr_") || id.startsWith("dr"))
        return `/foods/drinks/${id}`;
    }
    const cat = (item.category || "").toString().toLowerCase();
    if (cat.includes("sweet")) return `/foods/sweet/${id}`;
    if (cat.includes("drink")) return `/foods/drinks/${id}`;
    return `/foods/view-all-hits/${id}`;
  };

  const total = cart.reduce((sum, item) => {
    const price = item.price?.discountedPrice ?? item.discountedPrice ?? 0;
    return sum + price * (item.qty || 1);
  }, 0);

  if (!cart || cart.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Your Cart is Empty 🛒
        </h1>

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
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.variantId || item.id}
            onClick={() => navigate(getItemLink(item))}
            className="flex items-center gap-4 border rounded-lg p-4 cursor-pointer hover:shadow-md transition"
          >
            <img
              src={item.image || item.photoURL || item.photoUrl}
              alt={item.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600">
                {item.usp || item.uspDescription || ""}
              </p>
              <p className="mt-2 font-bold text-green-600">
                ₹
                {(item.price?.discountedPrice ?? item.discountedPrice ?? 0) *
                  (item.qty || 1)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm">Qty: {item.qty || 1}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCart(item.variantId || item.id);
                }}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <div className="text-xl">Total: ₹{total}</div>
        <button
          onClick={() => {
            toast.success(
              "✅ Order placed successfully! Thank you for shopping with us!"
            );
          }}
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
