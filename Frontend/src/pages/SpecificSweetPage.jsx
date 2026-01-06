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

export default function SpecificSweetPage() {
  const { id } = useParams();
  const [sweet, setSweet] = useState(null);
  const [allSweets, setAllSweets] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [error, setError] = useState("");
  const { addToCart } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!id) {
      setError("Invalid sweet ID");
      return;
    }

    // Get selected sweet
    api
      .get(`/foods/sweet/${id}`)
      .then((res) => setSweet(res.data.product))
      .catch((err) =>
        setError(err.response?.data?.message || "Something went wrong")
      );

    // Get all sweets for recommendations
    api
      .get("/foods/sweet")
      .then((res) => setAllSweets(res.data.products))
      .catch(() => {});

    // Get all foods for recommendations and full menu
    api
      .get("/foods/view-all-hits")
      .then((res) => setAllFoods(res.data.products))
      .catch(() => {});
  }, [id]);

  if (error) return <p className="text-center mt-10">{error}</p>;
  if (!sweet) return <p className="text-center mt-10">Loading...</p>;

  const currentId = sweet.variantId || sweet.id;

  const recommendations = allSweets.filter(
    (item) => (item.variantId || item.id) !== currentId
  );

  const otherFoods = allFoods.filter(
    (item) => (item.variantId || item.id) !== currentId
  );

  return (
    <div className="min-h-screen px-4 py-6 md:p-10 max-w-6xl mx-auto">
      {/* SWEET DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={sweet.image || sweet.photoURL || sweet.photoUrl}
          alt={sweet.name}
          className="w-full max-w-md rounded-xl shadow-lg mx-auto"
        />

        <div>
          <h1 className="text-4xl font-bold">{sweet.name}</h1>
          <p className="text-gray-600 mt-2">{sweet.uspDescription}</p>

          <div className="mt-4 space-y-2">
            {/* <p>
              <strong>Category:</strong> {sweet.category}
            </p> */}
            <p>
              <strong>Weight:</strong> {sweet.weight}
            </p>
            <p>
              <strong>Pieces:</strong> {sweet.pieces}
            </p>
            <p>
              <strong>Serves:</strong> {sweet.serves}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              {sweet.rating ? (
                <>
                  <span className="text-yellow-500">
                    {renderStars(sweet.rating.value)}
                  </span>{" "}
                  ({sweet.rating.value} / 5, {sweet.rating.reviews} reviews)
                </>
              ) : (
                <span className="text-gray-500">No ratings yet</span>
              )}
            </p>
          </div>

          {/* basePrice */}
          <div className="mt-6">
            {sweet.basePrice ? (
              <>
                <span className="text-3xl font-bold text-green-600">
                  ₹{sweet.discountedPrice ?? 0}
                </span>
                <span className="line-through text-gray-500 ml-3">
                  ₹{sweet.basePrice ?? 0}
                </span>
                <span className="ml-3 text-red-500 font-semibold">
                  ({sweet.discountPercentage ?? 0}% OFF)
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
              addToCart(sweet);
              toast.success(`✅ ${sweet.name} added to cart!`);
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
            Recommended {sweet.category}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <Link
                to={`/foods/sweet/${item.variantId || item.id}`}
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

      {/* FULL SWEETS MENU */}
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
