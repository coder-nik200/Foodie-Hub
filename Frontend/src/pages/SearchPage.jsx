// import { useEffect, useState, useContext } from "react";
// import { useSearchParams, Link, useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { UserContext } from "../useContext";
// import { IoArrowBack } from "react-icons/io5";
// import toast from "react-hot-toast";

// // Helper function to display stars
// const renderStars = (ratingValue) => {
//   if (!ratingValue) return "☆☆☆☆☆";
//   const fullStars = Math.floor(ratingValue);
//   const halfStar = ratingValue - fullStars >= 0.5;
//   const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

//   return (
//     <>
//       {"★".repeat(fullStars)}
//       {halfStar && "☆"}
//       {"☆".repeat(emptyStars)}
//     </>
//   );
// };

// export default function SearchPage() {
//   const [searchParams] = useSearchParams();
//   const query = searchParams.get("q") || "";
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const { addToCart } = useContext(UserContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }

//     setLoading(true);
//     setError("");

//     // Search across ALL food categories
//     Promise.all([
//       api.get("/foods/view-all-hits").catch(() => ({ data: { products: [] } })),
//       api.get("/foods/sweet").catch(() => ({ data: { products: [] } })),
//       api.get("/foods/drinks").catch(() => ({ data: { products: [] } })),
//       api.get("/foods/food-options").catch(() => ({ data: { data: [] } })),
//     ])
//       .then(([hitsRes, sweetsRes, drinksRes, foodOptionsRes]) => {
//         const hits = hitsRes.data.products || [];
//         const sweets = sweetsRes.data.products || [];
//         const drinks = drinksRes.data.products || [];
//         const foodOptions = foodOptionsRes.data.data || [];

//         const searchQuery = query.toLowerCase();
//         const allProducts = [
//           ...hits.map((p) => ({ ...p, type: "hits" })),
//           ...sweets.map((p) => ({ ...p, type: "sweet" })),
//           ...drinks.map((p) => ({ ...p, type: "drinks" })),
//           ...foodOptions.map((p) => ({ ...p, type: "options" })),
//         ];

//         // Filter products that match search query
//         const filtered = allProducts.filter(
//           (product) =>
//             product.name.toLowerCase().includes(searchQuery) ||
//             product.usp?.toLowerCase().includes(searchQuery) ||
//             product.uspDescription?.toLowerCase().includes(searchQuery) ||
//             product.category?.toLowerCase().includes(searchQuery) ||
//             product.slug?.toLowerCase().includes(searchQuery)
//         );

//         setResults(filtered);
//       })
//       .catch((err) => {
//         setError(err.response?.data?.message || "Failed to search");
//         setResults([]);
//       })
//       .finally(() => setLoading(false));
//   }, [query]);

//   const getProductLink = (product) => {
//     if (product.type === "sweet") {
//       return `/foods/sweet/${product.variantId || product.id}`;
//     } else if (product.type === "drinks") {
//       return `/foods/drinks/${product.variantId || product.id}`;
//     } else if (product.type === "options") {
//       return `/foods/${product.id}`;
//     } else {
//       return `/foods/view-all-hits/${product.variantId || product.id}`;
//     }
//   };

//   const getPrice = (product) => {
//     if (product.price) {
//       return product.price.discountedPrice;
//     } else if (product.discountedPrice) {
//       return product.discountedPrice;
//     }
//     return "N/A";
//   };

//   const getImage = (product) => {
//     return product.photoURL || product.image || product.photoUrl;
//   };

//   const getRating = (product) => {
//     if (product.rating) {
//       if (typeof product.rating === "object") {
//         return product.rating.value;
//       }
//       return product.rating;
//     }
//     return 0;
//   };

//   return (
//     <div className="min-h-screen w-full bg-white dark:bg-[#0b1220] px-4 py-6 md:p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition text-gray-900 dark:text-white"
//           >
//             <IoArrowBack className="text-2xl" />
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Search Results for "{query}"
//           </h1>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="text-center py-12">
//             <p className="text-gray-600 dark:text-gray-400 text-lg">
//               Searching...
//             </p>
//           </div>
//         )}

//         {/* Error State */}
//         {error && !loading && (
//           <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
//             {error}
//           </div>
//         )}

//         {/* Results */}
//         {!loading && results.length > 0 ? (
//           <div>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               Found {results.length} result{results.length !== 1 ? "s" : ""}
//             </p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {results.map((product, idx) => (
//                 <div
//                   key={`${product.type}-${product.variantId || product.id}-${idx}`}
//                   className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105"
//                 >
//                   {/* Product Link Card */}
//                   <Link to={getProductLink(product)} className="block">
//                     <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 h-48">
//                       <img
//                         src={getImage(product)}
//                         alt={product.name}
//                         className="w-full h-full object-cover hover:scale-110 transition"
//                       />
//                     </div>
//                   </Link>

//                   <div className="p-4">
//                     {/* Category Badge */}
//                     {product.category && (
//                       <span className="inline-block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs font-semibold px-2 py-1 rounded mb-2">
//                         {product.category}
//                       </span>
//                     )}

