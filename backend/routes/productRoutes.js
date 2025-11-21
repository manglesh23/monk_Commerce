import express from "express";
import {
  addProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct
} from "../controllers/productController.js";

const productRoute = express.Router();

// Public
// router.get("/", getProducts);
// router.get("/:id", getProductById);

// Admin only
productRoute.post("/",  addProduct);
// router.put("/:id", verifyToken, verifyAdmin, updateProduct);
// router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

export default productRoute;