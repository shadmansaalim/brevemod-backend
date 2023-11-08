//Imports
import { Model } from "mongoose";
import { Types } from "mongoose";
import { ICourse } from "../course/course.interface";

export type IPurchase = {
  user: Types.ObjectId;
  courses: Types.ObjectId[] | ICourse[];
};

export type PurchaseModel = Model<IPurchase>;
