//Imports
import { Model } from "mongoose";
import { Types } from "mongoose";
import { ICourse } from "../course/course.interface";
import { IUser } from "../user/user.interface";

export type IUserCourseProgress = {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  courseId: Types.ObjectId | ICourse;
  completed: {
    moduleId: Types.ObjectId;
    moduleNumber: number;
    contentId: Types.ObjectId;
  }[];
  current: {
    moduleId: Types.ObjectId;
    moduleNumber: number;
    contentId: Types.ObjectId;
  };
  completedContentCount: number;
  percentage: number;
};

export type UserCourseProgressModel = Model<IUserCourseProgress>;
