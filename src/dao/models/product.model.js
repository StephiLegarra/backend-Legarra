import mongoose from "mongoose";

const userCollection = "products";

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnail: Array,
});

export const productModel = mongoose.model(userCollection, productSchema);
