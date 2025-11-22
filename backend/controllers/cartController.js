import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    //userId= req.user.id                           //In authRoutes while token is generated and through that token user id and role can be fetched
    const userId = "691dac6684e16f331e2c4b70";      //For test hardcoded this
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    
    if (!product) return res.status(404).json({ message: "Product not found" });

    
    let cart = await Cart.findOne({ userId: userId });   // Check if user has a cart

    
    if (!cart) {                                        // If no cart → create one
      cart = await Cart.create({
        userId: userId,
        items: [{ product: productId, quantity }],
      });
      return res.json({ message: "Product added to new cart", cart });
    }

   
    const itemIndex = cart.items.findIndex(              // If cart exists → check if item already exists
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      
      cart.items[itemIndex].quantity += quantity;        // Update quantity
    } else {
     
      cart.items.push({ product: productId, quantity });   // Push new product to array
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

    if (!cart) return res.json({ items: [] });                // empty cart

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
