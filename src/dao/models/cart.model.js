import mongoose from "mongoose";

const userCollection = "carts";

const cartSchema = new mongoose.Schema({
  id: Number,
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
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

cartSchema.pre('findOne', function () {
  this.populate("products.product");
});
cartSchema.plugin(mongoosePaginate);

export const cartModel = mongoose.model(userCollection, cartSchema);
