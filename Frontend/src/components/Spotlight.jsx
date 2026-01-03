import React, { useEffect, useState, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const images = [
  "https://b.zmtcdn.com/data/pictures/4/21804514/641e35fe9a6d5e9ed7c9f7a5a1b79493_o2_featured_v2.jpg",
  "https://images.squarespace-cdn.com/content/v1/5327567de4b0bcdfa66c1a8c/1624474563962-ZFK0Z8OVTIHZJR5KP4G9/SkandiaShafer_PrettyHealthy2E2A2938.jpg?format=1500w",
  "https://b.zmtcdn.com/data/pictures/0/19254410/95394a227c2e7c4785b2f513c57a895e_o2_featured_v2.jpg",
  "https://b.zmtcdn.com/data/pictures/5/20801405/bcc534afcc5930d034e18433345b5cc0_o2_featured_v2.jpg",
  "https://b.zmtcdn.com/data/pictures/2/18972832/d9e9d1862af64886b627b8d54c77065d_o2_featured_v2.jpg",
];

const SpotLight = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  // 👉 Auto slide
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 px-4">
      <h1 className="text-2xl md:text-3xl font-semibold">In the Spotlight</h1>
      <p className="text-gray-600 mt-1">Discover our most loved dishes</p>

      {/* SLIDER */}
      <div
        className="relative mt-6 overflow-hidden"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        {/* LEFT */}
        <button
          onClick={prevImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 
          bg-white p-2 rounded-full shadow-md"
        >
          <IoIosArrowBack size={24} />
        </button>

        {/* RIGHT */}
        <button
          onClick={nextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 
          bg-white p-2 rounded-full shadow-md"
        >
          <IoIosArrowForward size={24} />
        </button>

        {/* IMAGES */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="min-w-full">
              <img
                src={img}
                alt="food spotlight"
                className="w-full h-72 sm:h-80 md:h-[450px] 
                object-cover rounded-3xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition
              ${currentIndex === i ? "bg-orange-500 scale-125" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SpotLight;
