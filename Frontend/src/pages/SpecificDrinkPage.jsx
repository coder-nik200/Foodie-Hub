import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { UserContext } from "../useContext";
import toast from "react-hot-toast";

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

export default function SpecificDrinkPage() {
  const { id } = useParams();
  const [drinks, setDrinks] = useState(null);
  const [allDrinks, setAllDrinks] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [error, setError] = useState("");
  const { addToCart } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!id) {
      setError("Invalid drinks ID");
      return;
    }

    // Get selected drinks
    api
      .get(`/foods/drinks/${id}`)
      .then((res) => setDrinks(res.data.product))
      .catch((err) =>
        setError(err.response?.data?.message || "Something went wrong")
      );

    // Get all drinks for recommendations
    api
      .get("/foods/drinks")
      .then((res) => setAllDrinks(res.data.products))
      .catch(() => {});

    // Get all foods for recommendations and full menu
    api
      .get("/foods/view-all-hits")
      .then((res) => setAllFoods(res.data.products))
      .catch(() => {});
  }, [id]);

  if (error) return <p className="text-center mt-10">{error}</p>;
  if (!drinks) return <p className="text-center mt-10">Loading...</p>;

  const currentId = drinks.variantId || drinks.id;

  const recommendations = allDrinks.filter(
    (item) => (item.variantId || item.id) !== currentId
  );

  const otherFoods = allFoods.filter(
    (item) => (item.variantId || item.id) !== currentId
  );

  return (
    <div className="min-h-screen p-10 max-w-6xl mx-auto">
      {/* drinks DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={drinks.image || drinks.photoURL || drinks.photoUrl}
          alt={drinks.name}
          className="w-full max-w-md rounded-xl shadow-lg mx-auto"
        />

        <div>
          <h1 className="text-4xl font-bold">{drinks.name}</h1>
          <p className="text-gray-600 mt-2">{drinks.uspDescription}</p>

          <div className="mt-4 space-y-2">
            {/* <p>
              <strong>Category:</strong> {drinks.category}
            </p> */}
            <p>
              <strong>Weight:</strong> {drinks.weight}
            </p>
            <p>
              <strong>Pieces:</strong> {drinks.pieces}
            </p>
            <p>
              <strong>Serves:</strong> {drinks.serves}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              {drinks.rating ? (
                <>
                  <span className="text-yellow-500">
                    {renderStars(drinks.rating.value)}
                  </span>{" "}
                  ({drinks.rating.value} / 5, {drinks.rating.reviews} reviews)
                </>
              ) : (
                <span className="text-gray-500">No ratings yet</span>
              )}
            </p>
          </div>

          {/* basePrice */}
          <div className="mt-6">
            {drinks.basePrice ? (
              <>
                <span className="text-3xl font-bold text-green-600">
                  ₹{drinks.discountedPrice ?? 0}
                </span>
                <span className="line-through text-gray-500 ml-3">
                  ₹{drinks.basePrice ?? 0}
                </span>
                <span className="ml-3 text-red-500 font-semibold">
                  ({drinks.discountPercentage ?? 0}% OFF)
                </span>
              </>
            ) : (
              <span className="text-gray-500 font-semibold">
                basePrice not available
              </span>
            )}
          </div>

          <button
            onClick={() => {
              addToCart(drinks);
              toast.success(`✅ ${drinks.name} added to cart!`);
              navigate("/cart");
            }}
            className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">
            Recommended {drinks.category}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <Link
                to={`/foods/drinks/${item.variantId || item.id}`}
                key={item.variantId || item.id}
                className="border rounded-xl p-4 hover:shadow-lg transition"
              >
                <img
                  src={item.image || item.photoURL || item.photoUrl}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-lg"
                />
                <h3 className="mt-3 font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.uspDescription}</p>
                <p className="mt-1 text-yellow-500">
                  {item.rating ? (
                    <>
                      {renderStars(item.rating.value)} ({item.rating.value})
                    </>
                  ) : (
                    "No rating"
                  )}
                </p>

                <p className="mt-2 font-bold text-green-600">
                  {item.basePrice ? (
                    <>
                      ₹{item.basePrice ?? 0}
                      <span className="line-through text-gray-500 ml-2">
                        ₹{item.discountedPrice ?? 0}
                      </span>
                      <span className="ml-2 text-red-500 font-semibold">
                        ({item.discountPercentage ?? 0}% OFF)
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500 font-semibold">
                      basePrice not available
                    </span>
                  )}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FULL drinksS MENU */}
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
                <p className="text-sm text-gray-600">{item.usp || ""}</p>
                <p className="mt-1 text-yellow-500">
                  {renderStars(item.rating?.value || 0)} (
                  {item.rating?.value || 0})
                </p>
                <p className="mt-2 font-bold text-green-600">
                  {item.price ? (
                    <>
                      ₹{item.price.mrp ?? 0}
                      <span className="line-through text-gray-500 ml-2">
                        ₹{item.price.discountedPrice ?? 0}
                      </span>
                      <span className="ml-2 text-red-500 font-semibold">
                        ({item.price.discountPercent ?? 0}% OFF)
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500 font-semibold">
                      basePrice not available
                    </span>
                  )}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
