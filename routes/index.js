import express from "express";
import {
  addProducts,
  alterProductTable,
  deleteProductController,
  getAllProductsHaveNeverBeenSold,
  getHighestStockProduct,
  RemoveCategory,
  updateProductController,
} from "../controllers/productController.js";
import {
  addSupplier,
  AlterContactNumber,
  findSuppliersStartingWithF,
} from "../controllers/suppliersController.js";
import {
  addToSales,
  getAllSales,
  getTotalSalesForEachProduct,
} from "../controllers/salesController.js";
import {
  createUser,
  grantDeletePermission,
  revokeUserUpdatePermission,
} from "../controllers/userController.js";

const router = express.Router();

// product Apis
router.patch("/products/alterCategory", alterProductTable);
router.delete("/products/deleteCategory", RemoveCategory);
router.post("/products/addProducts", addProducts);
router.patch("/products/updateProduct", updateProductController);
router.delete("/products/deleteProduct/:id", deleteProductController);
router.get("/products/highestStockProducts", getHighestStockProduct);
router.get("/products/notInSales", getAllProductsHaveNeverBeenSold);

// Sales APIS
router.post("/sales/addSales", addToSales);
router.get("/sales/getTotalSales", getTotalSalesForEachProduct);
router.get("/sales/getAllSales", getAllSales);

// Supplier APIS
router.patch("/suppliers/contactNumber", AlterContactNumber);
router.post("/suppliers/addSupplier", addSupplier);
router.get("/suppliers/findSupplier", findSuppliersStartingWithF);
// user controller
router.post("/user/createUser", createUser);
router.put("/user/revokeUpdate", revokeUserUpdatePermission);
router.put("/user/grantDelete", grantDeletePermission);

export default router;
