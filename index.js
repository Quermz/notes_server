import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});

app.use(express.json());

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection ok"))
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ test: "okaay" });
});
