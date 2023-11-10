//Imports
import { Model } from "mongoose";
import { Types } from "mongoose";
import { ICourse } from "../course/course.interface";

export type IModuleContent = {
  _id: Types.ObjectId;
  title: string;
  type: "video" | "quiz";
  link: string;
  duration?: number;
};

export type ICourseModule = {
  _id: Types.ObjectId;
  courseId: Types.ObjectId | ICourse;
  moduleNumber: number;
  moduleName: string;
  moduleContents: IModuleContent[];
};

export type CourseModuleModel = Model<ICourseModule>;
