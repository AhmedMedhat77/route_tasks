import express from "express";

import {
  createPostService,
  deletePostService,
  getPostAndCommentCount,
  getPostDetailsService,
} from "./posts.service.js";

const postsRouter = express.Router();

postsRouter.post("/", createPostService);
postsRouter.delete("/:postId", deletePostService);
postsRouter.get("/details/:id", getPostDetailsService);
postsRouter.get("/comment-count/:id", getPostAndCommentCount);

export default postsRouter;
