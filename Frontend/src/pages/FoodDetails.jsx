// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../api/axios";

// export default function FoodDetails() {
//   const { id } = useParams();
//   const [food, setFood] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     api
//       .get(`/foods/${id}`)
//       .then((res) => setFood(res.data.product))
//       .catch((err) => {
//         if (err.response) {
//           setError(err.response.data.message);
//         } else {
//           setError("Something went wrong");
//         }
//       });
//   }, [id]);

//   if (error) return <p className="text-center mt-10">{error}</p>;
//   if (!food) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="min-h-screen p-10">
//       <img
//         src={food.photoURL}
//         alt={food.name}
//         className="w-64 h-64 object-cover rounded-xl mx-auto"
//       />
//       <h1 className="text-4xl font-bold text-center mt-6">{food.name}</h1>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import api from "../api/axios";

// export default function FoodDetails() {
//   const { id } = useParams();
//   const [food, setFood] = useState(null);
//   const [allFoods, setAllFoods] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     // 1️⃣ Get selected food
//     api
//       .get(`/foods/${id}`)
//       .then((res) => setFood(res.data.product))
//       .catch((err) =>
//         setError(err.response?.data?.message || "Something went wrong")
//       );
//   }, [id]);

//   if (error) return <p className="text-center mt-10">{error}</p>;
//   if (!food) return <p className="text-center mt-10">Loading...</p>;

//   // 3️⃣ Filter related foods (same category)
//   const relatedFoods = allFoods.filter(
//     (item) => item.category === food.category && item.id !== food.id
//   );

//   return (
//     <div className="min-h-screen p-10 max-w-6xl mx-auto">
//       {/* MAIN FOOD */}
//       <div className="text-center">
//         <img
//           src={food.photoURL}
//           alt={food.name}
//           className="w-64 h-64 object-cover rounded-xl mx-auto"
//         />
//         <h1 className="text-4xl font-bold mt-6">{food.name}</h1>
//         <p className="text-gray-500 mt-2">{food.category}</p>
//         <p className="text-green-600 font-bold mt-2">₹{food.price}</p>
//       </div>

//       {/* RELATED FOODS */}
//       {relatedFoods.length > 0 && (
//         <div className="mt-16">
//           <h2 className="text-3xl font-bold mb-6 text-center">
//             Related {food.category}
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//             {relatedFoods.map((item) => (
//               <Link
//                 to={`/foods/${item.id}`}
//                 key={item.id}
//                 className="border rounded-xl p-4 hover:shadow-lg transition"
//               >
//                 <img
//                   src={item.photoURL}
//                   alt={item.name}
//                   className="h-40 w-full object-cover rounded-lg"
//                 />
//                 <h3 className="mt-3 font-semibold">{item.name}</h3>
//                 <p className="text-green-600 font-bold mt-1">₹{item.price}</p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function FoodDetails() {
  const { id } = useParams(); // categoryId (burger, pizza)
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
    <div className="min-h-screen p-10 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {foods.map((item) => (
          <Link
            to={`/foods/view-all-hits/${item.id}`}
            key={item.id}
            className="border rounded-xl p-4 hover:shadow-lg transition"
          >
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
        ))}
      </div>
    </div>
  );
}
