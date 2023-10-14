// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PurchaseService } from "./purchase.service";

const purchaseCourse = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const result = await PurchaseService.purchaseCourse(user.id);

  sendResponse<{ clientSecret: string }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses purchased successfully.",
    data: result,
  });
});

export const PurchaseController = {
  purchaseCourse,
};
