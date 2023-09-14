import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, required: true, unique: true },
  age: Number,
  password: { type: String, required: true },
  rol: { type: String, default: "usuario", enum: ["usuario", "admin"] },
});

export const userModel = mongoose.model(userCollection, userSchema);
