import { connection } from "../db/connect.js";

export const addToSales = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products?.length) {
      return res.status(400).json({ message: "No products provided" });
    }

    const productIDs = products.map((p) => p.ProductID);

    // Step 1: Check Stock NOTE Products is in array so have to look up if the product id in the sent productIDs

    const stockRows = await query(
      `SELECT ProductID, StockQuantity FROM products WHERE ProductID IN (?) `,
      [productIDs]
    );

    // Step 1.5: Create a map for easy lookup as {productID: stockQuantity}
    const stockMap = {};
    // assign stock quantity to product id
    stockRows.forEach((row) => {
      stockMap[row.ProductID] = row.StockQuantity;
    });

    // Step 2: Check if there is enough stock
    const insufficientStock = products.filter((p) => p.QuantitySold > (stockMap[p.ProductID] || 0));

    // Step 2.5: If there is not enough stock, return an error
    if (insufficientStock.length) {
      return res.status(400).json({
        message: `Insufficient stock for products: ${insufficientStock
          .map((p) => p.ProductID)
          .join(", ")}`,
      });
    }

    // Step 3: Update stock
    for (const product of products) {
      await query(`UPDATE products SET StockQuantity = StockQuantity - ? WHERE ProductID = ?`, [
        product.QuantitySold,
        product.ProductID,
      ]);
    }

    // Step 4: Insert into sales table
    const saleValues = products.map((p) => [
      p.ProductID,
      p.QuantitySold,
      p.SaleDate || new Date(), // default to now if not provided
    ]);

    await query(`INSERT INTO sales (ProductID, QuantitySold, SaleDate) VALUES ?`, [saleValues]);

    return res.status(200).json({ message: "Sales recorded and stock updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getTotalSalesForEachProduct = async (req, res) => {
  try {
    const query = `SELECT 
  sales.ProductID, 
  products.ProductName,
  SUM(sales.QuantitySold) AS TotalQuantitySold,
  SUM(sales.QuantitySold * products.Price) AS TotalRevenue
FROM sales
INNER JOIN products ON sales.ProductID = products.ProductID
GROUP BY sales.ProductID, products.ProductName;`;

    connection.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "No sales found" });
      }

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSales = async (req, res) => {
  try {
    const query = `SELECT
        sales.ProductID,
        sales.SaleDate,
        products.ProductName
        FROM  sales 
        INNER JOIN products ON sales.ProductID = products.ProductID 
        GROUP BY sales.ProductID, sales.SaleDate, products.ProductName;
  `;

    connection.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "No sales found" });
      }

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
