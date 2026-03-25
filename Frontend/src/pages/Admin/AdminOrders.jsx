import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const statusOptions = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Ready",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/admin/all");
      setOrders(res.data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      await api.patch(`/orders/admin/${id}/status`, { status });

      setOrders((prev) =>
        prev.map((order) => (order._id === id ? { ...order, status } : order)),
      );

      toast.success("Order updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const badge = (status) => {
    const map = {
      Pending: "bg-yellow-100 text-yellow-700",
      Confirmed: "bg-blue-100 text-blue-700",
      Preparing: "bg-purple-100 text-purple-700",
      Ready: "bg-cyan-100 text-cyan-700",
      "Out for Delivery": "bg-orange-100 text-orange-700",
      Delivered: "bg-emerald-100 text-emerald-700",
      Cancelled: "bg-red-100 text-red-700",
    };

    return map[status] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
            📦 Orders Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor and manage customer orders
          </p>
        </div>

        {/* MOBILE VIEW */}
        <div className="block lg:hidden space-y-4">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No orders found
            </p>
          ) : (
            orders.map((o) => (
              <div
                key={o._id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-800"
              >
                <div className="mb-3">
                  <p className="font-semibold text-gray-800 dark:text-white">
                    #{o._id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {o.user?.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {o.user?.email}
                  </p>
                </div>

                <div className="mb-3 font-bold text-orange-600 text-lg">
                  ₹{o.totalAmount}
                </div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${badge(
                    o.status,
                  )}`}
                >
                  {o.status}
                </span>

                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  disabled={updatingId === o._id}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o._id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="p-4 font-medium text-gray-800 dark:text-white">
                      #{o._id.slice(-6)}
                    </td>

                    <td className="p-4">
                      <div className="text-gray-800 dark:text-white">
                        {o.user?.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {o.user?.email}
                      </div>
                    </td>

                    <td className="p-4 text-center font-bold text-orange-600">
                      ₹{o.totalAmount}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${badge(
                          o.status,
                        )}`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        disabled={updatingId === o._id}
                        className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
