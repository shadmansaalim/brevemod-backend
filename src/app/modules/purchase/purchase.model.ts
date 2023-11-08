// Imports
import { Schema, model } from "mongoose";
import { IPurchase, PurchaseModel } from "./purchase.interface";

const purchaseSchema = new Schema<IPurchase>(
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
  },
  {
    timestamps: true,
  }
);

export const Purchase = model<IPurchase, PurchaseModel>(
  "Purchase",
  purchaseSchema
);
