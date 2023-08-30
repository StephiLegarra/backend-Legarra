import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(userCollection, productSchema);
