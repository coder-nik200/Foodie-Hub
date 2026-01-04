import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../api/axios"; // ✅ make sure you import your axios instance

const ViewAllHits = () => {
  const navigate = useNavigate();
  const [food, setFood] = useState([]); // start with empty array
  const [error, setError] = useState("");

  const handleClick = (variantId) => {
    navigate(`/foods/view-all-hits/${variantId}`);
  };

  useEffect(() => {
    api
      .get("/foods/view-all-hits")
      .then((res) => setFood(res.data.products || [])) // ✅ use API response
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong");
        }
      });
  }, []); // ✅ dependency array to avoid infinite loop

  return (
    <section className="w-full py-4 px-4 lg:px-20">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Back Arrow */}
        <button
          onClick={() => navigate(-1)}
          className="text-2xl font-bold cursor-pointer md:hidden"
        >
          <FaArrowLeftLong />
        </button>

        <div>
          {/* Title */}
          <h2 className="text-[1.2rem] font-semibold">Our current hits</h2>
          <h3 className="text-sm text-gray-500 mt-1">
            Here’s what everyone’s eating!
          </h3>
        </div>

        {/* Search Icon */}
        <button className="text-2xl cursor-pointer md:hidden">
          <FaSearch />
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {food?.length > 0 ? (
          food.map((item) => (
            <div
              key={item.variantId}
              onClick={() => handleClick(item.variantId)}
              className="bg-white rounded-b-2xl shadow-lg cursor-pointer"
            >
              <img
                src={item.photoURL}
                alt={item.name}
                className="w-full h-60 object-cover rounded-t-2xl"
              />
              <div className="p-3">
                <h3 className="font-medium mt-2 text-sm sm:text-base md:text-base">
                  {item.name?.length > 48
                    ? item.name.slice(0, 30) + "..."
                    : item.name}
                </h3>
                <p className="text-xs sm:text-sm">
                  {item.usp?.length > 48
                    ? item.usp.slice(0, 48) + "..."
                    : item.usp}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {item.weight} | {item.pieces} pcs | Serves {item.serves}
                </p>
                <p className="font-semibold mt-2">
                  ₹{item.price?.discountedPrice || 0}
                  <span className="text-gray-400 line-through ml-1">
                    ₹{item.price?.mrp || 0}
                  </span>
                  <span className="text-green-600 ml-1">
                    ({item.price?.discountPercent || 0}% OFF)
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full mt-4">No products found</p>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </section>
  );
};

export default ViewAllHits;
