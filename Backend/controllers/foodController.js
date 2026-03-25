import fs from "fs";

// Load JSON safely in ESM
const fastFoodData = JSON.parse(
  fs.readFileSync(new URL("../data/fastFoodData.json", import.meta.url)),
);

const sweetsData = JSON.parse(
  fs.readFileSync(new URL("../data/sweetsData.json", import.meta.url)),
);

const foodData = JSON.parse(
  fs.readFileSync(new URL("../data/foodData.json", import.meta.url)),
);

import CurrentHits from "../models/currentHits.js";
import Drink from "../models/drink.js";
import Sweet from "../models/sweet.js";

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
    const currentHits = await CurrentHits.find();
    res.json({ products: currentHits }); // send all products
  } catch (error) {
    res.status(500).json({ message: "Food API failed" });
  }
};

// Get current hits by ID
const getFoodDetails = async (req, res) => {
  const { id } = req.params;

  try {
    let food = null;

    // 1️⃣ Check current hits (MongoDB)
    const currentHits = await CurrentHits.findById(id);
    if (currentHits) food = currentHits;

    // 2️⃣ Check sweets (MongoDB)
    if (!food) {
      const sweet = await Sweet.findById(id);
      if (sweet) food = sweet;
    }

    // 3️⃣ Check drinks (MongoDB)
    if (!food) {
      const drink = await Drink.findById(id);
      if (drink) food = drink;
    }

    // 4️⃣ Check JSON fallback (numbers)
    if (!food) {
      const numericId = isNaN(Number(id)) ? id : Number(id);

      const allJSONData = [
        fastFoodData,
        sweetsData.products,
        foodData.products,
      ];

      for (const dataset of allJSONData) {
        if (!dataset) continue;
        food = dataset.find((item) => item.id === numericId);
        if (food) break;
      }
    }

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json({ product: food });
  } catch (error) {
    console.error("Error in getFoodDetails:", error);
    res.status(500).json({ message: "Food API failed", error: error.message });
  }
};

// GET all sweets
const getSweetFood = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json({ products: sweets }); // send all products
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single sweet by ID
const getSpecificSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });
    res.json({ product: sweet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all drinks
const getDrinks = async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.json({ products: drinks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single drink by ID
const getSpecificDrink = async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    if (!drink) return res.status(404).json({ message: "Drink not found" });
    res.json({ product: drink });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single item by ID
const getSpecificItem = async (req, res) => {
  const categoryId = Number(req.params.id);

  const filteredItems = foodData.products.filter(
    (item) => item.categoryId === categoryId,
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
  getSpecificSweet,
  getSpecificDrink,
};
