//Imports
import { Model } from "mongoose";
import { Types } from "mongoose";

export type ICart = {
  user: Types.ObjectId;
  courses: Types.ObjectId[];
  payment: {
    subTotal: number;
    tax: number;
    grandTotal: number;
  };
};

export type CartModel = Model<ICart>;
