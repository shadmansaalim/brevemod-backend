//Imports
import { Model } from "mongoose";
import { Types } from "mongoose";
import { ICourse } from "../course/course.interface";
import { IUser } from "../user/user.interface";

export type ICourseReview = {
  _id: Types.ObjectId;
  course: Types.ObjectId | ICourse;
  user: Types.ObjectId | IUser;
  rating: number;
  words: string;
};

export type CourseReviewModel = Model<ICourseReview>;
