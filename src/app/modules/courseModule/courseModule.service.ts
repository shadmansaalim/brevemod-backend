// Imports
import { Types } from "mongoose";
import { ICourseModule, IModuleContent } from "./courseModule.interface";
import { CourseModule } from "./courseModule.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { ENUM_USER_ROLES } from "../../../enums/users";

const createCourseModule = async (
  payload: ICourseModule
): Promise<ICourseModule> => {
  const courseModulesCount = await CourseModule.find({
    courseId: new Types.ObjectId(payload.courseId),
  }).count();

  // Setting the module number
  payload.moduleNumber = courseModulesCount + 1;

  return await CourseModule.create({
    ...payload,
  });
};

const updateCourseModule = async (
  moduleId: string,
  moduleName: string
): Promise<ICourseModule | null> => {
  return await CourseModule.findOneAndUpdate(
    {
      _id: moduleId,
    },
    {
      moduleName,
    },
    { new: true }
  );
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

const updateContentInCourseModule = async (
  moduleId: string,
  contentId: string,
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

  const newModuleContents = courseModule.moduleContents.filter(
    (content) => !content._id.equals(contentId)
  );

  newModuleContents.push({ ...payload });

  // Updating content
  const result = await CourseModule.findOneAndUpdate(
    { _id: moduleId },
    {
      moduleContents: newModuleContents,
    },
    { new: true }
  );

  return result;
};

const deleteContentFromCourseModule = async (
  moduleId: string,
  contentId: string
): Promise<ICourseModule | null> => {
  // Finding course module
  const courseModule = await CourseModule.findOne({
    _id: new Types.ObjectId(moduleId),
  });

  // Throwing error if course module not found
  if (!courseModule) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course Module does not exists.");
  }

  const newModuleContents = courseModule.moduleContents.filter(
    (content) => !content._id.equals(contentId)
  );

  // Updating content
  const result = await CourseModule.findOneAndUpdate(
    { _id: moduleId },
    {
      moduleContents: newModuleContents,
    },
    { new: true }
  );

  return result;
};

const getAllModulesByCourse = async (
  userRole: ENUM_USER_ROLES,
  courseId: string
): Promise<ICourseModule[]> => {
  const searchingConditions: any = { courseId };

  // For students just retrieving modules with content
  if (userRole === ENUM_USER_ROLES.STUDENT) {
    searchingConditions["moduleContents.0"] = { $exists: true };
  }

  return await CourseModule.find(searchingConditions).sort({
    moduleNumber: "asc",
  });
};

const isCourseContentPublished = async (courseId: string): Promise<boolean> => {
  // Finding course module for this course
  const courseModuleAvailable = await CourseModule.findOne({ courseId });

  // Returning false if no module
  if (!courseModuleAvailable || !courseModuleAvailable.moduleContents.length) {
    return false;
  } else {
    return true;
  }
};

const isValidContent = async (
  courseId: string,
  moduleId: string,
  contentId: string
): Promise<boolean> => {
  // Finding course module for this course
  const courseModule = await CourseModule.findOne({
    _id: moduleId,
    courseId,
  });

  // Returning false if no module
  if (!courseModule || !courseModule.moduleContents.length) {
    return false;
  }

  // Finding requested content
  const requestedContent = courseModule.moduleContents.find((content) =>
    content._id.equals(contentId)
  );

  if (requestedContent) {
    return true;
  } else {
    return false;
  }
};

export const CourseModuleService = {
  createCourseModule,
  updateCourseModule,
  addContentToCourseModule,
  updateContentInCourseModule,
  deleteContentFromCourseModule,
  getAllModulesByCourse,
  isCourseContentPublished,
  isValidContent,
};
