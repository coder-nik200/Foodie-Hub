import { useRef } from "react";
import fastFoodData from "../data/fastFoodData";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FoodOptions() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    scrollRef.current.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full h-screen px-8 py-10 relative flex flex-col">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Fast Food Options
      </h2>

      {/* Scrollable Section */}
      <div className="relative flex items-center">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 z-10 bg-white shadow-lg p-3 rounded-full"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Grid Scroll */}
        <div
          ref={scrollRef}
          className="
            overflow-x-auto scrollbar-hide scroll-smooth
            w-full px-14
          "
        >
          <div
            className="
              grid grid-rows-2 grid-flow-col
              gap-x-12 gap-y-14
              auto-cols-[180px]
            "
          >
            {fastFoodData.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
              >
                {/* Bigger Circle */}
                <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg">
                  <img
                    src={item.photoURL}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <p className="mt-4 text-base font-semibold text-center">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 z-10 bg-white shadow-lg p-3 rounded-full"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
