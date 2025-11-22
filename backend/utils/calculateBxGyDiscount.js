 // ---------------------------------------------
  // DISCOUNT CALCULATION FOR COUPON BxGy
  // ---------------------------------------------
export function calculateBxGyDiscount(coupon, cartItems,productMap) {
  let discount = 0;

  const buyCounts = {};

  // Count items user is buying
  cartItems.forEach((item) => {
    buyCounts[item.productId] = item.quantity;
  });

  // Check how many "buy" conditions are met
  let possibleRepetitions = Infinity;

  coupon.buyProducts.forEach((rule) => {
    const available = buyCounts[rule.productId] || 0;
    const rep = Math.floor(available / rule.quantity);
    possibleRepetitions = Math.min(possibleRepetitions, rep);
  });

  possibleRepetitions = Math.min(possibleRepetitions, coupon.repetitionLimit);

  if (possibleRepetitions <= 0) return 0;

  // Total FREE items
  coupon.getProducts.forEach((getRule) => {
    discount += productMap[getRule.productId].price * getRule.quantity * possibleRepetitions;
  });

  return discount;
}
