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
import { getTheCandidateAge } from "../controllers/ageGuessAPI.js";

 // ---------------------------------------------
  // COUPON ROUTES
  // ---------------------------------------------

const couponRoute = express.Router();

// couponRoute.post("/", applyCoupon);
couponRoute.post("/createCoupon", createCoupon);  //This For Admin Only
couponRoute.get("/", getAllCoupons); //For All Role
couponRoute.get("/coupons/:id", getCouponById); //For ALl Role
couponRoute.put("/coupons/update/:id", updateCoupon);// By Admin only
couponRoute.delete("/coupons/delete/:id", deleteCoupon);//By Admin Only

// Coupon evaluation
couponRoute.post("/applicable-coupons", getApplicableCoupons); //For All
couponRoute.post("/apply-coupon/:id", applySpecificCoupon); //For ALL
console.log("coupon routes called")
// couponRoute.get("/guessage",getTheCandidateAge);

export default couponRoute;
