import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import api from "../api/axios";

const SweetData = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Arrow visibility state
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [food, setFood] = useState([]); // start with empty array
  const [error, setError] = useState("");

  // Scroll left/right
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Update arrow visibility based on scroll position
  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const buffer = 5; // 5px tolerance
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - buffer);
    }
  };

  useEffect(() => {
    api
      .get("/foods/sweet")
      .then((res) => setFood(res.data.products))
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong");
        }
      });

    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateArrows);
    updateArrows(); // initial check

    return () => container.removeEventListener("scroll", updateArrows);
  }, []);

  return (
    <section className="my-4 mx-3 py-4 relative max-w-6xl lg:mx-auto">
      {/* Title */}
      <h2 className="text-xl font-semibold">Best of Sweets</h2>
      <p className="text-gray-600 mb-4">
        Our most loved traditional & premium sweets!
      </p>

      {/* Left Arrow */}
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 hidden lg:block lg:-left-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
        >
          <FaArrowLeftLong />
        </button>
      )}

      {/* Right Arrow */}
      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 hidden lg:block lg:-right-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
        >
          <FaArrowRightLong />
        </button>
      )}

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth no-scrollbar select-none py-2"
      >
        {food.map((item) => (
          <div
            key={item._id}
            className="w-[15rem] sm:w-[16rem] md:w-[18rem] 
    bg-white rounded-2xl p-3 
    shadow-sm hover:shadow-lg 
    transition-all duration-300 
    flex-shrink-0 group"
          >
            <Link to={`/foods/${item._id}`}>
              <div className="overflow-hidden rounded-xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 sm:h-36 md:h-40 object-cover 
          group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="mt-3 space-y-1">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg leading-snug">
                  {item.name}
                </h3>

                <p className="text-xs sm:text-sm text-gray-500">
                  {item.weight} • {item.pieces} pcs • Serves {item.serves}
                </p>

                <div className="flex items-center flex-wrap gap-1 mt-2">
                  <span className="font-bold text-sm sm:text-base text-gray-900">
                    ₹{item.price?.discountedPrice}
                  </span>

                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    ₹{item.price?.originalPrice}
                  </span>

                  <span className="text-xs sm:text-sm text-green-600 font-semibold">
                    {item.price?.discountPercent}% OFF
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SweetData;
