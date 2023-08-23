import mongoose from "mongoose";

const userCollection = "carts";

const cartSchema = new mongoose.Schema({
  id: Number,
  products: Array,
});

export const cartModel = mongoose.model(userCollection, cartSchema);
