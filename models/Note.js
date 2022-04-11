import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    email: { type: String },
    title: { type: String, maxLength: 20 },
    content: { type: String, required: true, maxLength: 400 },
    favourite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Note", NoteSchema);
