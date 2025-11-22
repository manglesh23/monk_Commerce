import express from "express";
import {
  addProduct,
} from "../controllers/productController.js";

 // ---------------------------------------------
  // PRODUCT ROUTES
  // ---------------------------------------------
const productRoute = express.Router();

// Admin only 
productRoute.post("/",  addProduct);


export default productRoute;