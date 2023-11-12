// Imports
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { CourseModule } from "../courseModule/courseModule.model";
import { IUserCourseProgress } from "./userCourseProgress.interface";
import { UserCourseProgress } from "./userCourseProgress.model";
import { Types } from "mongoose";

const startCourse = async (
  userId: string,
  courseId: string
): Promise<IUserCourseProgress | null> => {
  // Finding course first module
  const courseFirstModule = await CourseModule.findOne({
    courseId,
    moduleNumber: 1,
  });

  if (!courseFirstModule || courseFirstModule.moduleContents.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Course content is not ready yet.`
    );
  }

  // Throwing error if first module not found
  const userProgress = await UserCourseProgress.create({
    user: userId,
    courseId,
    current: {
      moduleId: courseFirstModule._id,
      moduleNumber: courseFirstModule.moduleNumber,
      contentId: courseFirstModule.moduleContents[0]._id,
    },
  });

  return userProgress;
};

const getUserCourseProgress = async (
  userId: string,
  courseId: string
): Promise<IUserCourseProgress | null> => {
  return await UserCourseProgress.findOne({ user: userId, courseId });
};

const updateUserCourseProgress = async (
  userId: string,
  courseId: string
): Promise<IUserCourseProgress | null> => {
  // Finding user progress
  const userProgress = await UserCourseProgress.findOne({
    user: userId,
    courseId,
  });

  // Throwing error if user progress data not found
  if (!userProgress) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `User has not started course yet.`
    );
  }

  // Moving the current content to completed
  userProgress.completed = [...userProgress.completed, userProgress.current];
  userProgress.completedContentCount += 1;

  // Finding current module
  const currentModule = await CourseModule.findOne({
    _id: userProgress.current.moduleId,
  });

  // Throwing error if fails
  if (!currentModule) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Something went wrong.`);
  }

  const currentContentIndex = currentModule.moduleContents.findIndex(
    (content) => content._id.equals(userProgress.current.contentId)
  );

  // Throwing error if fails
  if (currentContentIndex === -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Something went wrong.`);
  }

  // Move to next content in same module
  if (currentContentIndex != currentModule.moduleContents.length - 1) {
    // Next content
    const nextContent = currentModule.moduleContents[currentContentIndex + 1];
    userProgress.current.contentId = nextContent._id;
  }
  // Move to next module first content
  else {
    // Next module
    const nextModule = await CourseModule.findOne({
      moduleNumber: currentModule.moduleNumber + 1,
    });

    // Throwing error if there is no next module
    if (!nextModule) {
      throw new ApiError(httpStatus.BAD_REQUEST, `No next module yet.`);
    }

    // Throwing error if there is no content in next module
    if (!nextModule.moduleContents.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `No content uploaded in next module.`
      );
    }

    // Next Module first content
    const moduleFirstContent = nextModule.moduleContents[0];

    userProgress.current = {
      moduleId: nextModule._id,
      moduleNumber: nextModule.moduleNumber,
      contentId: moduleFirstContent._id,
    };
  }

  // Total module contents for this course
  const totalModuleContents = await CourseModule.aggregate([
    {
      $match: { courseId: new Types.ObjectId(courseId) },
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

  // Calculating progress percentage
  userProgress.percentage = Math.round(
    (userProgress.completedContentCount / totalModuleContents[0].count) * 100
  );

  const updateProgress = await UserCourseProgress.findOneAndUpdate(
    { user: userId, courseId },
    userProgress,
    { new: true }
  );

  return updateProgress;
};

export const UserCourseProgressService = {
  startCourse,
  getUserCourseProgress,
  updateUserCourseProgress,
};
