import { Notes } from "../../DB/models/notes.model.js";
import { ObjectId } from "bson";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { _id } = req.user;

    if (!title || !content) {
      throw new Error("All fields are required", { cause: 400 });
    }
    const note = await Notes.create({
      title,
      content,
      userId: ObjectId.createFromHexString(_id),
    });
    return res.status(201).json({ note, success: true });
  } catch (error) {
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "internal server error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { _id } = req.user;
    const noteId = ObjectId.createFromHexString(req.params.id);
    const userId = ObjectId.createFromHexString(_id);
    const { title, content } = req.body;

    if (!title || !content) {
      throw new Error("All fields are required", { cause: 400 });
    }

    // Find the note and verify ownership
    const note = await Notes.findOne({ _id: noteId, userId });
    if (!note) {
      throw new Error("Access denied or Note not found", { cause: 403 });
    }

    // Update and return the new version
    const updatedNote = await Notes.findByIdAndUpdate(
      noteId,
      { title, content },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ note: updatedNote, success: true });
  } catch (error) {
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const replaceNote = async (req, res) => {
  try {
    const { _id } = req.user;
    const { id } = req.params;
    const { title, content } = req.body;

    const noteId = ObjectId.createFromHexString(id);
    const userId = ObjectId.createFromHexString(_id);

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Replace the note if it exists and belongs to the user
    const note = await Notes.findOneAndReplace(
      { _id: noteId, userId },
      { title, content, userId }, // include userId to keep it intact after replacement
      { returnDocument: "after" } // returns the updated document
    );

    if (!note?.value) {
      return res.status(403).json({ message: "Access denied or Note not found" });
    }

    return res.status(200).json({ note: note.value, success: true });
  } catch (error) {
    console.error("Replace Note Error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateNotesTitle = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Perform bulk update
    const updateResult = await Notes.updateMany(
      { userId },
      { $set: { title } },
      { runValidators: true }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: "No notes were updated" });
    }

    // Fetch updated notes to return
    const updatedNotes = await Notes.find({ userId });

    return res
      .status(200)
      .json({ notes: updatedNotes, count: updateResult.modifiedCount, success: true });
  } catch (error) {
    console.error("Update Notes Title Error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteNoteById = async (req, res) => {
  try {
    const userId = req.user._id;
    const noteId = req.params.id;

    if (!ObjectId.createFromHexString(noteId)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const deletedNote = await Notes.findOneAndDelete({
      _id: ObjectId.createFromHexString(noteId),
      userId: ObjectId.createFromHexString(userId),
    });

    if (!deletedNote) {
      return res.status(403).json({ message: "Access denied or Note not found" });
    }

    return res.status(200).json({ note: deletedNote, success: true });
  } catch (error) {
    console.error("Delete Note Error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getPaginatedNotes = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Query notes
    const notes = await Notes.find({ userId: ObjectId.createFromHexString(userId) })
      .sort({ createdAt: -1 }) // Descending order
      .skip(skip)
      .limit(limit);

    const total = await Notes.countDocuments({ userId: ObjectId.createFromHexString(userId) });

    return res.status(200).json({
      notes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error("Get Paginated Notes Error:", error);
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const getNoteByID = async (req, res) => {
  try {
    const userId = req.user._id;
    const noteId = req.params.id;

    if (!ObjectId.createFromHexString(noteId)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Notes.findOne({
      _id: ObjectId.createFromHexString(noteId),
      userId: ObjectId.createFromHexString(userId),
    });

    if (!note) {
      throw new Error("Access denied or Note not found", { cause: 403 });
    }

    return res.status(200).json({ note, success: true });
  } catch (error) {
    console.error("Get Note by ID Error:", error);
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const getNoteByContent = async (req, res) => {
  try {
    const _id = req.user._id;
    const userId = ObjectId.createFromHexString(_id);
    const content = req.query.content;

    if (!content) {
      throw new Error("Content is required", { cause: 400 });
    }

    const note = await Notes.findOne({
      content,
      userId,
    });

    if (!note) {
      throw new Error("Access denied or Note not found", { cause: 403 });
    }

    return res.status(200).json({ note, success: true });
  } catch (error) {
    console.error("Get Note by Content Error:", error);
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const getNotesWithUser = async (req, res) => {
  try {
    const userId = ObjectId.createFromHexString(req.user._id);

    const notes = await Notes.aggregate([
      {
        $match: { userId },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $unwind: "$userId", // Flatten array to object
      },
      {
        $project: {
          title: 1,
          createdAt: 1,
          userId: {
            email: "$userId.email",
          },
        },
      },
    ]);
    return res.status(200).json({ notes, success: true });
  } catch (error) {
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const getAggregatedNotes = async (req, res) => {
  try {
    const userId = ObjectId.createFromHexString(req.user._id);
    const title = req.query.title || "";
    console.log(title);

    const notes = await Notes.aggregate([
      {
        $match: { userId, title: { $regex: title, $options: "i" } },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $unwind: "$userId", // Flatten array to object
      },
      {
        $project: {
          title: 1,
          createdAt: 1,
          userId: {
            email: "$userId.email",
          },
        },
      },
    ]);
    return res.status(200).json({ notes, success: true });
  } catch (error) {
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const deleteAllUserNotes = async (req, res) => {
  try {
    const userId = ObjectId.createFromHexString(req.user._id);
    const notes = await Notes.deleteMany({ userId });
    return res.status(200).json({ notes, success: true });
  } catch (error) {
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error" });
  }
};
