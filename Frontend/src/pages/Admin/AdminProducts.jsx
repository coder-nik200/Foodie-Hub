import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (category !== "all") params.category = category;

      const res = await api.get("/foods/admin", { params });

      setProducts(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/foods/categories");
        setCategories(res.data.categories || []);
      } catch {
        toast.error("Failed to load categories");
      }
    };

    loadCategories();
  }, []);

  const updateStock = async (id, stock) => {
    if (stock < 0) return;

    try {
      setUpdatingId(id);

      await api.patch(`/foods/admin/${id}/stock`, { stock });

      toast.success("Stock updated");
      fetchProducts();
    } catch {
      toast.error("Stock update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/foods/admin/${id}/status`, {
        isActive: !currentStatus,
      });

      toast.success("Status updated");
      fetchProducts();
    } catch {
      toast.error("Status update failed");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      await api.delete(`/foods/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
              🍽️ Products Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage food items & inventory
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products..."
                className="pl-10 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MOBILE VIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {loading ? (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              No products found
            </p>
          ) : (
            products.map((p) => (
              <div
                key={p._id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-800"
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-32 rounded-xl object-cover mb-3"
                  />
                )}

                <p className="font-semibold text-gray-800 dark:text-white">
                  {p.name}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                  {p.description}
                </p>

                <p className="font-bold text-orange-600 mb-2">
                  ₹{p.price?.discountedPrice || p.price?.originalPrice}
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                    p.isAvailable
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {p.isAvailable ? "Active" : "Inactive"}
                </span>

                <input
                  type="number"
                  defaultValue={p.stock}
                  disabled={!p.isAvailable}
                  onBlur={(e) => updateStock(p._id, Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border dark:bg-gray-800 dark:text-white dark:border-gray-700 mb-3"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(p._id, p.isAvailable)}
                    className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    {p.isAvailable ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-4 flex gap-3 items-center">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}

                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {p.description}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 text-orange-600 font-bold text-center">
                    ₹{p.price?.discountedPrice || p.price?.originalPrice}
                  </td>

                  <td className="p-4 text-center">
                    <input
                      type="number"
                      defaultValue={p.stock}
                      onBlur={(e) => updateStock(p._id, Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded border dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.isAvailable
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {p.isAvailable ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => toggleStatus(p._id, p.isAvailable)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      {p.isAvailable ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          {[...Array(totalPages).keys()].map((x) => (
            <button
              key={x + 1}
              onClick={() => setPage(x + 1)}
              className={`w-10 h-10 rounded-xl font-medium ${
                page === x + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-900 dark:text-white border dark:border-gray-700"
              }`}
            >
              {x + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
