import { connection } from "../db/connect.js";

const createSuppliersTable = `
  CREATE TABLE IF NOT EXISTS suppliers (
    SupplierID INT PRIMARY KEY AUTO_INCREMENT,
    SupplierName TEXT NOT NULL,
    ContactNumber TEXT NOT NULL
  );
`;

const createProductsTable = `
  CREATE TABLE IF NOT EXISTS products (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    ProductName TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    SupplierID INT NOT NULL,
    FOREIGN KEY (SupplierID) REFERENCES suppliers(SupplierID) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

const createSalesTable = `
  CREATE TABLE IF NOT EXISTS sales (
    SaleID INT PRIMARY KEY AUTO_INCREMENT,
    ProductID INT NOT NULL,
    QuantitySold INT NOT NULL, 
    SaleDate DATE NOT NULL,
    FOREIGN KEY (ProductID) REFERENCES products(ProductID) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const createInitialTables = () => {
  connection.query(createSuppliersTable, (err) => {
    if (err) {
      console.error("Error creating suppliers table:", err.message);
      return;
    }
    console.log("Suppliers table created or already exists.");

    connection.query(createProductsTable, (err) => {
      if (err) {
        console.error("Error creating products table:", err.message);
        return;
      }
      console.log("Products table created or already exists.");

      connection.query(createSalesTable, (err) => {
        if (err) {
          console.error("Error creating sales table:", err.message);
          return;
        }
        console.log("Sales table created or already exists.");
      });
    });
  });
};
