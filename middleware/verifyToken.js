import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_KEY, (err, email) => {
      if (err) {
        res.status(403).json("Token is not valid!");
      }
      if (req.headers.email != email.email) {
        res.status(403).json("You are not authorized to access this route!");
      }
      if (req.headers.email == email.email) {
        next();
      }
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};
