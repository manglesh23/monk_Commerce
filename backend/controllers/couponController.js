import Coupon from "../models/Coupon.js";
import { calculateDiscount } from "../utils/calculateDiscount.js";
import Product from "../models/Product.js";
import { calculateCartWiseDiscount } from "../utils/calculateCartWiseDiscount.js";
import { calculateBxGyDiscount } from "../utils/calculateBxGyDiscount.js";
import { calculateProductWiseDiscount } from "../utils/calculateProductWiseDiscount.js";
// let coupon = [
//   { cartWise: { price: 1000, discount: 100 } },
//   { productWise: { productId: [1, 3], discount: 70 } },
//   { BxGy: { buyProduct: [1, 2], quantity: 3, getProduct: [3], discount: 30 } },
// ];

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      type, // CART_WISE | PRODUCT_WISE | BXGY

      // COMMON FIELDS
      discountType,
      discountValue,
      minCartAmount,
      expiry,
      isActive,
      usageLimit,

      // PRODUCT-WISE
      applicableProducts,

      // BXGY
      buyProducts,
      getProducts,
      repetitionLimit,
    } = req.body;

    // Basic validation: Coupon "type" is mandatory
    if (!type) {
      return res.status(400).json({ message: "Coupon type is required" });
    }

    // Type-specific validation
    if (type === "CART_WISE") {
      if (!discountType || !discountValue) {
        return res.status(400).json({
          message:
            "discountType and discountValue are required for CART_WISE coupon",
        });
      }
    }

    if (type === "PRODUCT_WISE") {
      if (
        !applicableProducts ||
        !Array.isArray(applicableProducts) ||
        applicableProducts.length === 0
      ) {
        return res.status(400).json({
          message:
            "applicableProducts array is required for PRODUCT_WISE coupon",
        });
      }
      if (!discountType || !discountValue) {
        return res.status(400).json({
          message:
            "discountType and discountValue are required for PRODUCT_WISE coupon",
        });
      }
    }

    if (type === "BXGY") {
      if (!buyProducts || buyProducts.length === 0) {
        return res
          .status(400)
          .json({ message: "buyProducts is required for BXGY coupon" });
      }
      if (!getProducts || getProducts.length === 0) {
        return res
          .status(400)
          .json({ message: "getProducts is required for BXGY coupon" });
      }
    }

    const coupon = await Coupon.create({
      code,
      type,

      // Common
      discountType,
      discountValue,
      minCartAmount,
      expiry,
      isActive,
      usageLimit,

      // Product-wise
      applicableProducts,

      // BXGY
      buyProducts,
      getProducts,
      repetitionLimit,
    });

    return res.json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving coupons" });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving coupon" });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    res.json({ message: "Coupon updated", coupon });
  } catch (err) {
    res.status(500).json({ message: "Error updating coupon" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting coupon" });
  }
};

// import Coupon from "../models/Coupon.js";
// import Product from "../models/Product.js";

export const getApplicableCoupons = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart cannot be empty" });
    }

    // Fetch product details for each product in cart
    const productIds = cartItems.map((c) => c.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Map products by ID for fast lookup
    let productMap = {};
    products.forEach((p) => (productMap[p._id] = p));

    // Calculate cart total
    let cartTotal = 0;
    cartItems.forEach((item) => {
      cartTotal += productMap[item.productId].price * item.quantity;
    });

    // Fetch active coupons
    const coupons = await Coupon.find({
      isActive: true,
      expiry: { $gt: new Date() },
    });

    const results = [];

    for (const coupon of coupons) {
      let discount = 0;

      if (coupon.type === "CART_WISE") {
        discount = calculateCartWiseDiscount(coupon, cartTotal);
      }

      if (coupon.type === "PRODUCT_WISE") {
        discount = calculateProductWiseDiscount(coupon, cartItems, productMap);
      }

      if (coupon.type === "BXGY") {
        discount = calculateBxGyDiscount(coupon, cartItems, productMap);
      }

      if (discount > 0) {
        results.push({
          couponId: coupon._id,
        //   code: coupon.code,
          type: coupon.type,
          discount,
          // isApplicable: discount > 0,
        });
      }
    }

    return res.json({ applicableCoupons: results });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const applySpecificCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart cannot be empty" });
    }

    // Fetch coupon
    const coupon = await Coupon.findOne({
      _id: id,
      isActive: true,
      expiry: { $gt: new Date() }
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or expired" });
    }

    // Fetch product details
    const productIds = cartItems.map((c) => c.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    console.log("Products:-",products)
    // Product map for lookup
    const productMap = {};
    products.forEach((p) => (productMap[p._id] = p));

    // Calculate cart total
    let cartTotal = 0;
    cartItems.forEach((item) => {
      cartTotal += productMap[item.productId].price * item.quantity;
    });

    let discount = 0;

    // HANDLE EACH COUPON TYPE
    if (coupon.type === "CART_WISE") {
      discount = calculateCartWiseDiscount(coupon, cartTotal);
    }

    if (coupon.type === "PRODUCT_WISE") {
      discount = calculateProductWiseDiscount(coupon, cartItems, productMap);
    }

    if (coupon.type === "BXGY") {
      discount = calculateBxGyDiscount(coupon, cartItems, productMap);
    }

    const finalTotal = Math.max(cartTotal - discount, 0);

    return res.json({updated_cart:{
    //   message: "Coupon applied successfully",
      items:cartItems,
      coupon: coupon.code,
      total_price:cartTotal,
      total_discount:discount,
      final_price:finalTotal
    }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const applyCoupon = async (req, res) => {
//   try {
//     console.log(coupon[0].cartWise.price);
//     const { cartItems, quantity, totalAmount } = req.body;
//     // console.log(cartItems,quantity, totalAmount);

//     let getSetCartItem = new Set(cartItems);

//     let getTotalDiscount = 0;
//     if (totalAmount >= coupon[0].cartWise.price) {
//       getTotalDiscount += coupon[0].cartWise.discount;
//       //   console.log(1);
//     }
//     // console.log(coupon[1].productWise.productId);

//     let getProductDiscount = coupon[1].productWise.productId.filter((item) =>
//       getSetCartItem.has(item)
//     );
//     // console.log("Product Discount:-", getProductDiscount);
//     if (getProductDiscount.length > 0) {
//       getTotalDiscount += coupon[1].productWise.discount;
//     }
//     // console.log(getTotalDiscount);
//     let getBxGyBuyProduct = coupon[2].BxGy.buyProduct.filter((item) =>
//       getSetCartItem.has(item)
//     );
//     let getBxGyGetProduct = coupon[2].BxGy.getProduct.filter((item) =>
//       getSetCartItem.has(item)
//     );
//     console.log("get buy:-", getBxGyBuyProduct, getBxGyGetProduct);

//     if (
//       getBxGyBuyProduct.length > 0 &&
//       getBxGyGetProduct.length &&
//       quantity >= coupon[2].BxGy.quantity
//     ) {
//       console.log("Applicable");
//       getTotalDiscount += coupon[2].BxGy.discount;
//     } else {
//       console.log("Not Applicable");
//     }

//     res.status(200).json({ message: `got it ${getTotalDiscount}` });
//   } catch (e) {
//     return {
//       error: true,
//       details: e,
//     };
//   }
// };
