import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./useContext";
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
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md dark:shadow-gray-800 transition">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 text-[#ff5200]">
          <IoFastFoodOutline className="text-3xl" />
          <span className="font-bold text-2xl">Foodie Hub</span>
        </Link>

        {/* LOCATION */}
        <div className="hidden md:flex items-center gap-2 text-gray-700 dark:text-black-300 cursor-pointer">
          <IoLocationOutline className="text-xl text-[#ff5200]" />
          <span className="font-medium">Deliver to</span>
          <span className="font-semibold">Home</span>
        </div>

        {/* SEARCH */}
        <div className="flex-1 max-w-xl relative">
          <input
            type="text"
            placeholder="Search for food, restaurants..."
            className="w-full border border-gray-300 dark:border-gray-700 rounded-full py-3 pl-12 pr-4 bg-white dark:bg-white-800 text-gray-900 dark:text-black focus:outline-none focus:ring-2 focus:ring-[#ff5200]"
          />
          <IoSearch className="absolute left-4 top-3.5 text-xl " />
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
            <span className="absolute -top-1 -right-1 bg-[#ff5200] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              2
            </span>
          </Link>

          {/* AUTH BUTTONS */}
          {/* {!user ? ( */}
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
          {/* ) : (
            <Link
              to="/account"
              className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2"
            >
              <FaUserCircle className="text-xl" />
              <span className="font-medium">{user.name}</span>
            </Link>
          )} */}
        </div>
      </div>
    </header>
  );
}
