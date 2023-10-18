//Imports
import { Model } from "mongoose";
import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export type IFeedback = {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  feedback: string;
};

export type FeedbackModel = Model<IFeedback>;

export type IFeedbackFilters = {
  searchTerm?: string | undefined;
  userId?: string | undefined;
};
