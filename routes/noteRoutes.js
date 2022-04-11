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
      email: req.body.email,
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
router.put("/getNotes", verifyToken, async (req, res) => {
  try {
    let returnNotes = await Note.find({ email: req.body.email }).sort({
      updatedAt: "desc",
    });

    res.status(200).json(returnNotes);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get single note
router.put("/getNote", verifyToken, async (req, res) => {
  try {
    let singleNote = await Note.findOne({
      email: req.body.email,
      _id: req.body.noteId,
    });
    res.status(200).json(singleNote);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get favourites
router.put("/getFavourites", verifyToken, async (req, res) => {
  try {
    let returnNotes = await Note.find({
      email: req.body.email,
      favourite: true,
    }).sort({ updatedAt: "desc" });
    res.status(200).json(returnNotes);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Update note
router.put("/updateNote", verifyToken, async (req, res) => {
  try {
    let updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.body.noteId,
        email: req.body.email,
      },
      {
        title: req.body.title,
        content: req.body.content,
        favourite: req.body.favourite,
      }
    );
    res.status(200).json("Note Updated");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete Note
router.put("/deleteNote", verifyToken, async (req, res) => {
  try {
    let deletedNote = await Note.findOneAndDelete({
      _id: req.body.noteId,
      email: req.body.email,
    });
    res.status(200).json("Note Deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
