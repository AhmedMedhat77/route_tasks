import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection.js";

class Posts extends Model {}

Posts.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, modelName: "Posts", paranoid: true }
);

export default Posts;
