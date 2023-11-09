// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IUser } from "../user/user.interface";
import { IPurchase } from "./purchase.interface";
import { PurchaseService } from "./purchase.service";
import { ICourse } from "../course/course.interface";

const getMyCourses = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const result = await PurchaseService.getMyCourses(user.id);

  sendResponse<ICourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My courses retrieved successfully.",
    data: result,
  });
});

const getIsCoursePurchased = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;
  const { courseId } = req.params;

  const result = await PurchaseService.getIsCoursePurchased(user.id, courseId);

  sendResponse<boolean>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course purchase status retrieved successfully.",
    data: result,
  });
});

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const result = await PurchaseService.createPaymentIntent(user.id);

  sendResponse<{ clientSecret: string }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment intent created successfully.",
    data: result,
  });
});

const purchaseCourse = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const result = await PurchaseService.purchaseCourse(user.id);

  sendResponse<IPurchase>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses purchased successfully.",
    data: result,
  });
});

const cancelEnrollment = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const { courseId } = req.params;

  const result = await PurchaseService.cancelEnrollment(user.id, courseId);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses enrollment cancelled successfully.",
    data: result,
  });
});

export const PurchaseController = {
  getIsCoursePurchased,
  getMyCourses,
  createPaymentIntent,
  purchaseCourse,
  cancelEnrollment,
};
