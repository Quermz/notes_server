import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();

// cors middleware
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection ok"))
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT || 5000, () => {
  console.log(`server is listening on port ${process.env.PORT}`);
});

app.use("/api/user", authRoutes);
app.use("/api/notes", noteRoutes);
