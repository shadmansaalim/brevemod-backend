// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { PaginationConstants } from "../../../constants/pagination";
import { FeedbackService } from "./feedback.service";
import { Feedback } from "./feedback.model";
import { IFeedback } from "./feedback.interface";
import { FeedbackConstants } from "./feedback.constant";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const { ...feedbackData } = req.body;
  const result = await FeedbackService.insertIntoDb(user.id, feedbackData);

  sendResponse<IFeedback>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedback added successfully.",
    data: result,
  });
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, FeedbackConstants.filterableFields);

  const paginationOptions = pick(req.query, PaginationConstants.fields);

  const result = await FeedbackService.getAllFromDb(filters, paginationOptions);

  sendResponse<IFeedback[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedbacks retrieved successfully.",
    meta: result?.meta,
    data: result?.data,
  });
});

const getOneById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FeedbackService.getOneById(id);

  sendResponse<IFeedback>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedback retrieved successfully",
    data: result,
  });
});

const getCurrentUserFeedback = catchAsync(
  async (req: Request, res: Response) => {
    // Getting authenticated user from request
    const user = (req as any).user;

    const result = await FeedbackService.getCurrentUserFeedback(user.id);

    sendResponse<IFeedback>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your feedback retrieved successfully",
      data: result,
    });
  }
);

const deleteOneById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await FeedbackService.deleteOneById(id);

  sendResponse<IFeedback>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedback deleted successfully.",
    data: result,
  });
});

export const FeedbackController = {
  insertIntoDb,
  getAllFromDb,
  getOneById,
  getCurrentUserFeedback,
  deleteOneById,
};
