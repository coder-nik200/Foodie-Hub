const express = require("express");
const userRouter = express.Router();

userRouter.get("/user", (req, res) => {
  res.json("User route working");
});

module.exports = userRouter;
