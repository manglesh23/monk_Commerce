import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

 // -----------------------------------------------------------------------------
  // USER PLACE ORDER, USER ID IS HARDCODED CAN BE FETCHED FORM TOKEN
  // ----------------------------------------------------------------------------

export const placeOrder = async (req, res) => {
  try {
    const userId = "691dac6684e16f331e2c4b70";

    const cart = await Cart.findOne({ userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    //  console.log("Cart:-",cart.items[0].product)
    // 1. Validate stock for each product
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.title}`,
        });
      }
    }

    // 2. Deduct stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    // 3. Calculate total amount
    let totalAmount = 0;
    cart.items.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
    });

    // 4. Create order
    const order = await Order.create({
      userId,
      items: cart.items.map((i) => ({
        productId: i.product,
        quantity: i.quantity,
      })),
      totalAmount,
    });

    // 5. Clear cart
    cart.items = [];
    await cart.save();

    return res.json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
