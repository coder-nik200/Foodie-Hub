import { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./useContext";
import api from "./api/axios";
import {
  IoFastFoodOutline,
  IoSearch,
  IoLocationOutline,
  IoCartOutline,
  IoMoon,
  IoSunny,
} from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const { user } = useContext(UserContext);
  const { cart } = useContext(UserContext);
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

  // Handle search input
  const handleSearchInput = async (value) => {
    setSearchQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch all products from ALL endpoints
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

      // Filter products that match search query
      const filtered = allProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.usp?.toLowerCase().includes(searchLower) ||
            product.uspDescription?.toLowerCase().includes(searchLower) ||
            product.category?.toLowerCase().includes(searchLower) ||
            product.slug?.toLowerCase().includes(searchLower)
        )
        .slice(0, 6); // Limit to 6 suggestions

      setSuggestions(filtered);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle suggestion click
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

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md dark:shadow-gray-800 transition">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 text-[#ff5200]">
          <IoFastFoodOutline className="text-3xl" />
          <span className="font-bold text-2xl">Foodie Hub</span>
        </Link>

        {/* LOCATION */}
        {/* <div className="hidden md:flex items-center gap-2 text-gray-700 dark:text-black-300 cursor-pointer">
          <IoLocationOutline className="text-xl text-[#ff5200]" />
          <span className="font-medium">Deliver to</span>
          <span className="font-semibold">Home</span>
        </div> */}

        {/* SEARCH */}
        <div className="flex-1 max-w-2xl relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search for food, restaurants..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-full py-3 pl-12 pr-4 bg-white dark:bg-white-800 text-gray-900 dark:text-black focus:outline-none focus:ring-2 focus:ring-[#ff5200]"
            />
            <button
              type="submit"
              className="absolute left-4 top-3.5 text-xl hover:cursor-pointer"
            >
              <IoSearch />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {loading && (
                <div className="px-4 py-3 text-center bg-white text-gray-600 dark:text-gray-400">
                  Searching...
                </div>
              )}

              {!loading && suggestions.length === 0 && searchQuery && (
                <div className="px-4 py-3 text-center bg-white text-gray-600 dark:text-gray-400">
                  No results found
                </div>
              )}

              {!loading &&
                suggestions.map((product, idx) => (
                  <div
                    key={`${product.type}-${product.variantId || product.id}-${idx}`}
                    onClick={() => handleSuggestionClick(product)}
                    className="border-b bg-white text-black border-black dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3 p-3">
                      {/* Product Image */}
                      <img
                        src={
                          product.photoURL || product.image || product.photoUrl
                        }
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 force-light">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {product.usp || product.uspDescription || ""}
                        </p>
                        <span className="text-xs bg-orange-100 dark:bg-orange-600 text-orange-600 dark:text-orange-200 px-2 py-0.5 rounded inline-block mt-1">
                          {product.category || product.type}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-green-600 dark:text-green-400">
                          ₹
                          {product.price?.discountedPrice ||
                            product.discountedPrice ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* THEME TOGGLE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-orange-400 transition"
          >
            {darkMode ? (
              <IoSunny className="text-xl text-yellow-400" />
            ) : (
              <IoMoon className="text-xl" />
            )}
          </button>

          {/* CART */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-orange-400"
          >
            <IoCartOutline className="text-2xl" />

            {cart?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ff5200] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* AUTH BUTTONS */}
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-[#ff5200] text-[#ff5200] font-medium hover:bg-[#ff5200] hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-full bg-[#ff5200] text-white font-medium transition"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative">
              {/* Avatar Button */}
              <button
                onClick={() => setShowMenu((s) => !s)}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white border border-gray-400 shadow-sm hover:shadow-md hover:border-gray-600 transition-all duration-200"
              >
                <FaUserCircle className="text-3xl text-black-700" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden z-50">
                  {/* User Info */}
                  <div className="px-4 py-3">
                    <p className="font-semibold text-black-800 truncate">
                      {user.firstName || user.email || "User"}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-400" />

                  {/* Logout */}
                  <button
                    onClick={async () => {
                      try {
                        await api.get("/auth/logout", {
                          withCredentials: true,
                        });
                      } catch {}
                      window.location.reload();
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-gray-100 transition"
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
