import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { title, description, price, stock, categories, images } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      categories,
      images,
      createdBy: "adminID", // admin ID
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};
