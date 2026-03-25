import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useUser } from "../context/useContext";
import toast from "react-hot-toast";
import { Package, Truck, Clock, Check, X } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [cancelingId, setCancelingId] = useState(null);
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [filter, isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filter ? `?status=${filter}` : "";
      const response = await api.get(`/orders${params}`);
      const allOrders = response.data.orders || [];
      const filteredOrders = filter
        ? allOrders.filter((order) => order.status === filter)
        : allOrders;
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setCancelingId(orderId);
      await api.put(`/orders/${orderId}/cancel`, {
        cancelledReason: "Cancelled by customer",
      });
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-700",
      Confirmed: "bg-blue-100 text-blue-700",
      Preparing: "bg-purple-100 text-purple-700",
      Ready: "bg-cyan-100 text-cyan-700",
      "Out for Delivery": "bg-orange-100 text-orange-700",
      Delivered: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={16} className="inline mr-1" />;
      case "Ready":
        return <Package size={16} className="inline mr-1" />;
      case "Out for Delivery":
        return <Truck size={16} className="inline mr-1" />;
      case "Delivered":
        return <Check size={16} className="inline mr-1" />;
      case "Cancelled":
        return <X size={16} className="inline mr-1" />;
      default:
        return null;
    }
  };

  const canCancelOrder = (status) => {
    const noncancellableStatuses = [
      "Delivered",
      "Cancelled",
      "Out for Delivery",
    ];
    return !noncancellableStatuses.includes(status);
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your food orders</p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["", "Pending", "Confirmed", "Ready", "Delivered", "Cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2 rounded-full font-medium transition shadow-sm ${
                  filter === status
                    ? "bg-orange-500 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status || "All Orders"}
              </button>
            ),
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center pt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <Package size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg mb-5">
              {filter
                ? `No ${filter.toLowerCase()} orders found`
                : "No orders found yet"}
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition"
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white  rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-40 px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center w-fit ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* Items */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Order Items
                    </h4>
                    <div className="space-y-2 bg-gray-100 p-4 rounded-lg">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">
                              {item.name}
                            </span>
                            <span className="text-gray-700 ">
                              ×{item.quantity}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-800">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-800 mb-2">
                        Payment Method
                      </p>
                      <p className="text-gray-800 text-sm font-semibold bg-gray-100 p-3 rounded-lg">
                        {order.paymentMethod || "Cash"}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-r from-green-500 to-amber-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-700">Subtotal</p>
                        <p className="font-semibold text-gray-800">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {order.paymentStatus && (
                      <p>
                        Payment Status{" "}
                        <span
                          className={`font-semibold ${
                            order.paymentStatus === "Completed"
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    {canCancelOrder(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancelingId === order._id}
                        className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-medium transition text-sm"
                      >
                        {cancelingId === order._id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/`)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition text-sm"
                    >
                      Order More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
