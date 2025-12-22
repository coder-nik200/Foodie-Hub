import { useParams } from "react-router-dom";
import fastFoodData from "../data/fastFoodData";

export default function FoodDetails() {
  const { id } = useParams();
  console.log("Route ID:", id); // 🔴 DEBUG LINE

  const food = fastFoodData.find((item) => item.id === Number(id));

  if (!food) {
    return <p className="text-center mt-10">Food not found</p>;
  }

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
