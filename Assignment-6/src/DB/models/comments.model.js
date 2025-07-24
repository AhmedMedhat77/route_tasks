import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection.js";

class Comments extends Model {}

Comments.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, modelName: "Comments" }
);

export default Comments;
