import Posts from "../../DB/models/posts.model.js";
import Users from "../../DB/models/users.model.js";
import Comments from "../../DB/models/comments.model.js";
import { sequelize } from "../../DB/connection.js";
export const createPostService = async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    if (!userId || !title || !content) {
      throw new Error("Missing required fields", { cause: 400 });
    }
    const createdPost = await Posts.create({ userId, title, content });
    return res
      .status(201)
      .json({ data: createdPost, message: "Post created successfully", success: true });
  } catch (error) {
    res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error", success: false });
  }
};

export const deletePostService = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Missing required fields", { cause: 400 });
    }
    const deletedPost = await Posts.destroy({ where: { id: postId } });

    if (!deletedPost) {
      throw new Error("Post not found", { cause: 404 });
    }

    return res.status(200).json({ message: "Post deleted successfully", success: true });
  } catch (error) {
    res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error", success: false });
  }
};

export const getPostDetailsService = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID", id);
    if (!id) {
      throw new Error("Missing required fields", { cause: 400 });
    }
    const posts = await Posts.findAll({
      include: [
        { model: Users, attributes: ["id", "name"] },
        { model: Comments, attributes: ["id", "content"] },
      ],
    });

    return res
      .status(200)
      .json({ message: "Posts fetched successfully", success: true, data: posts });
  } catch (error) {
    res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error", success: false });
  }
};

export const getPostAndCommentCount = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID", id);
    if (!id) {
      throw new Error("Missing required fields", { cause: 400 });
    }
    const posts = await Posts.findAll({
      include: [{ model: Comments, attributes: [] }],
      attributes: ["id", "title", [sequelize.literal("COUNT(Comments.id)"), "commentCount"]], // Count comments and alias it as 'commentCount'
      group: ["Posts.id"],
    });

    res.status(200).json({ message: "Posts fetched successfully", success: true, data: posts });
  } catch (error) {
    res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error", success: false });
  }
};
