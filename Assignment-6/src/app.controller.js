import { connectDB, sequelize } from "./DB/connection.js";
import "./DB/models/users.model.js";
import "./DB/models/posts.model.js";
import "./DB/models/comments.model.js";
import authRouter from "./modules/Auth/auth.controller.js";
import postsRouter from "./modules/post/posts.controller.js";
import commentsRouter from "./modules/comments/comments.controller.js";

export async function bootstrap(app, express) {
  try {
    app.use(express.json());
    await connectDB();
    await sequelize.sync();
    app.use("/users", authRouter);
    app.use("/posts", postsRouter);
    app.use("/comments", commentsRouter);
  } catch (error) {
    console.log(error);
  }
}
