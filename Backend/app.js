//External Module
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/static", express.static("data"));

//Database connection and Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Routes
app.use("/api/auth", require("./routes/userRouter"));
app.use("/api/foods", require("./routes/productRouter"));
app.use("/api/cart", require("./routes/cartRouter"));
app.use("/api/orders", require("./routes/orderRouter"));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Error handling middleware
app.use(require("./middlewares/errorHandler"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
