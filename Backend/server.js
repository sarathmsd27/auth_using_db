const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthModel = require("./Model/auth");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "your_jwt_secret"; // Replace this with a secure secret in a real application

mongoose.connect("mongodb://127.0.0.1:27017/auth");

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json("Invalid token.");
  }
};

// Registration endpoint with password hashing
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await AuthModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json("User already exists. Please login.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new AuthModel({ email: email, password: hashedPassword });
    await newUser.save();

    res.json("User registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

// Login endpoint with password verification and JWT generation
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AuthModel.findOne({ email: email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Generate JWT
        const token = jwt.sign(
          { _id: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ message: "Success", token: token });
      } else {
        res.json("Invalid password");
      }
    } else {
      res.json("No account found. Please register to login");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

// Protected route example
app.get("/protected", authenticateJWT, (req, res) => {
  res.json("This is a protected route");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
