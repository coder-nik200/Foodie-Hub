import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../api/axios";

const SweetDetails = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/foods/sweet")
      .then((res) => {
        setCategory(res.data); // full object
        setProducts(res.data.products); // array
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
      });
  }, []);

  if (error) return <p className="text-center mt-10">{error}</p>;
  if (!category) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section className="w-full py-4 px-4 lg:px-60">
      {/* Header */}
      {/* Title */}
      <h2 className="text-[1.2rem] font-semibold">Best of Sweets</h2>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-2xl font-bold md:hidden"
        >
          <FaArrowLeftLong />
        </button>

        <h2 className="text-[1.2rem] font-semibold">{category.name}</h2>

        <button className="text-2xl md:hidden">
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
            <Link to={`/foods/sweet/${item.variantId}`} key={item.id}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-60 object-cover rounded-t-2xl"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1601050690597-df0568f70950";
                }}
              />

              <div className="p-3">
                <h3 className="font-medium mt-2">{item.name}</h3>

                <p className="text-sm text-gray-600">{item.uspDescription}</p>

                <p className="text-sm text-gray-600 mt-1">
                  {item.weight} | {item.pieces || "-"} | Serves {item.serves}
                </p>

                <p className="font-semibold mt-2">
                  ₹{item.discountedPrice}
                  <span className="line-through text-gray-400 ml-1">
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

export default SweetDetails;
