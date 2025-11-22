import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

// import { verifyToken } from "../middlewares/verifyToken.js";  DIDN'T IMPLEMENTED FOR FAST SEARCH

 // ---------------------------------------------
  // CART ROUTES
  // ---------------------------------------------
const cartRouter = express.Router();

// cartRouter.use(verifyToken); // all cart routes need login

cartRouter.post("/add", addToCart);
cartRouter.get("/", getCart);
cartRouter.put("/update", updateCartItem);
cartRouter.delete("/remove", removeCartItem);
cartRouter.delete("/clear", clearCart);

export default cartRouter;
