import { ObjectId } from "bson";
import bcrypt from "bcrypt";
// Models
import { User } from "../../DB/models/user.model.js";
// UTILS
import { hashPhoneNumber } from "../../utils/hashPhoneNumber.js";
import generateJWT from "../../utils/token.js";

// in future will be stored in env but for seek of Assignment this saved here
const salt = "Kx0ZNe4nKbqQEF2Yv59BkYivp/j7jLrNNDdPlJ5x1rBOV5kvW8Atfl4jI+5F6MP3d9bR5rN76BX1uQ00";

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;

    if (!name || !email || !password || !phone || !age) {
      throw new Error("All fields are required", { cause: 400 });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists", { cause: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: hashPhoneNumber(phone, salt),
      age,
    });

    return res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("All fields are required", { cause: 400 });
    }
    const user = await User.findOne({ email }, {}, { exclude: { password: 1, __v: 1 } });
    if (!user) {
      throw new Error("User not found", { cause: 404 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password", { cause: 401 });
    }
    const token = generateJWT(user._id);
    const refreshToken = generateJWT(user._id, "7d");
    const { password: _p, __v, ...rest } = user.toObject();

    return res.status(200).json({ user: rest, token, refreshToken, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, age } = req.body;
    const { _id } = req.user;
    const user = await User.findOne({ _id: ObjectId.createFromHexString(_id) });

    const userID = ObjectId.createFromHexString(_id);

    // check if updated email exists
    const userExists = await User.findOne({ email });

    if (userExists && userExists._id !== userID) {
      throw new Error("User already exists", { cause: 409 });
    }

    if (!user) {
      throw new Error("User not found", { cause: 404 });
    }
    await User.updateOne(
      { _id: userID },
      {
        name,
        email,
        phone: hashPhoneNumber(phone, salt),
        age,
      }
    );
    return res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (error) {
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id: ObjectId.createFromHexString(_id) });

    if (!user) {
      throw new Error("User not found", { cause: 404 });
    }
    await User.deleteOne({ _id: user._id });
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id: ObjectId.createFromHexString(_id) });

    if (!user) {
      throw new Error("User not found", { cause: 404 });
    }
    const { password: _p, __v, ...rest } = user.toObject();
    return res.status(200).json({ user: rest, success: true });
  } catch (error) {
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "internal server error" });
  }
};
