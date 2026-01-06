import React from "react";
import { Link } from "react-router";

export default function FirstPage() {
  return (
    <div>
      <div className="w-full h-screen bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-between px-16">
        {/* Left Image */}
        <div className="hidden md:block w-1/4">
          <img
            src="/images/Veggies.png"
            alt="Food Left"
            className="hidden md:block absolute left-0 bottom-0 w-72 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Center Content */}
        <div className="text-center text-white max-w-xl">
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Order food.
            <br />
            Discover best restaurants.
            <br />
            <span className="text-yellow-300">Foddizee...</span>
          </h1>

          <p className="text-lg mb-8 opacity-90">
            Fast delivery from top restaurants near you.
          </p>

          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold transition">
            <Link to={"/cart"}>Order Now</Link>
          </button>
        </div>

        {/* Right Image */}
        <div className="hidden md:block w-1/4">
          <img
            src="/images/Sushi.png"
            alt="Food Right"
            className="hidden md:block absolute right-0 bottom-0 w-72 object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
