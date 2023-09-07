import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  id: Number,
  first_name: String,
  last_name: String,
  email: { type: String, required: true, unique: true },
  age: Number,
  password: { type: String, required: true },
  cart: String,
  role: String,
});

export const userModel = mongoose.model(userCollection, userSchema);
