// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { PaginationConstants } from "../../../constants/pagination";
import { CourseService } from "./course.service";
import { ICourse } from "./course.interface";
import { CourseConstants } from "./course.constant";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const { ...courseData } = req.body;
  const result = await CourseService.insertIntoDb(courseData);

  sendResponse<ICourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course created successfully.",
    data: result,
  });
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, CourseConstants.filterableFields);

  const paginationOptions = pick(req.query, PaginationConstants.fields);

  const result = await CourseService.getAllFromDb(filters, paginationOptions);

  sendResponse<ICourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses retrieved successfully.",
    meta: result?.meta,
    data: result?.data,
  });
});

const getOneById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.getOneById(id);

  sendResponse<ICourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result,
  });
});

const updateOneById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await CourseService.updateOneById(id, updatedData);

  sendResponse<ICourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

const deleteOneById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CourseService.deleteOneById(id);

  sendResponse<ICourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course deleted successfully.",
    data: result,
  });
});

export const CourseController = {
  insertIntoDb,
  getAllFromDb,
  getOneById,
  updateOneById,
  deleteOneById,
};
