// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IUserCourseProgress } from "./userCourseProgress.interface";
import { UserCourseProgressService } from "./userCourseProgress.service";

const startCourse = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const { courseId } = req.params;

  const result = await UserCourseProgressService.startCourse(user.id, courseId);

  sendResponse<IUserCourseProgress>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User course started successfully.",
    data: result,
  });
});

const getUserCourseProgress = catchAsync(
  async (req: Request, res: Response) => {
    // Getting authenticated user from request
    const user = (req as any).user;

    const { courseId } = req.params;

    const result = await UserCourseProgressService.getUserCourseProgress(
      user.id,
      courseId
    );

    sendResponse<IUserCourseProgress>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User course progress retrieved successfully",
      data: result,
    });
  }
);
const updateUserCourseProgress = catchAsync(
  async (req: Request, res: Response) => {
    // Getting authenticated user from request
    const user = (req as any).user;

    const { courseId } = req.params;

    const result = await UserCourseProgressService.updateUserCourseProgress(
      user.id,
      courseId
    );

    sendResponse<IUserCourseProgress>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User course progress updated successfully",
      data: result,
    });
  }
);

export const UserCourseProgressController = {
  startCourse,
  getUserCourseProgress,
  updateUserCourseProgress,
};
