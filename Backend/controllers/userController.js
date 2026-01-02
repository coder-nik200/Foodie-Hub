const axios = require("axios");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType } = req.body;

    // 1️⃣ Validate
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// const getLogin = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const isPasswordMatch = await bcrypt.compare(password, user.password);

//   if (!isPasswordMatch) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });

//   res.cookie("token", token, {
//     httpOnly: true,
//     // secure: true,
//     secure: false,
//     sameSite: "lax",
//   });

//   res.json({ success: true, message: "Login successful", user });
// };

const getLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true if HTTPS
      sameSite: "lax",
    });

    const { password: _, ...userData } = user._doc;
    res.json({ success: true, message: "Login successful", user: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getSignup, getLogin };
