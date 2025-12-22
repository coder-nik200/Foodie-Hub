const express = require("express");
const authRouter = express.Router();

const authController = require("../controllers/authController");

authRouter.get("/profile", authController.getProfile);
authRouter.post("/login", authController.postLogin);
authRouter.post("/signup", authController.postSignup);

module.exports = authRouter;
