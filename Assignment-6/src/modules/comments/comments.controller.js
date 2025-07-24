import express from "express";
import * as commentsServices from "./comments.service.js";

const commentsRouter = express.Router();

commentsRouter.post("/", commentsServices.addCommentsService);
commentsRouter.put("/:commentId", commentsServices.updateCommentService);
commentsRouter.post("/find-or-create", commentsServices.findOrCreateComment);
commentsRouter.get("/search", commentsServices.searchComments);
commentsRouter.get("/newest/:postId", commentsServices.getNewestComments);
commentsRouter.get("/details/:id", commentsServices.getCommentDetailsById);

export default commentsRouter;
