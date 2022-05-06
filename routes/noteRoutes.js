import express from "express";
import dotenv from "dotenv";
import Note from "../models/Note.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

dotenv.config();

// Create new note
router.post("/createNote", verifyToken, async (req, res) => {
  try {
    const newNote = new Note({
      email: req.headers.email,
      title: req.body.title,
      content: req.body.content,
      favourite: req.body.favourite,
    });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get notes
router.get("/getNotes", verifyToken, async (req, res) => {
  try {
    let returnNotes = await Note.find({ email: req.headers.email }).sort({
      updatedAt: "desc",
    });

    res.status(200).json(returnNotes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get single note
router.get("/getNote", verifyToken, async (req, res) => {
  try {
    let singleNote = await Note.findOne({
      email: req.headers.email,
      _id: req.headers.noteid,
    });
    res.status(200).json(singleNote);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get favourites
router.get("/getFavourites", verifyToken, async (req, res) => {
  try {
    let returnNotes = await Note.find({
      email: req.headers.email,
      favourite: true,
    }).sort({ updatedAt: "desc" });
    res.status(200).json(returnNotes);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update note
router.put("/updateNote", verifyToken, async (req, res) => {
  try {
    let updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.headers.noteid,
        email: req.headers.email,
      },
      {
        title: req.body.title,
        content: req.body.content,
        favourite: req.body.favourite,
      }
    );
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Note
router.delete("/deleteNote", verifyToken, async (req, res) => {
  try {
    let returnNotes = await Note.findOne({ email: req.headers.noteid });
    let deletedNote = await Note.findOneAndDelete({
      _id: req.headers.noteid,
    });
    res.status(200).json(returnNotes);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
