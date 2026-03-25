import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { RenderStars } from "./RenderStarts";

const FullMenu = () => {
  const { id: currentId } = useParams();

  const [allFoods, setAllFoods] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 21;

  useEffect(() => {
    api
      .get(`/foods?page=${page}&limit=${limit}`)
      .then((res) => {
        setAllFoods(res.data.products || []);
        setPages(res.data.pages || 1);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [page]);

  const otherFoods = allFoods.filter((item) => item._id !== currentId);

  return (
    <>
      {otherFoods.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">All Foods</h2>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {otherFoods.map((item) => (
              <Link
                to={`/foods/${item._id}`}
                key={item._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold">{item.name}</h3>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-500">
                      {RenderStars(item.rating || 0)}
                    </span>
                    <span className="text-gray-500">({item.rating || 0})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">
                      ₹{item.price?.discountedPrice ?? 0}
                    </span>
                    <span className="line-through text-gray-400 text-sm">
                      ₹{item.price?.originalPrice ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">
              {/* Prev Button */}
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 
        ${
          page === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        }`}
              >
                ← Prev
              </button>

              {/* Page Numbers */}
              {[...Array(pages)].map((_, index) => {
                const pageNumber = index + 1;
                const isActive = page === pageNumber;

                return (
                  <button
                    key={index}
                    onClick={() => setPage(pageNumber)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300
            ${
              isActive
                ? "bg-orange-600 text-white shadow-lg scale-110"
                : "bg-white text-gray-700 shadow-md hover:bg-red-50 hover:text-red-600 hover:scale-105"
            }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                disabled={page === pages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 
        ${
          page === pages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        }`}
              >
                Next →
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default FullMenu;
