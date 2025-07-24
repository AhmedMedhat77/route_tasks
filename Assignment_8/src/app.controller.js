import { connectDB } from "./DB/connection.js";
import authRouter from "./models/auth/auth.controller.js";
import notesRouter from "./models/notes/note.controller.js";
import { authenticateToken } from "./middleware/authenticateToken.js";

export const bootStrap = async (app, express) => {
  await connectDB();
  app.use(express.json());

  app.use("/user", authRouter);
  app.use("/notes", authenticateToken, notesRouter);
};
