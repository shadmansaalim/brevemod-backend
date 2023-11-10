// Imports
import { Types } from "mongoose";
import { ICourseModule, IModuleContent } from "./courseModule.interface";
import { CourseModule } from "./courseModule.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createCourseModule = async (
  payload: ICourseModule
): Promise<ICourseModule> => {
  return await CourseModule.create(payload);
};

const addContentToCourseModule = async (
  moduleId: string,
  payload: IModuleContent
): Promise<ICourseModule | null> => {
  // Finding course module
  const courseModule = await CourseModule.findOne({
    _id: new Types.ObjectId(moduleId),
  });

  // Throwing error if course module not found
  if (!courseModule) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course Module does not exists.");
  }

  // Adding the content to course module
  const result = await CourseModule.findOneAndUpdate(
    { _id: new Types.ObjectId(moduleId) },
    {
      $push: {
        moduleContents: {
          ...payload,
        },
      },
    },
    { new: true }
  );

  return result;
};

const getAllModulesByCourse = async (
  courseId: string
): Promise<ICourseModule[]> => {
  return await CourseModule.find({
    courseId: new Types.ObjectId(courseId),
  }).sort({ moduleNumber: "asc" });
};

export const CourseModuleService = {
  createCourseModule,
  addContentToCourseModule,
  getAllModulesByCourse,
};
