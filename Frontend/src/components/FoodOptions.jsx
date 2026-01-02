import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function FoodOptions() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    scrollRef.current.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  const handleClick = (id) => {
    navigate(`/food/${id}`);
  };

  useEffect(() => {
    api
      .get("/foods/food-options")
      .then((res) => {
        setData(res.data.data || []);
        // setData(res.data || []);
      })
      .catch((err) => {
        console.error("Backend API error:", err);
      });
  }, []);

  return (
    <div className="w-full h-screen px-8 py-10 flex flex-col">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Fast Food Options
      </h2>

      <div className="relative flex items-center">
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 z-10 bg-white shadow-lg p-3 rounded-full"
        >
          <ChevronLeft size={28} />
        </button>

        <div ref={scrollRef} className="overflow-x-auto w-full px-14">
          <div className="grid grid-rows-2 grid-flow-col gap-x-12 gap-y-14 auto-cols-[180px]">
            {data.map((item) => (
              <div
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
              >
                <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg">
                  <img
                    src={item.photoURL}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="mt-4 font-semibold text-center">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

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
