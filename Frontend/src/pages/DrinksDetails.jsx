import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import api from "../api/axios";
import { useEffect, useState } from "react";

const DrinksDetails = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/foods/drinks")
      .then((res) => {
        setCategory(res.data); // full object
        setProducts(res.data.products); // array
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
      });
  }, []);

  return (
    <section className="w-full py-4 px-4 lg:px-60">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Back Arrow */}
        <button
          onClick={() => navigate(-1)}
          className="text-2xl font-bold cursor-pointer md:hidden"
        >
          <FaArrowLeftLong />
        </button>

        {/* Title */}
        <h2 className="text-[1.2rem] font-semibold">Refreshing Drinks</h2>

        {/* Search Icon */}
        <button className="text-2xl cursor-pointer md:hidden">
          <FaSearch />
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {products.map((item) => (
          <div
            key={item.variantId}
            className="bg-white rounded-b-2xl shadow-lg"
          >
            <Link to={`/foods/drinks/${item.variantId}`} key={item.id}>
              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-60 object-cover rounded-t-2xl"
              />

              <div className="p-3">
                {/* Product Name */}
                <h3 className="font-medium mt-2 text-sm sm:text-base md:text-base">
                  {item.name.length > 48
                    ? item.name.slice(0, 30) + "..."
                    : item.name}
                </h3>

                {/* USP / Description */}
                <p className="text-xs sm:text-sm">
                  {item.uspDescription.length > 48
                    ? item.uspDescription.slice(0, 48) + "..."
                    : item.uspDescription}
                </p>

                {/* Weight | Pieces | Serves */}
                <p className="text-sm text-gray-600 mt-1">
                  {item.weight} | {item.pieces} pcs | Serves {item.serves}
                </p>

                {/* Price */}
                <p className="font-semibold mt-2">
                  ₹{item.discountedPrice}
                  <span className="text-gray-400 line-through ml-1">
                    ₹{item.basePrice}
                  </span>
                  <span className="text-green-600 ml-1">
                    ({item.discountPercentage}% OFF)
                  </span>
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DrinksDetails;
