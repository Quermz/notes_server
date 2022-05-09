import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:8080",
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection ok"))
  .catch((err) => {
    console.log(err);
  });

app.use(
  "/api/user",
  cors({
    origin: process.env.ORIGIN || "http://localhost:8080",
  }),
  authRoutes
);
app.use(
  "/api/notes",
  cors({
    origin: process.env.ORIGIN || "http://localhost:8080",
  }),
  noteRoutes
);

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});
