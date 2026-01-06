import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { UserContext } from "../useContext";

export default function FoodDetails() {
  const { id } = useParams(); // categoryId (burger, pizza)
  const { addToCart } = useContext(UserContext);
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/foods/category/${id}`)
      .then((res) => {
        setFoods(res.data.products); // ✅ ARRAY
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10">{error}</p>;

  return (
    <div className="min-h-screen px-4 py-6 md:p-10 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {foods.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 hover:shadow-lg transition"
          >
            <Link to={`/foods/view-all-hits/${item.id}`}>
              <img
                src={item.photoURL}
                alt={item.name}
                className="h-40 w-full object-cover rounded-lg"
              />
              <h3 className="mt-3 font-semibold">{item.name}</h3>
              <p className="text-green-600 font-bold mt-1">
                ₹
                {typeof item.price === "object"
                  ? item.price.discountedPrice
                  : item.price}
                {typeof item.price === "object" && (
                  <>
                    <span className="line-through text-gray-500 ml-2">
                      ₹{item.price.mrp}
                    </span>
                    <span className="ml-2 text-red-500 font-semibold">
                      ({item.price.discountPercent}% OFF)
                    </span>
                  </>
                )}
              </p>
              <p className="text-sm text-gray-500">
                ⭐{" "}
                {typeof item.rating === "object"
                  ? item.rating.value
                  : item.rating}
              </p>
            </Link>
            <button
              onClick={() => {
                addToCart(item);
                navigate("/cart");
              }}
              className="mt-3 w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
