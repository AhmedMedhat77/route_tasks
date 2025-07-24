import mongoose from "mongoose";

const notesSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return value !== value.toUpperCase();
      },
      message: "Title must not be in uppercase",
    },
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

export const Notes = mongoose.model("Notes", notesSchema);
