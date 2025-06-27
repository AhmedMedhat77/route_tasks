import { connection } from "../db/connect.js";

const changePhoneNumberQuery = `
ALTER TABLE \`suppliers\`
MODIFY COLUMN \`ContactNumber\` VARCHAR(15);
`;

export const AlterContactNumber = (req, res) => {
  try {
    if (!connection) {
      return res.status(500).json({ message: "Database connection error" });
    }
    connection.query(changePhoneNumberQuery, (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Query execution error", error: err });
      }
      if (results.affectedRows === 0) return res.status(200).json({ message: "No changes made" });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addSupplier = async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;

    if (!SupplierName || !ContactNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!SupplierName || !ContactNumber)
      return res.status(400).json({ message: "Missing required fields" });

    // To avoid SQL injection
    const query = "INSERT INTO suppliers (SupplierName, ContactNumber) VALUES (?, ? )";
    const values = [SupplierName, ContactNumber];

    connection.query(query, values, (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Query execution error", error: err });
      }

      if (results.affectedRows === 0) {
        return res.status(400).json({ message: "Failed to add supplier" });
      }

      return res.status(201).json({ message: "Supplier added successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 11-Find suppliers with names starting with 'F'. (0.5 Grade)
export const findSuppliersStartingWithF = async (req, res) => {
  try {
    const query = "SELECT * FROM suppliers WHERE SupplierName LIKE 'F%'";

    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Query execution error", error: err });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
