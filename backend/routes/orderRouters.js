import express from 'express';
import { placeOrder } from '../controllers/orderController.js';

 // ---------------------------------------------
  // ORDER ROUTES
  // ---------------------------------------------
const orderRoute= express.Router();
orderRoute.post("/",placeOrder);

export default orderRoute;