//Imports
import { Model } from "mongoose";
import { Types } from "mongoose";
import { ICourse } from "../course/course.interface";
import { IUser } from "../user/user.interface";

export type ICourseReview = {
  _id: Types.ObjectId;
  courseId: Types.ObjectId | ICourse;
  userId: Types.ObjectId | IUser;
  rating: number;
  words: string;
};

export type CourseReviewModel = Model<ICourseReview>;
