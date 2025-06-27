import { connection } from "../db/connect.js";

const ALTER_Products = `
ALTER TABLE \`products\`
ADD COLUMN Category TEXT NOT NULL DEFAULT '';
`;

const RemoveCategoryFromProducts = `
ALTER TABLE \`products\`
DROP COLUMN Category;
`;

export const alterProductTable = async (req, res) => {
  try {
    connection.query(ALTER_Products, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database error", err);
      }

      return res.status(200).send("Products table altered");
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const RemoveCategory = async (req, res) => {
  if (!connection) {
    return res.status(500).send("Not connected to database");
  }
  try {
    connection.query(RemoveCategoryFromProducts);
    return res.status(200).send("Category removed from products");
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const addProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products to add" });
    }

    const query = `INSERT INTO products (ProductName, price, StockQuantity, SupplierID) VALUES ?`;

    const values = products.map((product) => [
      product.ProductName,
      product.price,
      product.StockQuantity,
      product.SupplierID,
    ]);

    connection.query(query, [values], (err, result) => {
      if (err) {
        console.error("Database insert error:", err);
        if (err.errno === 1452) {
          return res.status(400).json({ message: "Have To add supplier first", success: false });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (!result.affectedRows) {
        return res.status(400).json({ message: "Products not added" });
      }

      return res.status(201).json({
        message: "Products added successfully",
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { ProductID, product } = req.body;

    if (!ProductID || !product || typeof product !== "object") {
      return res.status(400).json({ message: "Missing ProductID or product data" });
    }

    const updates = [];
    const values = [];

    // Only update fields that are defined (including falsy like 0 or '')
    for (const [key, value] of Object.entries(product)) {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Add ProductID to values for the WHERE clause
    const query = `UPDATE products SET ${updates.join(", ")} WHERE ProductID = ?`;
    values.push(ProductID);

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).send("Database error");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Product not found");
      }

      return res.status(200).send("Product updated successfully");
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).send("Server error");
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing ProductName" });
    }

    const query = `DELETE FROM products WHERE ProductID = ?`;
    const values = [id];

    connection.query(query, values, (err, result) => {
      if (err) {
        return res.status(500).send("Database error");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Product not found");
      }
    });
    return res.status(200).send("Product deleted");
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getProducts = async (req, res) => {
  try {
    const query = `SELECT * FROM products`;
    const [rows] = connection.query(query);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getHighestStockProduct = async (req, res) => {
  try {
    const query = `SELECT * FROM products ORDER BY StockQuantity DESC LIMIT 1; `;
    connection.query(query, (err, rows) => {
      if (err) {
        return res.status(500).send("Database error");
      }
      if (rows.length === 0) {
        return res.status(404).send("No Products not found");
      }
      return res.status(200).json(rows);
    });
  } catch (error) {
    res.status(500).json({ message: "internal Server error" });
  }
};

// 12-Show all products that have never been sold.

export const getAllProductsHaveNeverBeenSold = async (req, res) => {
  try {
    const query = `SELECT * FROM products WHERE ProductID NOT IN (SELECT ProductID FROM sales);`;
    connection.query(query, (err, rows) => {
      if (err) {
        return res.status(500).send("Database error");
      }
      if (rows.length === 0) {
        return res.status(404).send("No Products not found");
      }
      return res.status(200).json(rows);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
