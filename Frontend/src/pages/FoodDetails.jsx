// import { useParams } from "react-router-dom";
// import fastFoodData from "../data/fastFoodData";

// export default function FoodDetails() {
//   const { id } = useParams();
//   console.log("Route ID:", id); // 🔴 DEBUG LINE

//   const food = fastFoodData.find((item) => item.id === Number(id));

//   if (!food) {
//     return <p className="text-center mt-10">Food not found</p>;
//   }

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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function FoodDetails() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/foods/${id}`)
      .then((res) => setFood(res.data.product))
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong");
        }
      });
  }, [id]);

  if (error) return <p className="text-center mt-10">{error}</p>;
  if (!food) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen p-10">
      <img
        src={food.photoURL}
        alt={food.name}
        className="w-64 h-64 object-cover rounded-xl mx-auto"
      />
      <h1 className="text-4xl font-bold text-center mt-6">{food.name}</h1>
    </div>
  );
}
