import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

dotenv.config();

// Register new user
router.post("/register", async (req, res) => {
  try {
    if (req.body.password != req.body.confirmPassword) {
      res.status(401).json("Confirm your password");
      return;
    }
    if (
      !req.body.email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      res.status(400).json("Email");
      return;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 5);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.headers.email });
    let validPassword = false;
    if (user) {
      validPassword = await bcrypt.compare(req.headers.password, user.password);
    }
    if (validPassword) {
      const accessToken = jwt.sign({ email: user.email }, process.env.JWT_KEY, {
        expiresIn: "12h",
      });
      delete user._doc.password;

      res.status(200).json({ accessToken, user });
    } else {
      res.status(401).json("invalid details");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Check token
router.post("/reload", verifyToken, async (req, res) => {
  res.status(200).json("ok");
});

// Reload user
// router.post("/reload", async (req, res) => {
//   const authHeader = req.headers.token;
//   let userEmail = "";
//   try {
//     jwt.verify(authHeader, process.env.JWT_KEY, (err, email) => {
//       console.log(email.email);
//       if (err) {
//         res.status(500).json("Token is not valid!");
//       }

//       userEmail = email;
//     });
//     const user = User.findOne({ email: email.email });
//     console.log(user);
//     delete user._doc.password;
//     res.status(200).json(user);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

export default router;
