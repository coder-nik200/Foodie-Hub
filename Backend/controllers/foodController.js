// import axios from "axios";
// const fastFoodData = require("../data/fastFoodData");

// // import fastFoodData from "../data/fastFoodData.json";
// // const Food = require("../models/foodModel");
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");

// // const getFoodOptions = async (req, res) => {
// //   try {
// //     const categories = ["pizza", "burger", "biryani", "dessert", "pasta"];

// //     const requests = categories.map((cat, index) =>
// //       axios.get(`https://foodish-api.com/api/images/${cat}`).then((r) => ({
// //         info: {
// //           id: index + 1,
// //           name: cat.toUpperCase(),
// //           imageUrl: r.data.image,
// //         },
// //       }))
// //     );

// //     const data = await Promise.all(requests);

// //     res.json({ data });
// //   } catch (error) {
// //     res.status(500).json({ message: "Food API failed" });
// //   }
// // };

import fs from "fs";

// Load JSON safely in ESM
const fastFoodData = JSON.parse(
  fs.readFileSync(new URL("../data/fastFoodData.json", import.meta.url))
);
const currentHits = JSON.parse(
  fs.readFileSync(new URL("../data/currenthits.json", import.meta.url))
);
const sweetsData = JSON.parse(
  fs.readFileSync(new URL("../data/sweetsData.json", import.meta.url))
);
const drinksData = JSON.parse(
  fs.readFileSync(new URL("../data/drinksData.json", import.meta.url))
);
const foodData = JSON.parse(
  fs.readFileSync(new URL("../data/foodData.json", import.meta.url))
);

// Get all food options
const getFoodOptions = async (req, res) => {
  try {
    res.json({ data: fastFoodData }); // send all products
  } catch (error) {
    res.status(500).json({ message: "Food API failed" });
  }
};

// Get food by ID
const getFoodById = (req, res) => {
  const { id } = req.params;

  const food = fastFoodData.find((item) => item.id === Number(id));

  if (!food) {
    return res.status(404).json({ message: "Food not found" });
  }

  res.json({ product: food });
};

// Get all current hits
const getCurrentHits = async (req, res) => {
  try {
    res.json({ products: currentHits.products }); // send all products
  } catch (error) {
    res.status(500).json({ message: "Food API failed" });
  }
};

// Get current hits by ID
const getFoodDetails = async (req, res) => {
  const { id } = req.params;
  try {
    let food = null;

    food = currentHits.products.find((item) => item.variantId === id);

    if (!food && foodData?.products) {
      food = foodData.products.find((item) => item.id === id);
    }

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.status(200).json({ product: food });
  } catch (error) {
    res.status(500).json({ message: "Food API failed" });
  }
};

const getSweetFood = async (req, res) => {
  try {
    res.json({ products: sweetsData.products }); // send all products
  } catch (error) {
    res.status(500).json({ message: "Food API failed" });
  }
};

const getDrinks = async (req, res) => {
  try {
    res.json({ products: drinksData.products }); // send all products
  } catch (error) {
    res.status(500).json({ message: "Food API failed" });
  }
};

const getSpecificItem = async (req, res) => {
  const categoryId = Number(req.params.id);

  const filteredItems = foodData.products.filter(
    (item) => item.categoryId === categoryId
  );

  res.json({
    total: filteredItems.length,
    products: filteredItems,
  });
};

export {
  getFoodOptions,
  getFoodDetails,
  getFoodById,
  getCurrentHits,
  getSweetFood,
  getDrinks,
  getSpecificItem,
};
