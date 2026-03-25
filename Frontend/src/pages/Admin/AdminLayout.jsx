import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "../../context/useContext";

const AdminLayout = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully ✅");
    navigate("/admin/login");
  };

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      end
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
            : "text-gray-300 hover:bg-slate-700 hover:text-white"
        }`
      }
    >
      <Icon size={20} />
      {label}
    </NavLink>
  );

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-800 overflow-hidden">
      {/* Header - z-40 ensures hamburger is always on top */}
      <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 shadow-sm fixed top-0 left-0 right-0 lg:left-64 z-40">
        {/* Hamburger menu on mobile */}
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden text-gray-700 dark:text-gray-300 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <Menu size={22} />
        </button>

        <span className="font-semibold text-gray-800 dark:text-gray-200 text-lg sm:text-xl">
          FoodieHub Admin Panel
        </span>
      </header>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo + X */}
        <div className="flex-shrink-0 h-16 flex items-center justify-between px-6 text-xl font-bold border-b border-slate-700 bg-slate-900">
          <span>FoodieHub Admin</span>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-300 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/admin/products" icon={Package} label="Products" />
          <NavItem to="/admin/orders" icon={ShoppingBag} label="Orders" />
          <NavItem to="/admin/users" icon={Users} label="Users" />
        </nav>

        {/* Logout */}
        <div className="flex-shrink-0 mt-auto">
          <button
            onClick={handleLogout}
            className="h-16 w-full flex items-center gap-3 px-6 text-red-400 hover:bg-slate-800 border-t border-slate-700 font-medium transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64 mt-16">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700 transition">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
