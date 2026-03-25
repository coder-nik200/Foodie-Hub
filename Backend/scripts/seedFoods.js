// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Product = require("../models/Product.js");
// const products = require("../data/currenthits.json");

// dotenv.config();

// const seedFoods = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("MongoDB connected");

//     // OPTIONAL: clear existing products
//     await Product.deleteMany();
//     console.log("Old products removed");

//     // Insert new products
//     await Product.insertMany(products);
//     console.log("Products seeded successfully");

//     process.exit();
//   } catch (error) {
//     console.error("Seeding failed:", error);
//     process.exit(1);
//   }
// };

// seedFoods();

// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Product = require("../models/Product.js");
// const Category = require("../models/Category.js");
// const fs = require("fs");
// const path = require("path");

// dotenv.config();

// const filePath = path.join(__dirname, "../data/foodData.json");
// const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// let foods = rawData.products;

// if (!foods) {
//   console.error("❌ Products data not found in JSON");
//   process.exit(1);
// }

// // ✅ Only fix rating (DO NOT TOUCH price)
// foods = foods.map((item) => ({
//   ...item,
//   rating: item.rating?.value || 0,
//   price: {
//     originalPrice:
//       item.price?.originalPrice || item.price?.discountedPrice || 0,
//     discountedPrice: item.price?.discountedPrice || null,
//     discountPercent: item.price?.discountPercent || 0,
//   },
// }));

// const seedFoods = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("MongoDB connected");

//     await Product.deleteMany();
//     console.log("Old products removed");

//     // 🔥 Get all categories
//     const categories = await Category.find();

//     const categoryMap = {};
//     categories.forEach((cat) => {
//       categoryMap[cat.name] = cat._id;
//     });

//     // 🔥 Replace category name with ObjectId
//     const formattedFoods = [];

//     for (const item of foods) {
//       const categoryName = item.category.trim();

//       const categoryDoc = await Category.findOneAndUpdate(
//         { name: categoryName },
//         {
//           name: categoryName,
//           image: "https://via.placeholder.com/300",
//         },
//         {
//           new: true,
//           upsert: true, // 🔥 This prevents duplicate errors
//           setDefaultsOnInsert: true,
//         },
//       );

//       formattedFoods.push({
//         ...item,
//         category: categoryDoc._id,
//       });
//     }

//     console.log("Seeding items:", formattedFoods.length);

//     await Product.insertMany(formattedFoods);

//     console.log("✅ Foods Seeded Successfully");
//     process.exit();
//   } catch (error) {
//     console.error("Seeding failed:", error);
//     process.exit(1);
//   }
// };

// const seedFoods = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("MongoDB connected");

//     await Product.deleteMany();
//     console.log("Old products removed");

//     const formattedFoods = [];

//     for (const item of foods) {
//       const categoryDoc = await Category.findOne({ name: item.category });

//       if (!categoryDoc) continue;

//       formattedFoods.push({
//         ...item,
//         category: categoryDoc._id,
//       });
//     }

//     console.log("Seeding items:", formattedFoods.length);

//     await Product.insertMany(formattedFoods);

//     console.log("✅ Foods Seeded Successfully");
//     process.exit();
//   } catch (error) {
//     console.error("Seeding failed:", error);
//     process.exit(1);
//   }
// };

// seedFoods();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");

dotenv.config();

const filePath = path.join(__dirname, "../data/foodData.json");
const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
const foods = rawData.products;

const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");

    await Product.deleteMany();
    console.log("Old products removed");

    const formattedFoods = [];

    for (const item of foods) {
      let categoryDoc = await Category.findOne({ name: item.category });

      if (!categoryDoc) {
        categoryDoc = await Category.create({
          name: item.category,
          image: "https://via.placeholder.com/300",
        });
      }

      formattedFoods.push({
        ...item,
        category: categoryDoc._id,
        rating: item.rating?.value || 0,
      });
    }

    console.log("Total foods in JSON:", foods.length);
    console.log("Seeding items:", formattedFoods.length);

    await Product.insertMany(formattedFoods);

    console.log("✅ Foods Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedFoods();
