import { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./useContext";
import api from "./api/axios";
import {
  IoFastFoodOutline,
  IoSearch,
  IoCartOutline,
  IoMoon,
  IoSunny,
} from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const { user, cart } = useContext(UserContext);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

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

    setLoading(true);
    try {
      const [hitsRes, sweetsRes, drinksRes, foodOptionsRes] = await Promise.all(
        [
          api
            .get("/foods/view-all-hits")
            .catch(() => ({ data: { products: [] } })),
          api.get("/foods/sweet").catch(() => ({ data: { products: [] } })),
          api.get("/foods/drinks").catch(() => ({ data: { products: [] } })),
          api.get("/foods/food-options").catch(() => ({ data: { data: [] } })),
        ]
      );

      const hits = hitsRes.data.products || [];
      const sweets = sweetsRes.data.products || [];
      const drinks = drinksRes.data.products || [];
      const foodOptions = foodOptionsRes.data.data || [];

      const searchLower = value.toLowerCase();
      const allProducts = [
        ...hits.map((p) => ({ ...p, type: "hits" })),
        ...sweets.map((p) => ({ ...p, type: "sweet" })),
        ...drinks.map((p) => ({ ...p, type: "drinks" })),
        ...foodOptions.map((p) => ({ ...p, type: "options" })),
      ];

      const filtered = allProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.usp?.toLowerCase().includes(searchLower) ||
            product.uspDescription?.toLowerCase().includes(searchLower) ||
            product.category?.toLowerCase().includes(searchLower) ||
            product.slug?.toLowerCase().includes(searchLower)
        )
        .slice(0, 6);

      setSuggestions(filtered);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (product) => {
    let link;
    if (product.type === "sweet") {
      link = `/foods/sweet/${product.variantId || product.id}`;
    } else if (product.type === "drinks") {
      link = `/foods/drinks/${product.variantId || product.id}`;
    } else if (product.type === "options") {
      link = `/foods/category/${product.id}`;
    } else {
      link = `/foods/view-all-hits/${product.variantId || product.id}`;
    }

    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(link);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
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

          {!user ? (
            <>
              {/* MOBILE */}
              <Link to="/login" className="sm:hidden">
                <FaUserCircle className="text-2xl" />
              </Link>

              {/* DESKTOP */}
              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 border rounded-full  border-[#ff5200] text-[#ff5200] font-medium hover:bg-[#ff5200] hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden sm:block px-4 py-2 border rounded-full  border-[#ff5200] text-[#ff5200] font-medium hover:bg-[#ff5200] hover:text-white transition"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white border border-gray-400 shadow-sm hover:shadow-md hover:border-gray-600 transition-all duration-200">
              <button onClick={() => setShowMenu(!showMenu)}>
                <FaUserCircle className="text-3xl text-black-700" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-38 w-48 bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden z-50">
                  <div className="px-4 py-3">
                    <p className="font-semibold text-black-800 truncate">
                      {user.firstName || user.email || "User"}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-400" />

                  <button
                    onClick={async () => {
                      await api.get("/auth/logout", { withCredentials: true });
                      window.location.reload();
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
