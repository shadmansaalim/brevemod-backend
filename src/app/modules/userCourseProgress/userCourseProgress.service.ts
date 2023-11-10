// Imports
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { CourseModule } from "../courseModule/courseModule.model";
import { IUserCourseProgress } from "./userCourseProgress.interface";
import { UserCourseProgress } from "./userCourseProgress.model";
import { Types } from "mongoose";

const getUserCourseProgress = async (
  userId: string,
  courseId: string
): Promise<IUserCourseProgress | null> => {
  return await UserCourseProgress.findOne({ user: userId, courseId });
};

// const updateUserCourseProgress = async (
//   userId: string,
//   courseId: string
// ): Promise<IUserCourseProgress | null> => {
//   // Finding user progress
//   const userProgress = await UserCourseProgress.findOne({
//     user: userId,
//     courseId,
//   });

//   // Throwing error if user progress data not found
//   if (!userProgress) {
//     throw new ApiError(httpStatus.BAD_REQUEST, `User progress data not found`);
//   }

//   // Course First Time
//   if (userProgress?.progress.length === 0) {
//     const courseFirstModule = await CourseModule.findOne({
//       courseId,
//       moduleNumber: 1,
//     });

//     if (!courseFirstModule || !courseFirstModule.moduleContents.length) {
//       throw new ApiError(
//         httpStatus.BAD_REQUEST,
//         `The course didn't publish any module yet.`
//       );
//     }

//     const currentModuleId = courseFirstModule._id;
//     const currentModuleNumber = courseFirstModule.moduleNumber;
//     const currentContentId = courseFirstModule.moduleContents[0]._id;

//     userProgress.progress?.push({
//       moduleId: currentModuleId,
//       moduleNumber: currentModuleNumber,
//       contentId: currentContentId,
//       completed: false,
//     });
//   } else {
//   }

//   const currentModule = await CourseModule.findOne({});

//   const totalModuleContents = await CourseModule.aggregate([
//     {
//       $match: { courseId: new Types.ObjectId(courseId) },
//     },
//     {
//       $project: {
//         moduleContentsCount: { $size: "$moduleContents" },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         count: { $sum: "$moduleContentsCount" },
//       },
//     },
//   ]);

//   totalModuleContents[0].count;

//   userProgress.percentage = 2;

//   const updateProgress = await UserCourseProgress.findOneAndUpdate(
//     { user: userId, courseId },
//     userProgress,
//     { new: true }
//   );

//   return updateProgress;
// };

export const UserCourseProgressService = {
  getUserCourseProgress,
};
