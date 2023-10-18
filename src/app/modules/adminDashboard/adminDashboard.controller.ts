// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AdminDashboardService } from "./adminDashboard.service";

const getAdminDashboardData = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AdminDashboardService.getAdminDashboardData();

    sendResponse<{
      coursesCount: number;
      usersCount: number;
      courseReviewsCount: number;
      feedbacksCount: number;
    }>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Dashboard data retrieved successfully.",
      data: result,
    });
  }
);

export const AdminDashboardController = {
  getAdminDashboardData,
};
