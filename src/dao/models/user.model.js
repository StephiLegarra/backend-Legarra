import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts',
    required: true,
  },
  rol: { type: String, default: "user", enum: ["user", "admin"] },
  active: Boolean,
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.pre('find', function (next) {
  this.populate("cart.cartId");
  next();
});

export const userModel = mongoose.model(userCollection, userSchema);
