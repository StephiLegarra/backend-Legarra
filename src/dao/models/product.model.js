import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userCollection = "products";

const productSchema = new mongoose.Schema({
 // id: Number,
  title: String,
  description: String,
  code: {type: String, unique:true},
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnail: Array,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
   // default: "admin"
  }
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(userCollection, productSchema);
