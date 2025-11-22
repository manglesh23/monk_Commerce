import express from "express";
import {
//   applyCoupon,
  applySpecificCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getApplicableCoupons,
  getCouponById,
  updateCoupon,
} from "../controllers/couponController.js";

 // ---------------------------------------------
  // COUPON ROUTES
  // ---------------------------------------------

const couponRoute = express.Router();

// couponRoute.post("/", applyCoupon);
couponRoute.post("/createCoupon", createCoupon);
couponRoute.get("/", getAllCoupons);
couponRoute.get("/coupons/:id", getCouponById);
couponRoute.put("/coupons/update/:id", updateCoupon);
couponRoute.delete("/coupons/delete/:id", deleteCoupon);

// Coupon evaluation
couponRoute.post("/applicable-coupons", getApplicableCoupons);
couponRoute.post("/apply-coupon/:id", applySpecificCoupon);

export default couponRoute;
