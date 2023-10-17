import mongoose from "mongoose";

const userCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    id: Number,
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
          },
          quantity: { type: Number, default: 0 }
        },
      ],
    },
    user: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user"
                }
            }
        ]
    },
    reference: String
  });


  export const ticketModel = mongoose.model(userCollection, ticketSchema);
  

