const express = require("express");
const { getFoodOptions, getFoodById } = require("../controllers/foodController");

const router = express.Router();

router.get("/food-options", getFoodOptions);
router.get("/:id", getFoodById);

module.exports = router;
