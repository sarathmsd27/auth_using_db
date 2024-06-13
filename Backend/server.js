const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AuthModel = require("./Model/auth");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/auth");

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  AuthModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.json("Success");
        } else {
          res.json("Invalid password");
        }
      } else {
        res.json("No account found. Please register to login");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json("Server error");
    });
});


app.post("/register", (req, res) => {
  AuthModel.create(req.body)
    .then((auth) => res.json(auth))
    .catch((err) => res.json(err));
});

app.listen(3001, () => {
  console.log("server is running");
});
