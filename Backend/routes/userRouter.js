const express = require("express");
const { getSignup, getLogin } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", getSignup);
router.post("/login", getLogin);

module.exports = router;
