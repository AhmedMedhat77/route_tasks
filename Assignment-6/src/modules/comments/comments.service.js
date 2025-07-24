import Comments from "../../DB/models/comments.model.js";
import Posts from "../../DB/models/posts.model.js";
import Users from "../../DB/models/users.model.js";
import { Op } from "sequelize";


export const addCommentsService = async (req, res) => {
  try {
    const { comments } = req.body;
    if (!comments.length) {
      throw new Error("Comments cannot be empty", { cause: 400 });
    }
    await Comments.bulkCreate(comments);
    return res.status(201).json({ message: "Comments Created" });
  } catch (error) {
    res.status(error.cause || 500).json({ message: error.message || "Internal Server Error" });
  }
};

export const updateCommentService = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    if (!content.length) {
      throw new Error("Comments cannot be empty", { cause: 400 });
    }

    await Comments.update(content, { where: { id: commentId } });
    return res.status(200).json({ message: "Comments Updated" });
  } catch (err) {
    return res.status(err.cause || 500).json({ message: err.message || "Internal Server Error" });
  }
};

export const findOrCreateComment = async (req, res) => {
  try {
    const { userId, postId, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comments cannot be empty" });
    }

    // Check if post exists
    const postExists = await Posts.findByPk(postId);
    if (!postExists) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user exists
    const userExists = await Users.findByPk(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find or create comment
    const [comment, created] = await Comments.findOrCreate({
      where: { postId, userId, content },
      include: [Users, Posts],
    });

    return res.status(created ? 201 : 200).json({
      comment,
      created,
      message: created ? "Comment created successfully" : "Comment already exists",
    });
  } catch (err) {
    console.error("Error in findOrCreateComment:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchComments = async (req, res) => {
  try {
    const { word } = req.query;
    const comments = await Comments.findAndCountAll({
      where: {
        content: {
          [Op.like]: `%${word}%`,
        },
      },
    });
    return res.status(200).json(comments);
  } catch (err) {
    console.error("Error in findOrCreateComment:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNewestComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comments.findAll({
      where: { postId },
      order: [["createdAt", "DESC"]],
      limit: 3,
    });
    return res.status(200).json(comments);
  } catch (err) {
    console.error("Error in findOrCreateComment:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Specific Comment By PK with User and Post Information.

export const getCommentDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Comment ID is required" });
    }

    const comment = await Comments.findByPk(id, {
      include: [
        { model: Users, attributes: ["id", "name", "email"] },
        { model: Posts, attributes: ["id", "title", "content"] },
      ],
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(comment);
  } catch (err) {
    console.error("Error in getCommentDetailsById:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
