import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, required: true },
  age: Number,
  password: { type: String, required: true },
  role: String,
});

export const userModel = mongoose.model(userCollection, userSchema);
