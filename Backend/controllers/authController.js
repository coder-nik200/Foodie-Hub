import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.json(null);

    jwt.verify(token, process.env.jwtSecret, {}, async (err, data) => {
      if (err) throw err;

      const user = await User.findById(data.userId).select("-password");
      res.json(user);
    });
  } catch (err) {
    res.json(null);
  }
};

export const postSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
    });

    await user.save();

    // ✅ Send JSON response
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    res.status(422).json({
      message: err.message || "Signup failed",
    });
  }
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) return res.status(404).json("User not found!");

    const passOk = await bcrypt.compare(password, userDoc.password);
    if (!passOk) return res.status(422).json("Password is incorrect");

    const token = jwt.sign(
      { email: userDoc.email, userId: userDoc._id, userType: userDoc.userType },
      process.env.jwtSecret,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: false, // true only in HTTPS
            sameSite: "lax",
          })
          .status(200)
          .json({
            message: "Login successful",
            user: {
              id: userDoc._id,
              email: userDoc.email,
              userType: userDoc.userType,
            },
          });
      }
    );
  } catch (err) {
    res.status(500).json("Login failed");
  }
};

export const Logut = (req, res) => {
  res.cookie("token", "").json("Logged out");
};
