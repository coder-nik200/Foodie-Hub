const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json("Host route working");
});

module.exports = router;
