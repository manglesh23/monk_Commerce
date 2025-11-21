import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: [String], // S3 urls
  categories: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

productSchema.index({
  title: "text",
  description: "text",
  categories: "text",
});

export default mongoose.model("Product", productSchema);
