export function calculateCartWiseDiscount(coupon, cartTotal) {
  if (cartTotal < (coupon.minCartAmount || 0)) return 0;

  if (coupon.discountType === "flat") {
    return coupon.discountValue;
  }

  if (coupon.discountType === "percent") {
    return (cartTotal * coupon.discountValue) / 100;
  }

  return 0;
}
