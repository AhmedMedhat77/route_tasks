import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import Posts from "./posts.model.js";
import Comments from "./comments.model.js";

const Users = sequelize.define(
  "Users",
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        checkPasswordLength(value) {
          if (value.length <= 6) {
            throw new Error("Password must be greater than 6 characters");
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: [["user", "admin"]],
        msg: "Role must be user or admin",
      },
    },
  },
  {
    hooks: {
      beforeCreate(user, options) {
        if (!user.name || user.name.length <= 2) {
          throw new Error("Name must be greater than 2 characters");
        }
      },
    },
  }
);
const userOptions = {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
};

Users.hasMany(Posts, userOptions);
Posts.belongsTo(Users, userOptions);

Users.hasMany(Comments, userOptions);
Comments.belongsTo(Users, userOptions);

Posts.hasMany(Comments, { foreignKey: "postId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Comments.belongsTo(Posts, { foreignKey: "postId", onDelete: "CASCADE", onUpdate: "CASCADE" });

export default Users;
