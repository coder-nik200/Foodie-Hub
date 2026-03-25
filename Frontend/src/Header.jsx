import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./context/useContext";
import api from "./api/axios";
import {
  IoFastFoodOutline,
  IoSearch,
  IoCartOutline,
  IoMoon,
  IoSunny,
} from "react-icons/io5";
import { LogOut, Menu, Package, User, X, LayoutDashboard } from "lucide-react";

export default function Header() {
  const { user, cart, isAuthenticated, logout } = useUser();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleSearchInput = async (value) => {
    setSearchQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(`/foods/search?q=${value}`);

      setSuggestions(res.data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (product) => {
    let link;

    if (product.type === "sweet") {
      link = `/foods/${product._id}`;
    } else if (product.type === "drinks") {
      link = `/foods/${product._id}`;
    } else if (product.type === "options") {
      link = `/foods/categories/${product.category}`;
    } else {
      link = `/foods/${product._id}`;
    }

    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(link);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 shadow-md transition-colors duration-300
        ${darkMode ? "bg-[#0b1220] dark:shadow-gray-800" : "bg-white shadow-gray-200"}
      `}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 flex items-center gap-3">
        {/* LOGO */}
        <Link
          to="/"
          className={`flex items-center gap-2 shrink-0
            ${darkMode ? "text-white" : "text-[#ff5200]"}
          `}
        >
          <IoFastFoodOutline className="text-2xl sm:text-3xl text-[#ff5200]" />
          <span className="font-bold text-lg sm:text-2xl hidden sm:block text-[#ff5200]">
            Foodie Hub
          </span>
        </Link>

        {/* SEARCH */}
        <div className="flex-1 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search food..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              className={`w-full border rounded-full py-2.5 pl-10 pr-4 text-sm sm:text-base
                focus:outline-none focus:ring-2 focus:ring-[#ff5200] transition-colors duration-300
                ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }
              `}
            />
            <button
              type="submit"
              className={`absolute left-3 top-2.5 text-lg ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <IoSearch />
            </button>
          </form>

          {showSuggestions && (
            <div
              className={`absolute top-full left-0 right-0 mt-2 border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto transition-colors duration-300
                ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}
              `}
            >
              {loading && (
                <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                  Searching...
                </div>
              )}

              {!loading && suggestions.length === 0 && searchQuery && (
                <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                  No results found
                </div>
              )}

              {!loading &&
                suggestions.map((product, idx) => (
                  <div
                    key={`${product.type}-${product.variantId || product.id}-${idx}`}
                    onClick={() => handleSuggestionClick(product)}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors duration-200
                      ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}
                    `}
                  >
                    <img
                      src={
                        product.photoURL || product.image || product.photoUrl
                      }
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {product.name}
                      </p>
                      <p
                        className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {product.usp || product.uspDescription || ""}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      ₹
                      {product.price?.discountedPrice ||
                        product.discountedPrice ||
                        "N/A"}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors duration-300 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} dark:hover:bg-orange-400`}
          >
            {darkMode ? (
              <IoSunny className="text-xl text-yellow-400" />
            ) : (
              <IoMoon className="text-xl text-gray-900" />
            )}
          </button>

          <Link
            to="/cart"
            className={`relative p-2 rounded-full ${darkMode ? "" : ""} dark:hover:bg-orange-400`}
          >
            <IoCartOutline
              className={`text-2xl ${darkMode ? "text-white" : "text-gray-900"}`}
            />
            {cart?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ff5200] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
        </div>

        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="hidden sm:block px-4 py-2 border rounded-full border-[#ff5200] text-[#ff5200] font-medium hover:bg-[#ff5200] hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hidden sm:block px-4 py-2 border rounded-full border-[#ff5200] text-[#ff5200] font-medium hover:bg-[#ff5200] hover:text-white transition"
            >
              Sign up
            </Link>
          </>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold"
            >
              <User size={18} />
              {user?.name}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white text-gray-600 rounded-2xl shadow-xl overflow-hidden z-50">
                <DropdownLink
                  to="/profile"
                  icon={<User size={16} />}
                  label="My Profile"
                />

                <DropdownLink
                  to="/orders"
                  icon={<Package size={16} />}
                  label="My Orders"
                />

                {user?.role === "admin" && (
                  <DropdownLink
                    to="/admin"
                    icon={<LayoutDashboard size={16} />}
                    label="Admin Dashboard"
                  />
                )}

                <div className="border-t border-gray-200" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* MOBILE TOGGLE */}

        {/* Show menu button ONLY when user is NOT logged in */}
        {!isAuthenticated && (
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      {mobileOpen && !isAuthenticated && (
        <div className="md:hidden bg-orange-600 px-4 py-6 space-y-3">
          <MobileLink to="/login" label="Login" setMobileOpen={setMobileOpen} />
          <MobileLink
            to="/signup"
            label="Register"
            setMobileOpen={setMobileOpen}
          />
        </div>
      )}
    </header>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

const DropdownLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:text-gray-400"
  >
    {icon}
    {label}
  </Link>
);

const MobileLink = ({ to, label, setMobileOpen }) => (
  <Link
    to={to}
    onClick={() => setMobileOpen(false)}
    className="block px-4 py-3 rounded-xl text-white hover:bg-orange-800"
  >
    {label}
  </Link>
);