//                     {/* Product Name */}
//                     <h3 className="font-bold text-lg mb-1 dark:text-white line-clamp-2">
//                       {product.name}
//                     </h3>

//                     {/* Description */}
//                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
//                       {product.usp || product.uspDescription || ""}
//                     </p>

//                     {/* Rating */}
//                     <div className="flex items-center gap-2 mb-3">
//                       <span className="text-yellow-500">
//                         {renderStars(getRating(product))}
//                       </span>
//                       <span className="text-sm text-gray-600 dark:text-gray-400">
//                         {getRating(product).toFixed(1)}
//                       </span>
//                     </div>

//                     {/* Price */}
//                     <div className="mb-4">
//                       <p className="text-2xl font-bold text-green-600 dark:text-green-400">
//                         ₹{getPrice(product)}
//                       </p>
//                     </div>

//                     {/* Add to Cart Button */}
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         addToCart(product);
//                         toast.success(`✅ ${product.name} added to cart!`);
//                         navigate("/cart");
//                       }}
//                       className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
//                     >
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : !loading && query.trim() ? (
//           <div className="text-center py-12">
//             <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
//               No results found for "{query}"
//             </p>
//             <p className="text-gray-600 dark:text-gray-400">
//               Try searching with different keywords
//             </p>
//           </div>
//         ) : !loading && !query.trim() ? (
//           <div className="text-center py-12">
//             <p className="text-gray-700 dark:text-gray-300 text-lg">
//               Enter a search term to find food items
//             </p>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useContext } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { UserContext } from "../useContext";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";

// Helper function to display stars
const renderStars = (ratingValue) => {
  if (!ratingValue) return "☆☆☆☆☆";
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

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToCart } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");

    Promise.all([
      api.get("/foods/view-all-hits").catch(() => ({ data: { products: [] } })),
      api.get("/foods/sweet").catch(() => ({ data: { products: [] } })),
      api.get("/foods/drinks").catch(() => ({ data: { products: [] } })),
      api.get("/foods/food-options").catch(() => ({ data: { data: [] } })),
    ])
      .then(([hitsRes, sweetsRes, drinksRes, foodOptionsRes]) => {
        const hits = hitsRes.data.products || [];
        const sweets = sweetsRes.data.products || [];
        const drinks = drinksRes.data.products || [];
        const foodOptions = foodOptionsRes.data.data || [];

        const searchQuery = query.toLowerCase();
        const allProducts = [
          ...hits.map((p) => ({ ...p, type: "hits" })),
          ...sweets.map((p) => ({ ...p, type: "sweet" })),
          ...drinks.map((p) => ({ ...p, type: "drinks" })),
          ...foodOptions.map((p) => ({ ...p, type: "options" })),
        ];

        const filtered = allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery) ||
            product.usp?.toLowerCase().includes(searchQuery) ||
            product.uspDescription?.toLowerCase().includes(searchQuery) ||
            product.category?.toLowerCase().includes(searchQuery) ||
            product.slug?.toLowerCase().includes(searchQuery)
        );

        setResults(filtered);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to search");
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const getProductLink = (product) => {
    if (product.type === "sweet") {
      return `/foods/sweet/${product.variantId || product.id}`;
    } else if (product.type === "drinks") {
      return `/foods/drinks/${product.variantId || product.id}`;
    } else if (product.type === "options") {
      return `/foods/${product.id}`;
    }
    return `/foods/view-all-hits/${product.variantId || product.id}`;
  };

  const getPrice = (product) => {
    if (product.price) return product.price.discountedPrice;
    if (product.discountedPrice) return product.discountedPrice;
    return "N/A";
  };

  const getImage = (product) => {
    return product.photoURL || product.image || product.photoUrl;
  };

  const getRating = (product) => {
    if (product.rating) {
      if (typeof product.rating === "object") {
        return product.rating.value;
      }
      return product.rating;
    }
    return 0;
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0b1220] px-3 sm:px-4 py-4 sm:py-6 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition text-gray-900 dark:text-white"
          >
            <IoArrowBack className="text-2xl" />
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Search Results for "{query}"
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Searching...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 ? (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Found {results.length} result{results.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {results.map((product, idx) => (
                <div
                  key={`${product.type}-${product.variantId || product.id}-${idx}`}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition md:transform md:hover:scale-105"
                >
                  <Link to={getProductLink(product)} className="block">
                    <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 h-44 sm:h-48">
                      <img
                        src={getImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 md:hover:scale-110"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    {product.category && (
                      <span className="inline-block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs font-semibold px-2 py-1 rounded mb-2">
                        {product.category}
                      </span>
                    )}

                    <h3 className="font-bold text-base sm:text-lg mb-1 dark:text-white line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {product.usp || product.uspDescription || ""}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-500">
                        {renderStars(getRating(product))}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getRating(product).toFixed(1)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                        ₹{getPrice(product)}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                        toast.success(`✅ ${product.name} added to cart!`);
                        navigate("/cart");
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-lg transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !loading && query.trim() ? (
          <div className="text-center py-12">
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
              No results found for "{query}"
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Try searching with different keywords
            </p>
          </div>
        ) : !loading && !query.trim() ? (
          <div className="text-center py-12">
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Enter a search term to find food items
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
