import { connection } from "../db/connect.js";

export const createUser = async (req, res) => {
  try {
    const user = "store_manager";
    const password = "StrongPassword123"; // 🔐 Replace with actual secure password

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const createUserQuery = `CREATE USER IF NOT EXISTS '${user}'@'localhost' IDENTIFIED BY ?`;
    const grantPrivilegesQuery = `GRANT ALL PRIVILEGES ON *.* TO '${user}'@'localhost' WITH GRANT OPTION`;

    // Step 1: Create user
    connection.query(createUserQuery, [password], (err1) => {
      if (err1) {
        return res.status(500).json({
          success: false,
          message: `Error creating user: ${err1.message}`,
        });
      }

      // Step 2: Grant all privileges
      connection.query(grantPrivilegesQuery, (err2) => {
        if (err2) {
          return res.status(500).json({
            success: false,
            message: `User created, but failed to grant privileges: ${err2.message}`,
          });
        }

        return res.status(200).json({
          success: true,
          message: "User created and granted all privileges",
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};