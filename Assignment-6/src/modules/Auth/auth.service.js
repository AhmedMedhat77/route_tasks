import Users from "../../DB/models/users.model.js";

export const signupService = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    if (!email || !name || !password || !role) {
      throw new Error("All fields are required", { cause: 400 });
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters", { cause: 400 });
    }
    if (role !== "admin" && role !== "user") {
      throw new Error("Invalid role", { cause: 400 });
    }

    const isExists = await Users.findOne({ where: { email } });

    if (isExists) {
      throw new Error("Email already exists", { cause: 409 });
    }

    const createdUser = await Users.create({ email, name, password, role });
    return res
      .status(201)
      .json({ message: "User added successfully", success: true, data: createdUser });
  } catch (error) {
    console.error(error);
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error", success: false });
  }
};

export const updateUserService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (!id) {
      throw new Error("Id is required", { cause: 400 });
    }

    // Upsert: create or update based on PK, skip validation
    const [user, created] = await Users.upsert(
      { id, name, email, password, role },
      { validate: false, returning: true }
    );

    return res.status(200).json({
      message: created ? "User created successfully" : "User updated successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error", success: false });
  }
};

export const getUserByEmailAddressService = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      throw new Error("Email is required", { cause: 400 });
    }
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found", { cause: 404 });
    }
    return res.status(200).json({ message: "User found", success: true, data: user });
  } catch (error) {
    console.error(error);
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error", success: false });
  }
};

export const getUserByIDService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Id is required", { cause: 400 });
    }
    const user = await Users.findByPk(id);
    if (!user) {
      throw new Error("User not found", { cause: 404 });
    }
    return res.status(200).json({ message: "User found", success: true, data: user });
  } catch (error) {
    console.error(error);
    return res
      .status(error.cause || 500)
      .json({ message: error.message || "Internal server error", success: false });
  }
};
