// Imports
import { Types } from "mongoose";
import { ICourseModule, IModuleContent } from "./courseModule.interface";
import { CourseModule } from "./courseModule.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { ENUM_USER_ROLES } from "../../../enums/users";
import mongoose from "mongoose";
import { UserCourseProgress } from "../userCourseProgress/userCourseProgress.model";

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
  if (courseModule === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course Module does not exists.");
  }

  let newModuleData: ICourseModule | null = null;

  // Mongoose session started
  const session = await mongoose.startSession();

  try {
    // Starting Transaction
    session.startTransaction();

    // Adding the content to course module
    newModuleData = await CourseModule.findOneAndUpdate(
      { _id: new Types.ObjectId(moduleId) },
      {
        $push: {
          moduleContents: { ...payload },
        },
      },
      { new: true }
    );

    if (!newModuleData) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to add new content.");
    }

    const newAddedContent =
      newModuleData.moduleContents[newModuleData.moduleContents.length - 1];

    if (!newAddedContent) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to add new content.");
    }

    // Total module contents for this course
    const totalModuleContents = await CourseModule.aggregate([
      {
        $match: { courseId: new Types.ObjectId(newModuleData.courseId) },
      },
      {
        $project: {
          moduleContentsCount: { $size: "$moduleContents" },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: "$moduleContentsCount" },
        },
      },
    ]);

    const newTotalContentCount = totalModuleContents[0].count;

    // Find all users course progresses for this course
    const usersCourseProgresses = await UserCourseProgress.find({
      courseId: newModuleData.courseId,
    });

    // Updating each user course progress data
    usersCourseProgresses.forEach(async (data) => {
      if (data.percentage === 100) {
        data.current = {
          moduleId: (newModuleData as ICourseModule)._id,
          moduleNumber: (newModuleData as ICourseModule).moduleNumber,
          contentId: newAddedContent._id,
        };
      }

      // User new progress percentage
      data.percentage = Math.round(
        (data.completedContentCount / newTotalContentCount) * 100
      );

      const updateProgress = await UserCourseProgress.findOneAndUpdate(
        {
          user: data.user,
          courseId: data.courseId,
        },
        data,
        { new: true }
      );

      if (!updateProgress) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Failed to update user new progress data."
        );
      }
    });

    // Committing Transaction
    await session.commitTransaction();

    // Ending Session
    await session.endSession();
  } catch (error) {
    // Aborting Transaction because of error
    await session.abortTransaction();
    // Ending Session because of error
    await session.endSession();

    // Throwing error
    throw error;
  }

  return newModuleData;
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

  // Module contents
  const moduleContents = courseModule?.moduleContents;

  // Throwing error if module contents is empty
  if (!moduleContents.length) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "The module has no content to update."
    );
  }

  // Finding index
  const indexOfContentToUpdate = moduleContents.findIndex((content) =>
    content._id.equals(contentId)
  );

  if (indexOfContentToUpdate === -1) {
    // Throwing error if content is not found in module
    if (!moduleContents.length) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Content does not exists in module."
      );
    }
  }

  // Delete the content at the specified index
  moduleContents.splice(indexOfContentToUpdate, 1);

  // Inserting the updated content at the same index
  moduleContents.splice(indexOfContentToUpdate, 0, { ...payload });

  // Updating content
  const result = await CourseModule.findOneAndUpdate(
    { _id: moduleId },
    { moduleContents },
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
