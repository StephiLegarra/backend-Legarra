import mongoose from "mongoose";

const userCollection = "carts";

const cartSchema = new mongoose.Schema({
  id: Number,
  products: [
    {
      product: {
        type: String,
        ref: "products",
      },
      quantity: Number,
    },
  ],
});

cartSchema.pre("findOne", function () {
  this.populate("products.product");
});

export const cartModel = mongoose.model(userCollection, cartSchema);
