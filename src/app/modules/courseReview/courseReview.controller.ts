// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ICourseReview } from "./courseReview.interface";
import { CourseReviewService } from "./courseReview.service";

const addReviewToCourse = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const { courseId } = req.params;

  const { ...reviewData } = req.body;

  const result = await CourseReviewService.addReviewToCourse(
    courseId,
    user.id,
    reviewData
  );

  sendResponse<ICourseReview>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course review added successfully.",
    data: result,
  });
});

const getReviewsByCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const result = await CourseReviewService.getReviewsByCourse(courseId);

  sendResponse<ICourseReview[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course Reviews retrieved successfully",
    data: result,
  });
});

export const CourseReviewController = {
  addReviewToCourse,
  getReviewsByCourse,
};
