//Imports
import { Model } from "mongoose";
import { Types } from "mongoose";

export type IModuleContent = {
  _id: Types.ObjectId;
  title: string;
  type: "video" | "quiz";
  link: string;
  duration?: number;
};

export type ICourseModule = {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  moduleNumber: number;
  moduleName: string;
  moduleContents: IModuleContent[];
};

export type CourseModuleModel = Model<ICourseModule>;
