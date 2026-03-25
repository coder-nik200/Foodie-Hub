import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/auth/admin/users?search=${search}&page=${page}`,
      );
      setUsers(data.users || []);
      setPages(data.pages || 1);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  /* ================= ACTIONS ================= */
  const updateRole = async (id, role) => {
    try {
      await api.put(`/auth/admin/users/${id}`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Error updating role");
    }
  };

  const toggleBlock = async (id) => {
    try {
      await api.patch(`/auth/admin/users/${id}/block`);
      toast.success("Status updated");
      fetchUsers();
    } catch {
      toast.error("Error updating status");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await api.delete(`/auth/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
              👥 User Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage customers & admins
            </p>
          </div>

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* ================= MOBILE VIEW ================= */}
        <div className="block lg:hidden space-y-4">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading users...
            </p>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No users found
            </p>
          ) : (
            users.map((u) => (
              <div
                key={u._id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-800"
              >
                <div className="mb-3">
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {u.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {u.email}
                  </p>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Role
                  </span>
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u._id, e.target.value)}
                    className="border rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                    u.isBlocked
                      ? "bg-red-100 text-red-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {u.isBlocked ? "Blocked" : "Active"}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBlock(u._id)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium text-white transition ${
                      u.isBlocked
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>

                  <button
                    onClick={() => deleteUser(u._id)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="p-4 font-medium text-gray-800 dark:text-white">
                      {u.name}
                    </td>

                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      {u.email}
                    </td>

                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u._id, e.target.value)}
                        className="border rounded-lg px-3 py-1 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      >
                        <option value="user">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.isBlocked
                            ? "bg-red-100 text-red-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="p-4 text-gray-500 dark:text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => toggleBlock(u._id)}
                        className={`px-4 py-2 rounded-lg text-xs font-medium text-white transition ${
                          u.isBlocked
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>

                      <button
                        onClick={() => deleteUser(u._id)}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          {[...Array(pages).keys()].map((x) => (
            <button
              key={x + 1}
              onClick={() => setPage(x + 1)}
              className={`w-10 h-10 rounded-xl font-medium transition ${
                page === x + 1
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white dark:bg-gray-900 dark:text-white border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
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

export default AdminUsers;
