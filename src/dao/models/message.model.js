import mongoose from "mongoose";

const userCollection = "messages";

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
});

export const messageModel = mongoose.model(userCollection, messageSchema);
