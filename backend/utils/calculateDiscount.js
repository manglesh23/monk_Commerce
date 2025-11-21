export const calculateDiscount = async (coupon, cartItems, totalAmount) => {
  let discount = 0;

  // ---------------------------------------------
  // CART-WISE
  // ---------------------------------------------
  if (coupon.type === "CART_WISE") {
    if (totalAmount >= coupon.minCartAmount) {
      discount =
        coupon.discountType === "flat"
          ? coupon.discountValue
          : (totalAmount * coupon.discountValue) / 100;
    }
  }

  // ---------------------------------------------
  // PRODUCT-WISE
  // ---------------------------------------------
  if (coupon.type === "PRODUCT_WISE") {
    for (let item of cartItems) {
      if (
        coupon.applicableProducts
          .map((p) => p._id.toString())
          .includes(item.productId)
      ) {
        const itemTotal = item.price * item.quantity;

        discount +=
          coupon.discountType === "flat"
            ? coupon.discountValue
            : (itemTotal * coupon.discountValue) / 100;
      }
    }
  }

  // ---------------------------------------------
  // BXGY
  // ---------------------------------------------
  if (coupon.type === "BXGY") {
    let offerRepeats = Infinity;

    for (let bp of coupon.buyProducts) {
      const cartItem = cartItems.find(
        (c) => c.productId === bp.productId._id.toString()
      );
      if (!cartItem) continue;

      const repeatsForThisProduct = Math.floor(
        cartItem.quantity / bp.quantity
      );

      offerRepeats = Math.min(offerRepeats, repeatsForThisProduct);
    }

    offerRepeats = Math.min(offerRepeats, coupon.repetitionLimit);

    if (offerRepeats > 0) {
      coupon.getProducts.forEach((gp) => {
        discount += offerRepeats * gp.quantity * gp.productId.price;
      });
    }
  }

  return discount;
};
