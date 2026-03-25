import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../api/axios";

const ViewAllHits = () => {
  const navigate = useNavigate();

  const [food, setFood] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 15; // products per page

  const handleClick = (id) => {
    navigate(`/foods/${id}`);
  };

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/foods?page=${page}&limit=${limit}`);

        setFood(res.data.products || []);
        setTotalPages(res.data.pages || 1);
        setError("");
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [page]);

  return (
    <section className="w-full py-4 px-4 lg:px-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-2xl font-bold cursor-pointer md:hidden"
        >
          <FaArrowLeftLong />
        </button>

        <div>
          <h2 className="text-[1.2rem] font-semibold">Our current hits</h2>
          <h3 className="text-sm text-gray-500 mt-1">
            Here’s what everyone’s eating!
          </h3>
        </div>

        <button className="text-2xl cursor-pointer md:hidden">
          <FaSearch />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 mt-6">Loading products...</p>
      )}

      {/* Product Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {food.length > 0 ? (
            food.map((item) => (
              <div
                key={item._id}
                onClick={() => handleClick(item._id)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg leading-snug">
                    {item.name?.length > 48
                      ? item.name.slice(0, 30) + "..."
                      : item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {item.description?.length > 48
                      ? item.description.slice(0, 48) + "..."
                      : item.description}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500">
                    {item.weight} • {item.pieces} pcs • Serves {item.serves}
                  </p>

                  {/* Price */}
                  <div className="flex items-center flex-wrap gap-2 pt-2">
                    <span className="font-bold text-base text-gray-900">
                      ₹{item.price?.discountedPrice || 0}
                    </span>

                    <span className="text-sm text-gray-400 line-through">
                      ₹{item.price?.originalPrice || 0}
                    </span>

                    <span className="text-sm text-green-600 font-semibold">
                      {item.price?.discountPercent || 0}% OFF
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full mt-6 text-gray-500">
              No products found
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">
          {/* Prev Button */}
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 
        ${
          page === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        }`}
          >
            ← Prev
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            const isActive = page === pageNumber;

            return (
              <button
                key={index}
                onClick={() => setPage(pageNumber)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300
            ${
              isActive
                ? "bg-orange-600 text-white shadow-lg scale-110"
                : "bg-white text-gray-700 shadow-md hover:bg-red-50 hover:text-red-600 hover:scale-105"
            }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 
        ${
          page === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        }`}
          >
            Next →
          </button>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </section>
  );
};

export default ViewAllHits;
