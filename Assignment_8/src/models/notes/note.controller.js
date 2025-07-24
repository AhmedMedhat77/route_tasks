import { Router } from "express";
import * as noteService from "./note.service.js";

const notesRouter = Router();

notesRouter.get("/paginated", noteService.getPaginatedNotes);
notesRouter.get("/note-by-content", noteService.getNoteByContent);
notesRouter.get("/note-with-user", noteService.getNotesWithUser);
notesRouter.get("/aggregate", noteService.getAggregatedNotes);

notesRouter.get("/:id", noteService.getNoteByID);

notesRouter.post("/", noteService.createNote);

notesRouter.put("/replace/:id", noteService.replaceNote);

notesRouter.patch("/all", noteService.updateNotesTitle);
notesRouter.patch("/:id", noteService.updateNote);

notesRouter.delete("/", noteService.deleteAllUserNotes);
notesRouter.delete("/:id", noteService.deleteNoteById);

export default notesRouter;
