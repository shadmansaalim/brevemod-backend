//Imports
import { Model } from "mongoose";
import { Types } from "mongoose";

export type IUserCourseRating = {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
};

export type UserCourseRatingModel = Model<IUserCourseRating>;
