import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: String,
  last_name: String,
  email: {type: String, unique: true},
  age: Number,
  password: String,
  cart: {type: mongoose.Schema.Types.ObjectId, ref:"carts"},
  rol: {type: String, default: "user", enum: ["user", "admin", "premium"]},
  active: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  last_connection: Date,
  documents: [{
    name:{type: String, unique: true},
    reference: String,
    status: {type: String, default: "Pending"},
  }],
});


export const userModel = mongoose.model(userCollection, userSchema);
