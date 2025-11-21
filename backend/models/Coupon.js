import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },

  type: {
    type: String,
    enum: ["CART_WISE", "PRODUCT_WISE", "BXGY"],
    required: true,
  },

  // COMMON FIELDS
  discountType: {
    type: String,
    enum: ["flat", "percent"],
  },
  discountValue: Number,
  minCartAmount: Number,
  expiry: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 999999 },
  usedCount: { type: Number, default: 0 },

  // PRODUCT-WISE COUPON:
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  // BXGY COUPON
  buyProducts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  getProducts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  repetitionLimit: { type: Number, default: 1 }, // how many times BxGy can repeat
});

export default mongoose.model("Coupon", couponSchema);
