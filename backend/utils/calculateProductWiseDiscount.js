export function calculateProductWiseDiscount(coupon, cartItems, productMap) {
  let discount = 0;

  cartItems.forEach((item) => {
    if (coupon.applicableProducts.includes(item.productId)) {
      const productPrice = productMap[item.productId].price;

      if (coupon.discountType === "flat") {
        discount += coupon.discountValue * item.quantity;
      }

      if (coupon.discountType === "percent") {
        discount += (productPrice * coupon.discountValue) / 100 * item.quantity;
      }
    }
  });

  return discount;
}
