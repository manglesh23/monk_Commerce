import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    //userId= req.user.id
    const userId = "691dac6684e16f331e2c4b70"; 
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user has a cart
    let cart = await Cart.findOne({ userId: userId });

    // If no cart → create one
    if (!cart) {
      cart = await Cart.create({
        userId: userId,
        items: [{ product: productId, quantity }],
      });
      return res.json({ message: "Product added to new cart", cart });
    }

    // If cart exists → check if item already exists
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Push new product to array
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};


export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart) return res.json({ items: [] }); // empty cart

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error getting cart", error });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;

    await cart.save();

    res.json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] }
    );

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};
