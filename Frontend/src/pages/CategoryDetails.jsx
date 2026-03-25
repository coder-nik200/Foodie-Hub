import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { UserContext } from "../context/useContext";
import toast from "react-hot-toast";

const CategoryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, user } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/foods/categories/${id}`);

        const productsData = res.data.products;

        setProducts(productsData);

        // 🔥 get category from first product
        if (productsData.length > 0) {
          setCategory(productsData[0].category);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      }
    };

    fetchProducts();
  }, [id]);

  if (error) return <p className="text-center mt-10">{error}</p>;
  if (!products.length)
    return <p className="text-center mt-10">No products found</p>;

  return (
    <section className="w-full min-h-screen py-6 px-4 lg:px-60">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="text-xl text-gray-700 hover:text-orange-500 transition"
        >
          <FaArrowLeftLong />
        </button>

        <div className="flex items-center gap-3">
          {category?.image && (
            <img
              src={category.image}
              alt={category.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {category?.name || "Category"}
          </h2>
        </div>

        <button className="text-xl text-gray-700 hover:text-orange-500 transition">
          <FaSearch />
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((item, index) => (
          <div
            key={item._id || index}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Link to={`/foods/${item._id}`}>
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) =>
                    (e.target.src =
                      "https://images.unsplash.com/photo-1601050690597-df0568f70950")
                  }
                />
              </div>

              <div className="p-4 space-y-1">
                <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.uspDescription || ""}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.weight} | {item.pieces || "-"} | Serves {item.serves}
                </p>
                <p className="font-semibold text-base mt-2">
                  ₹{item.price?.discountedPrice ?? item.discountedPrice ?? 0}
                  {item.price?.originalPrice && (
                    <>
                      <span className="line-through text-gray-400 ml-2">
                        ₹{item.price.originalPrice}
                      </span>
                      <span className="text-green-600 ml-2 text-sm">
                        ({item.price.discountPercent ?? 0}% OFF)
                      </span>
                    </>
                  )}
                </p>
              </div>
            </Link>

            <button
              onClick={async () => {
                if (!user) {
                  toast.error("Please login to add items to cart");
                  navigate("/login");
                  return;
                }

                try {
                  await addToCart(item._id);
                  navigate("/cart");
                } catch (error) {
                  toast.error(error);
                }
              }}
              className="w-full py-3 bg-orange-500 text-white font-semibold hover:bg-orange-600 active:scale-95 transition-all"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryDetails;
