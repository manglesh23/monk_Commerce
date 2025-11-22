import mongoose from "mongoose";

 // ---------------------------------------------
  // USER SCHEMA
  // ---------------------------------------------
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
  address: [
    {
      label: String,
      line1: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
    },
  ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  createdAt: { type: Date, default: Date.now },
});

const User= mongoose.model("User", userSchema);
export default User
