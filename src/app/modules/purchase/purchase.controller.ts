// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IUser } from "../user/user.interface";
import { PurchaseService } from "./purchase.service";

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

  sendResponse<IUser>(res, {
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
  createPaymentIntent,
  purchaseCourse,
  cancelEnrollment,
};
