// Imports
import { Schema, model } from "mongoose";
import { CartModel, ICart } from "./cart.interface";

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
        default: [],
      },
    ],
    payment: {
      subTotal: {
        type: Number,
        default: 0.0,
        set: (value: number) => parseFloat(value.toFixed(2)),
      },
      tax: {
        type: Number,
        default: 0.0,
        set: (value: number) => parseFloat(value.toFixed(2)),
      },
      grandTotal: {
        type: Number,
        default: 0.0,
        set: (value: number) => parseFloat(value.toFixed(2)),
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Cart = model<ICart, CartModel>("Cart", cartSchema);
