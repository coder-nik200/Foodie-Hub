import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

// Helper function to display stars
const renderStars = (ratingValue) => {
  const fullStars = Math.floor(ratingValue);
  const halfStar = ratingValue - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {"★".repeat(fullStars)}
      {halfStar && "☆"}
      {"☆".repeat(emptyStars)}
    </>
  );
};

export default function ViewAllHitsPage() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [allFoods, setAllFoods] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Scroll to top whenever the food id changes
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Get selected food
    api
      .get(`/foods/view-all-hits/${id}`)
      .then((res) => setFood(res.data.product))
      .catch((err) =>
        setError(err.response?.data?.message || "Something went wrong")
      );

    // Get all foods for recommendations and full menu
    api
      .get("/foods/view-all-hits")
      .then((res) => setAllFoods(res.data.products))
      .catch(() => {});
  }, [id]);

  if (error) return <p className="text-center mt-10">{error}</p>;
  if (!food) return <p className="text-center mt-10">Loading...</p>;

  const recommendations = allFoods.filter(
    (item) =>
      item.category === food.category && item.variantId !== food.variantId
  );

  const otherFoods = allFoods.filter(
    (item) => item.variantId !== food.variantId
  );

  return (
    <div className="min-h-screen p-10 max-w-6xl mx-auto">
      {/* FOOD DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={food.photoURL}
          alt={food.name}
          className="w-full max-w-md rounded-xl shadow-lg mx-auto"
        />

        <div>
          <h1 className="text-4xl font-bold">{food.name}</h1>
          <p className="text-gray-600 mt-2">{food.usp}</p>

          <div className="mt-4 space-y-2">
            <p>
              <strong>Category:</strong> {food.category}
            </p>
            <p>
              <strong>Weight:</strong> {food.weight}
            </p>
            <p>
              <strong>Pieces:</strong> {food.pieces}
            </p>
            <p>
              <strong>Serves:</strong> {food.serves}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              <span className="text-yellow-500">
                {renderStars(food.rating.value)}
              </span>{" "}
              ({food.rating.value} / 5, {food.rating.reviews} reviews)
            </p>
          </div>

          {/* PRICE */}
          <div className="mt-6">
            <span className="text-3xl font-bold text-green-600">
              ₹{food.price.discountedPrice}
            </span>
            <span className="line-through text-gray-500 ml-3">
              ₹{food.price.mrp}
            </span>
            <span className="ml-3 text-red-500 font-semibold">
              ({food.price.discountPercent}% OFF)
            </span>
          </div>

          <button className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Add to Cart
          </button>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">
            Recommended {food.category}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <Link
                to={`/foods/view-all-hits/${item.variantId}`}
                key={item.variantId}
                className="border rounded-xl p-4 hover:shadow-lg transition"
              >
                <img
                  src={item.photoURL}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-lg"
                />
                <h3 className="mt-3 font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.usp}</p>
                <p className="mt-1 text-yellow-500">
                  {renderStars(item.rating.value)} ({item.rating.value})
                </p>
                <p className="mt-2 font-bold text-green-600">
                  ₹{item.price.discountedPrice}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FULL MENU */}
      {otherFoods.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">All Foods</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {otherFoods.map((item) => (
              <Link
                to={`/foods/view-all-hits/${item.variantId}`}
                key={item.variantId}
                className="border rounded-xl p-4 hover:shadow-lg transition"
              >
                <img
                  src={item.photoURL}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-lg"
                />
                <h3 className="mt-3 font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.usp}</p>
                <p className="mt-1 text-yellow-500">
                  {renderStars(item.rating.value)} ({item.rating.value})
                </p>
                <p className="mt-2 font-bold text-green-600">
                  ₹{item.price.discountedPrice}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
