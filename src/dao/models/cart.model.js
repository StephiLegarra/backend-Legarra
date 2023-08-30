import mongoose from "mongoose";

const userCollection = "carts";

const cartSchema = new mongoose.Schema({
  id: Number,
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId, // ver con id en vez de ObjectId si no funciona je
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
});

cartSchema.pre("findOne", function () {
  this.populate("products.product");
});

export const cartModel = mongoose.model(userCollection, cartSchema);
