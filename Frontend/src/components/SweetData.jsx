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
        className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth no-scrollbar select-none"
      >
        {food.map((item) => (
          <div
            key={item.variantId}
            className="w-[15rem] sm:w-[16rem] md:w-[18rem] bg-white rounded-lg p-3 flex-shrink-0"
          >
            <Link to={`/foods/sweet/${item.variantId}`} key={item.id}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 sm:h-36 md:h-40 object-cover rounded-2xl"
              />

              <h3 className="font-medium mt-2 text-sm sm:text-xl md:text-lg">
                {item.name.length > 30
                  ? item.name.slice(0, 30) + "..."
                  : item.name}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {item.weight} | {item.pieces} pcs | Serves {item.serves}
              </p>

              <p className="font-semibold mt-2 text-sm sm:text-base md:text-base">
                ₹{item.discountedPrice}
                <span className="text-gray-400 line-through ml-1">
                  ₹{item.basePrice}
                </span>
                <span className="text-green-600 ml-1">
                  ({item.discountPercentage}% OFF)
                </span>
              </p>
            </Link>
          </div>
        ))}

        {/* View All Card */}
        <div
          onClick={() => navigate("/foods/sweet")}
          className="min-w-[150px] sm:min-w-[170px] md:min-w-[190px] bg-[#faf7f2] 
                     flex items-center justify-center rounded-lg text-orange-500 
                     font-bold text-sm sm:text-base md:text-lg cursor-pointer flex-shrink-0"
        >
          View All →
        </div>
      </div>
    </section>
  );
};

export default SweetData;
