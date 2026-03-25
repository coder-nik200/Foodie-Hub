const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "Please provide description"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      originalPrice: {
        type: Number,
        required: true,
      },
      discountedPrice: {
        type: Number,
      },
      discountPercent: {
        type: Number,
      },
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    weight: String,
    pieces: String,
    serves: String,

    stock: {
      type: Number,
      default: 100,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    preparationTime: {
      type: Number,
      default: 30,
    },

    ingredients: {
      type: [String],
      default: [],
    },

    isSpicy: {
      type: Boolean,
      default: false,
    },

    isVegetarian: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
